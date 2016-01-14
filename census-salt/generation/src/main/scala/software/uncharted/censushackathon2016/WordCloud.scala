package software.uncharted.censushackathon2016

import org.json.JSONObject

import java.io.{File, FileOutputStream}

import org.apache.spark.SparkContext
import org.apache.spark.rdd.RDD
import org.apache.spark.sql.{Row, DataFrame}

import software.uncharted.sparkpipe.Pipe
import software.uncharted.sparkpipe.ops

import software.uncharted.salt.core.projection.numeric.MercatorProjection
import software.uncharted.salt.core.generation.Series
import software.uncharted.salt.core.generation.output.{Tile, SeriesData}
import software.uncharted.salt.core.analytic.collection.TopElementsAggregator

class WordCloud(levels: Seq[Int], termColumnIndex: Int) extends Serializable {
  // Defines the output layer name
  private val layerName = "description-word-cloud"

  // Given an input row, return permit longitude, latitude as a tuple
  private val permitExtractor = (r: Row) => {
    if (r.isNullAt(0) || r.isNullAt(1)) {
      None
    } else {
      Some((r.getDouble(0), r.getDouble(1)))
    }
  }

  private val termExtractor = (r: Row) => {
    if (r.isNullAt(termColumnIndex)) {
      None
    } else {
      Some(Seq(r.getString(termColumnIndex)))
    }
  }

  val series = new Series((0, 0),
                          permitExtractor,
                          new MercatorProjection(levels),
                          Some(termExtractor),
                          new TopElementsAggregator[String](15),
                          None)

  // extract our SeriesData from each tile and write it to the filesystem
  def output(level: Seq[Int], tiles: RDD[Tile[(Int, Int, Int)]], outputPath: String) = {
    val seriesData = Pipe(tiles)
                     .to(_.map(series(_)))
    // seriesData
    .to(_.map(tile => {
      // Return tuples of tile coordinate, term counts
      (tile.coords, tile.bins(0))
    }))
    .to(_.collect())
    .to(_.foreach(tile => {
      val coord = tile._1
      val termCounts = tile._2
      val limit = (1 << coord._1) - 1
      // create and write JSONObject to string
      val json = new JSONObject()
      termCounts.foreach(t => {
        json.put(t._1, t._2)
      })
      // Use standard TMS path structure and file naming
      val file = new File(s"$outputPath/$layerName/${coord._1}/${coord._2}/${limit - coord._3}.json")
      file.getParentFile.mkdirs()
      val output = new FileOutputStream(file)
      output.write(json.toString.getBytes)
      output.close()
    }))
    .run
  }
}
