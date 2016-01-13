package software.uncharted.censushackathon2016s

import java.io._

import org.apache.spark.SparkContext
import org.apache.spark.sql.{Row, DataFrame}

import scala.util.parsing.json.JSONObject

import software.uncharted.sparkpipe.Pipe
import software.uncharted.sparkpipe.ops

import software.uncharted.salt.core.projection.numeric._
import software.uncharted.salt.core.generation.request._
import software.uncharted.salt.core.generation.Series
import software.uncharted.salt.core.generation.mapreduce.MapReduceTileGenerator
import software.uncharted.salt.core.generation.output.SeriesData
import software.uncharted.salt.core.analytic.numeric._

object PermitsHeatMap {
  // Defines the output layer name
  val layerName = "permits"

  def generate(sc: SparkContext, input: Pipe[DataFrame], tileSize: Int, outputPath: String): Unit = {
    val permitsHeatmapPipe = input
     .to(_.select("longitude", "latitude"))
     .to(ops.core.dataframe.toRDD)
     .to(sourceData => {
       // Given an input row, return permit longitude, latitude as a tuple
       val permitExtractor = (r: Row) => {
         if (r.isNullAt(0) || r.isNullAt(1)) {
           None
         } else {
           Some((r.getDouble(0), r.getDouble(1)))
         }
       }

       // Tile Generator object, which houses the generation logic
       val gen = new MapReduceTileGenerator(sc)

       // Break levels into batches. Process several higher levels at once because the
       // number of tile outputs is quite low. Lower levels done individually due to high tile counts.
       val levelBatches = List(List(0, 1, 2, 3, 4, 5, 6, 7, 8), List(9, 10, 11), List(12), List(13))

       // Iterate over sets of levels to generate.
       levelBatches.map(level => {

         println("------------------------------")
         println(s"Generating level $level")
         println("------------------------------")

         // Construct the definition of the tiling jobs: permits
         val permits = new Series((tileSize - 1, tileSize - 1),
           permitExtractor,
           new MercatorProjection(level),
           None,
           CountAggregator,
           Some(MinMaxAggregator))

         // Create a request for all tiles on these levels, generate
         val request = new TileLevelRequest(level, (coord: (Int, Int, Int)) => coord._1)
         val tiles = gen.generate(sourceData, permits, request)

         // Translate RDD of Tiles to RDD of (coordinate,byte array), collect to master for serialization
         val output = tiles
           .map(s => permits(s))
           .map(tile => {
             // Return tuples of tile coordinate, byte array
             (tile.coords, ByteBufferCreator.create(tile, tileSize))
           })
           .collect()

         // Save byte files to local filesystem
         output.foreach(tile => {
           val coord = tile._1
           val byteArray = tile._2
           val limit = (1 << coord._1) - 1
           // Use standard TMS path structure and file naming
           val file = new File(s"$outputPath/$layerName/${coord._1}/${coord._2}/${limit - coord._3}.bins")
           file.getParentFile.mkdirs()
           val output = new FileOutputStream(file)
           output.write(byteArray)
           output.close()
         })

         // Create map from each level to min / max values.
         tiles
           .map(s => permits(s))
           .map(t => (t.coords._1.toString, t.tileMeta.get))
           .reduceByKey((l, r) => {
             (Math.min(l._1, r._1), Math.max(l._2, r._2))
           })
           .mapValues(minMax => {
             JSONObject(Map(
               "min" -> minMax._1,
               "max" -> minMax._2
             ))
           })
           .collect()
           .toMap
       })
     })
     .to(levelMeta =>  {
       // Flatten array of maps into a single map
       val levelInfoJSON = JSONObject(levelMeta.reduce(_ ++ _)).toString()
       // Save level metadata to filesystem
       val pw = new PrintWriter(s"$outputPath/$layerName/meta.json")
       pw.write(levelInfoJSON)
       pw.close()
     })
     .run
  }
}
