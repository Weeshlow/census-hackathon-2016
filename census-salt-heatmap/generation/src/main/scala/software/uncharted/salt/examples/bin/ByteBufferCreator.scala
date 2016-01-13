package software.uncharted.censushackathon2016

import software.uncharted.salt.core.generation.output.SeriesData

object ByteBufferCreator {
  // Creates and returns an Array of Double values encoded as 64bit Integers
  def create(tile: SeriesData[(Int, Int, Int), Double, (Double, Double)], tileSize: Int): Array[Byte] = {
    val byteArray = new Array[Byte](tileSize * tileSize * 8)
    var j = 0
    tile.bins.foreach(b => {
      val data = java.lang.Double.doubleToLongBits(b)
      for (i <- 0 to 7) {
        byteArray(j) = ((data >> (i * 8)) & 0xff).asInstanceOf[Byte]
        j += 1
      }
    })
    byteArray
  }
}
