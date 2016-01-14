package software.uncharted.censushackathon2016

import java.io.{File, FileOutputStream}

import org.apache.spark.SparkContext
import org.apache.spark.rdd.RDD
import org.apache.spark.sql.{Row, DataFrame}

import scala.util.parsing.json.JSONObject

import software.uncharted.sparkpipe.Pipe
import software.uncharted.sparkpipe.ops

import software.uncharted.salt.core.projection.numeric.MercatorProjection
import software.uncharted.salt.core.generation.Series
import software.uncharted.salt.core.generation.output.{Tile, SeriesData}
import software.uncharted.salt.core.analytic.numeric.{CountAggregator, MinMaxAggregator}

class PermitsHeatMap(levels: Seq[Int]) extends Serializable {
  private val tileSize = 256;

  // Defines the output layer name
  private val layerName = "permits"

  // Given an input row, return permit longitude, latitude as a tuple
  private val permitExtractor = (r: Row) => {
    if (r.isNullAt(0) || r.isNullAt(1)) {
      None
    } else {
      Some((r.getDouble(0), r.getDouble(1)))
    }
  }

  val series = new Series((tileSize - 1, tileSize - 1),
                          permitExtractor,
                          new MercatorProjection(levels),
                          None,
                          CountAggregator,
                          Some(MinMaxAggregator))

  // extract our SeriesData from each tile and write it to the filesystem
  def output(level: Seq[Int], tiles: RDD[Tile[(Int, Int, Int)]], outputPath: String) = {
    val seriesData = Pipe(tiles)
                     .to(_.map(series(_)))

    seriesData
    .to(_.map(tile => {
      // Return tuples of tile coordinate, byte array
      (tile.coords, ByteBufferCreator.create(tile, tileSize))
    }))
    .to(_.collect())
    .to(_.foreach(binTile => {
      // Save byte files to local filesystem
      val coord = binTile._1
      val byteArray = binTile._2
      val limit = (1 << coord._1) - 1
      // Use standard TMS path structure and file naming
      val file = new File(s"$outputPath/$layerName/${coord._1}/${coord._2}/${limit - coord._3}.bins")
      file.getParentFile.mkdirs()
      val output = new FileOutputStream(file)
      output.write(byteArray)
      output.close()
    }))
    .run
  }
}
