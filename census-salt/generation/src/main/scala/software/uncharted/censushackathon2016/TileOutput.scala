package software.uncharted.censushackathon2016

trait TileOutput extends Serializable {
  def output(keyName: String, mimeType: String, bytes: Array[Byte]): String
}
