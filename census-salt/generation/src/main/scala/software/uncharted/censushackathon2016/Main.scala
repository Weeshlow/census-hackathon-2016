package software.uncharted.censushackathon2016
import scala.sys
import org.apache.spark.SparkContext
import org.apache.spark.SparkConf
import org.apache.spark.sql.SQLContext
import org.apache.spark.sql.Row

import java.sql.Timestamp

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

    // Break levels into batches. Process several higher levels at once because the
    // number of tile outputs is quite low. Lower levels done individually due to high tile counts.
    val levelBatches = List(Range(0, 4), Range(4,8), Range(8, 10), List(10), List(11))

    val outputter = new S3UploaderFactory(sys.env("AWS_ACCESS_KEY"),
                                          sys.env("AWS_SECRET_KEY"),
                                          "xdata-tiles",
                                          "census-hackathon-2016")

    // Construct an RDD of Rows containing only the fields we need. Cache the result
    val input = Pipe(sqlContext)
      .to(ops.core.dataframe.io.read(
        s"hdfs://$inputPath",
        "com.databricks.spark.csv",
        Map("inferSchema" -> "true", "header" -> "true"))
      )
      .to(ops.core.dataframe.castColumns(Map(
        "latitude" -> "double",
        "longitude" -> "double",
        // "amount" -> "double",
        // "timestamp" -> "timestamp",
        "topics" -> "string"))
      )
      // .to(ops.core.dataframe.replaceColumn("timestamp", (t: Timestamp) => {
      //   if (t == null) None else Some(t.getTime())
      // }: Option[Long]))
      // .to(ops.core.dataframe.replaceColumn("amount", (a: java.lang.Double) => {
      //   if (a == null) None else Some(a/100.0)
      // }: Option[Double]))
      .to(input => {
        jobs.TileJob.run(input, levelBatches, outputter)
        // jobs.TimeSlicePermits.run(input, levelBatches, outputter, 466232400000L, 1454112000000L, 50)
      })
      .run;
  }
}
