package software.uncharted.censushackathon2016

import java.io.{File, FileOutputStream}

class FileSystemWriter(outputDir: String) extends TileOutput {
  override def output(keyName: String, mimeType: String, bytes: Array[Byte]): String = {
    val file = new File(outputDir + "/" + keyName)
    file.getParentFile.mkdirs()
    val os = new FileOutputStream(file)
    os.write(bytes)
    os.close()
    keyName
  }
}
