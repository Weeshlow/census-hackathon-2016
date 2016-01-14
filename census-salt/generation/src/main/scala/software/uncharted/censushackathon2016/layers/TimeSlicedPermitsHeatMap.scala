package software.uncharted.censushackathon2016.layers

import org.apache.spark.SparkContext
import org.apache.spark.rdd.RDD
import org.apache.spark.sql.{Row, DataFrame}

import software.uncharted.censushackathon2016.{TileOutput,ByteBufferCreator,RangeDescription,MercatorTimeProjection}

import software.uncharted.sparkpipe.Pipe
import software.uncharted.sparkpipe.ops

import software.uncharted.salt.core.projection.numeric.MercatorProjection
import software.uncharted.salt.core.generation.Series
import software.uncharted.salt.core.generation.output.{Tile, SeriesData}
import software.uncharted.salt.core.analytic.numeric.{CountAggregator, MinMaxAggregator}

class TimeSlicedPermitsHeatMap(layerName: String, levels: Seq[Int], maxTime: Long, slices: Int, timeCol: Int) extends Serializable {
  private val tileSize = 256;

  // Given an input row, return permit longitude, latitude as a tuple
  private val permitExtractor = (r: Row) => {
    if (r.isNullAt(0) || r.isNullAt(1) || r.isNullAt(timeCol)) {
      None
    } else {
      Some((r.getDouble(0), r.getDouble(1), r.getLong(timeCol)))
    }
  }

  val projection = new MercatorTimeProjection(levels, RangeDescription.fromCount(0, maxTime, slices))

  val series = new Series((tileSize - 1, tileSize - 1, slices - 1),
                          permitExtractor,
                          projection,
                          None,
                          CountAggregator,
                          Some(MinMaxAggregator))

  // extract our SeriesData from each tile and write it out
  def serialize(level: Seq[Int], tiles: RDD[Tile[(Int, Int, Int)]], outputter: TileOutput) = {
    val seriesData = Pipe(tiles)
                     .to(_.map(series(_)))

    seriesData
    .to(_.map(tile => {
      // Return tuples of tile coordinate, byte array
      (tile.coords, ByteBufferCreator.create(tile, tileSize*tileSize*slices))
    }))
    // .to(_.collect())
    .to(_.foreach(binTile => {
      // Save byte files to local filesystem
      val coord = binTile._1
      val byteArray = binTile._2
      val limit = (1 << coord._1) - 1

      outputter.output(
        s"$layerName/${coord._1}/${coord._2}/${limit - coord._3}.bin", //TMS style
        "application/json",
        byteArray
      )
    }))
    .run
  }
}
