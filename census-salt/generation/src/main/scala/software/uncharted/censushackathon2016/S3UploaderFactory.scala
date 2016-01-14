package software.uncharted.censushackathon2016

class S3UploaderFactory(accessKey: String, secretKey: String, bucket: String, keyPrefix: String) extends OutputterFactory {
  override def get: S3Uploader = {
    new S3Uploader(accessKey, secretKey, bucket, keyPrefix)
  }
}
