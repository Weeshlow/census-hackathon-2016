package software.uncharted.censushackathon2016.layers

import org.apache.spark.SparkContext
import org.apache.spark.rdd.RDD
import org.apache.spark.sql.{Row, DataFrame}

import software.uncharted.censushackathon2016.{OutputterFactory,ByteBufferCreator}

import software.uncharted.sparkpipe.Pipe
import software.uncharted.sparkpipe.ops


import software.uncharted.salt.core.projection.numeric.MercatorProjection
import software.uncharted.salt.core.generation.Series
import software.uncharted.salt.core.generation.output.{Tile, SeriesData}
import software.uncharted.salt.core.analytic.numeric.{SumAggregator, MinMaxAggregator}

class CumulativeAmountsHeatMap(levels: Seq[Int]) extends Serializable {
  private val tileSize = 256;

  // Defines the output layer name
  private val layerName = "cumulative-amounts"

  // Given an input row, return permit longitude, latitude as a tuple
  private val permitExtractor = (r: Row) => {
    if (r.isNullAt(0) || r.isNullAt(1)) {
      None
    } else {
      Some((r.getDouble(0), r.getDouble(1)))
    }
  }

  private val amountExtractor = (r: Row) => {
    if (r.isNullAt(2)) {
      None
    } else {
      Some(r.getDouble(2))
    }
  }

  val series = new Series((tileSize - 1, tileSize - 1),
                          permitExtractor,
                          new MercatorProjection(levels),
                          Some(amountExtractor),
                          SumAggregator,
                          Some(MinMaxAggregator))

  // extract our SeriesData from each tile and write it out
  def serialize(level: Seq[Int], tiles: RDD[Tile[(Int, Int, Int)]], outputterFactory: OutputterFactory) = {
    val seriesData = Pipe(tiles)
                     .to(_.map(series(_)))

    seriesData
    .to(_.map(tile => {
      // Return tuples of tile coordinate, byte array
      (tile.coords, ByteBufferCreator.create(tile, tileSize*tileSize))
    }))
    // .to(_.collect())
    .to(_.foreachPartition(p => {
      val outputter = outputterFactory.get()
      p.foreach(binTile => {
        // Save byte files to local filesystem
        val coord = binTile._1
        val byteArray = binTile._2
        val limit = (1 << coord._1) - 1

        outputter.output(
          s"$layerName/${coord._1}/${coord._2}/${limit - coord._3}.bin", //TMS style
          "application/json",
          byteArray
        )
      })
    }))
    .run
  }
}
