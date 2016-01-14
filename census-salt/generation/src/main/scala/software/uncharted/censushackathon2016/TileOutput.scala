package software.uncharted.censushackathon2016

trait TileOutput {
  def output(keyName: String, mimeType: String, bytes: Array[Byte]): String
}
