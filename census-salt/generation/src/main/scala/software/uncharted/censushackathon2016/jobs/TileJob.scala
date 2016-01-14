package software.uncharted.censushackathon2016.jobs

import org.apache.spark.sql.{DataFrame, SQLContext, Row}

import software.uncharted.sparkpipe.Pipe
import software.uncharted.sparkpipe.ops

import software.uncharted.censushackathon2016.{layers, OutputterFactory}

import software.uncharted.salt.core.generation.request.TileLevelRequest
import software.uncharted.salt.core.generation.mapreduce.MapReduceTileGenerator

object TileJob {
  def run(data: DataFrame, levelBatches: Seq[Seq[Int]], outputterFactory: OutputterFactory) = {
    // Construct an RDD of Rows containing only the fields we need. Cache the result
    val input = Pipe(data)
      .to(_.select("longitude", "latitude", "amount", "type"))
      .to(ops.core.dataframe.cache)
      .to(ops.core.dataframe.toRDD)
      .to(sourceData => {

        // Tile Generator object, which houses the generation logic
        val gen = new MapReduceTileGenerator(data.sqlContext.sparkContext)

        // Iterate over sets of levels to generate.
        Pipe(levelBatches)
        .to(_.map(level => {

          println("------------------------------")
          println(s"Generating level $level")
          println("------------------------------")

          val permits = new layers.PermitsHeatMap(level)
          val amounts = new layers.CumulativeAmountsHeatMap(level)
          val types = new layers.WordCloud("type-word-cloud", level, 3)

          // Create a request for all tiles on these levels, generate
          val request = new TileLevelRequest(level, (coord: (Int, Int, Int)) => coord._1)
          val tiles = gen.generate(
            sourceData,
            Seq(permits.series, amounts.series, types.series),
            request
          )
          permits.serialize(level, tiles, outputterFactory)
          amounts.serialize(level, tiles, outputterFactory)
          types.serialize(level, tiles, outputterFactory)
        }))
        .run;

      })
      .run;
  }
}
