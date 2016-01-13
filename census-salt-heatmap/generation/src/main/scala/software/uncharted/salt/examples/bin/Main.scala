package software.uncharted.censushackathon2016s

import org.apache.spark.SparkContext
import org.apache.spark.SparkConf
import org.apache.spark.sql.SQLContext
import org.apache.spark.sql.Row

import software.uncharted.sparkpipe.Pipe
import software.uncharted.sparkpipe.ops

import software.uncharted.salt.core.generation.request._
import software.uncharted.salt.core.generation.mapreduce.MapReduceTileGenerator

object Main {
  def main(args: Array[String]): Unit = {
    if (args.length < 2) {
      println("Requires commandline: <spark-submit command> inputFilePath outputPath")
      System.exit(-1)
    }

    val inputPath = args(0)
    val outputPath = args(1)

    val conf = new SparkConf().setAppName("salt-bin-example")
    val sc = new SparkContext(conf)
    val sqlContext = new SQLContext(sc)

    // Construct an RDD of Rows containing only the fields we need. Cache the result
    val input = Pipe(sqlContext)
      .to(ops.core.dataframe.io.read(
        s"file://$inputPath",
        "com.databricks.spark.csv",
        Map("inferSchema" -> "true", "header" -> "true"))
      )
      .to(ops.core.dataframe.castColumns(Map("latitude" -> "double", "longitude" -> "double")))
      .to(_.select("longitude", "latitude"))
      .to(ops.core.dataframe.cache)
      .to(ops.core.dataframe.toRDD)
      .to(sourceData => {

        // Tile Generator object, which houses the generation logic
        val gen = new MapReduceTileGenerator(sc)

        // Break levels into batches. Process several higher levels at once because the
        // number of tile outputs is quite low. Lower levels done individually due to high tile counts.
        val levelBatches = List(List(0, 1, 2, 3, 4, 5, 6, 7, 8), List(9, 10, 11), List(12), List(13))

        // Iterate over sets of levels to generate.
        Pipe(levelBatches)
        .to(_.map(level => {

          println("------------------------------")
          println(s"Generating level $level")
          println("------------------------------")

          // Create a request for all tiles on these levels, generate
          val request = new TileLevelRequest(level, (coord: (Int, Int, Int)) => coord._1)
          val tiles = gen.generate(sourceData, PermitsHeatMap.series(level), request)
          PermitsHeatMap.output(level, tiles, outputPath)
        }))
        .run;

      })
      .run;
  }
}
