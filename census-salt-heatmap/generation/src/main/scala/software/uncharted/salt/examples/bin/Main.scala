package software.uncharted.censushackathon2016s

import org.apache.spark.SparkContext
import org.apache.spark.SparkConf
import org.apache.spark.sql.SQLContext
import org.apache.spark.sql.Row

import software.uncharted.sparkpipe.Pipe
import software.uncharted.sparkpipe.ops

object Main {

  // Defines the tile size in both x and y bin dimensions
  val tileSize = 256

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
                .to(ops.core.dataframe.cache)


    // TODO generalize PermitsHeatMap to return a Series so that we can tile a bunch of stuff in parallel!
    PermitsHeatMap.generate(sc, input, tileSize, outputPath)
  }
}
