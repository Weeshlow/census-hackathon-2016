package software.uncharted.censushackathon2016

import org.apache.spark.SparkContext
import org.apache.spark.SparkConf
import org.apache.spark.sql.SQLContext
import org.apache.spark.sql.Row

import software.uncharted.sparkpipe.Pipe
import software.uncharted.sparkpipe.ops

import software.uncharted.salt.core.generation.request.TileLevelRequest
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
      .to(ops.core.dataframe.castColumns(Map("latitude" -> "double", "longitude" -> "double", "amount" -> "double")))
      .to(_.select("longitude", "latitude", "amount", "type"))
      .to(ops.core.dataframe.cache)
      .to(ops.core.dataframe.toRDD)
      .to(sourceData => {

        // Tile Generator object, which houses the generation logic
        val gen = new MapReduceTileGenerator(sc)

        // Break levels into batches. Process several higher levels at once because the
        // number of tile outputs is quite low. Lower levels done individually due to high tile counts.
        val levelBatches = List(Range(0, 4), Range(4,8), Range(8, 10), List(10), List(11))

        // Iterate over sets of levels to generate.
        Pipe(levelBatches)
        .to(_.map(level => {

          println("------------------------------")
          println(s"Generating level $level")
          println("------------------------------")

          val permits = new PermitsHeatMap(level)
          val amounts = new CumulativeAmountsHeatMap(level)
          val types = new WordCloud(level, 3)

          // Create a request for all tiles on these levels, generate
          val request = new TileLevelRequest(level, (coord: (Int, Int, Int)) => coord._1)
          val tiles = gen.generate(
            sourceData,
            Seq(permits.series, amounts.series, types.series),
            request
          )
          permits.output(level, tiles, outputPath)
          amounts.output(level, tiles, outputPath)
          types.output(level, tiles, outputPath)
        }))
        .run;

      })
      .run;
  }
}
