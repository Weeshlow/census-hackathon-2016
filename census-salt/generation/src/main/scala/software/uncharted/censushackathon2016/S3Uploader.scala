package software.uncharted.censushackathon2016

import java.io.ByteArrayInputStream

import com.amazonaws.auth.BasicAWSCredentials
import com.amazonaws.services.s3.AmazonS3Client
import com.amazonaws.services.s3.model.PutObjectRequest
import com.amazonaws.services.s3.AmazonS3
import com.amazonaws.services.s3.model.ObjectMetadata
import com.amazonaws.services.s3.model.PutObjectRequest
import com.amazonaws.services.s3.model.GroupGrantee
import com.amazonaws.services.s3.model.Permission
import com.amazonaws.services.s3.model.AccessControlList

class S3Uploader(accessKey: String, secretKey: String, bucket: String, keyPrefix: String) extends Outputter {

  val credentials = new BasicAWSCredentials(accessKey, secretKey);
  val s3client = new AmazonS3Client(credentials);

  override def output(keyName: String, mimeType: String, bytes: Array[Byte]): String = {
    val meta = new ObjectMetadata()
    val is = new ByteArrayInputStream(bytes)

    val acl = new AccessControlList();
    acl.grantPermission(GroupGrantee.AllUsers, Permission.Read);

    meta.setContentType(mimeType)
    s3client.putObject(
      new PutObjectRequest(bucket, keyPrefix + "/" + keyName, is, meta).withAccessControlList(acl)
    )

    is.close()

    keyName
  }
}
