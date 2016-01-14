package software.uncharted.censushackathon2016

import java.io.{File, FileOutputStream}

class FileSystemWriterFactory(outputDir: String) extends OutputterFactory {
  override def get: FileSystemWriter = {
    return new FileSystemWriter(outputDir)
  }
}

/**
 * Warning! This will only work if the workers are on the same machine as the master (e.g. in uncharted/sparklet)
 */
class FileSystemWriter(outputDir: String) extends Outputter {
  override def output(keyName: String, mimeType: String, bytes: Array[Byte]): String = {
    val file = new File(outputDir + "/" + keyName)
    file.getParentFile.mkdirs()
    val os = new FileOutputStream(file)
    os.write(bytes)
    os.close()
    keyName
  }
}
