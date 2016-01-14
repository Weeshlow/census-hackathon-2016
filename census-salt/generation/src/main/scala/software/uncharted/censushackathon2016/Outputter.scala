package software.uncharted.censushackathon2016

trait OutputterFactory extends Serializable {
  def get(): Outputter
}

trait Outputter {
  def output(keyName: String, mimeType: String, bytes: Array[Byte]): String
}
