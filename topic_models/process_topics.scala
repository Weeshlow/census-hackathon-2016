import scala.util.matching.Regex
import org.apache.spark.sql.types.{StructType, StructField, StringType}
import org.apache.spark.sql.Row

val topicName = "msk6-43c6"

// load permits file
val permits_csv = sqlContext.load(
  "com.databricks.spark.csv",
  Map("path" -> s"hdfs://uscc0-master0.uncharted.software/xdata/data/permits/$topicName*.csv",
    "header" -> "true",
    "inferSchema" -> "true"))
val permits_rows = permits_csv.map(x => x)

// load the topics file into a list of (topic_id, topic words) tuples
val topics = sc.textFile(s"hdfs://uscc0-master0.uncharted.software/user/cbethune/permit_topics/${topicName}_topics.txt")
val topicsById = topics.map(x => x.split("=")).map(x => (x(0).toLong, x(1).split(",")))

// convert the topic word lists into regexes for later matching, and broadcast them out
val terms = sc.broadcast(topicsById.collect.toMap)
val termRegex = sc.broadcast(terms.value.map(t => (t._1, t._2.map(s => "(\\b+" + s + "\\b+)").mkString("|").r)))

// Parse out the permit row map.  This maps a permit's row number in the original permit CSV file to a topic number
// in the xxx_assignments_30.csv file.
// loads format localhost_27017_permits_2hre-tvqe_569525a1a1b51ff6f32a969b_2hre-tvqe_0
val rowMapRaw = sc.textFile(s"hdfs://uscc0-master0.uncharted.software/user/cbethune/permit_topics/${topicName}_reduced_documents.txt")
val x = rowMapRaw.map(s => ".*_(\\d+)".r.findAllIn(s).matchData.map(_.group(1))).flatMap(x => x).collect
val rowMap = sc.broadcast(x.map(x => x.toLong).zipWithIndex.toMap)

// Parse out the topic map.  This maps the an offset value from the xxx_reduced_documents.txt file to a
// topic number.
val topicMapRaw = sc.textFile(s"hdfs://uscc0-master0.uncharted.software/user/cbethune/permit_topics/${topicName}_assignments_30.csv")
val y = topicMapRaw.map(s => s.split(",").filter(_ != "").map(_.toLong)).flatMap(x => x)
val topicMap = sc.broadcast(y.collect)

// Create a map enumerating each of the permits with its row number.
val numberedPermits = permits_rows.zipWithIndex

// For each permit, check to see if its row number is in the row map.  If it is, it has a topic associated with it (no topic
// is a legitimate case).  Use the row map value as the key for a topic map lookup - the value is a topic number.  The topic
// number is used as a key to get a regex that matches words from that topic.
val words = numberedPermits.map { r =>
    val index = r._2.asInstanceOf[Int]
    try {
      Some(termRegex.value(topicMap.value(rowMap.value(index))))
    } catch {
      case e: Exception => None
    }
}

// Run topic match regex against the permit text and store the result as
// (permit struct, matched terms) tuples
val permitsWithTopics = permits_rows.zip(words)
val permitHits = permitsWithTopics.map { r =>
  val permitStr = (r._1(1).asInstanceOf[String] + " " + r._1(7).asInstanceOf[String]).toLowerCase
  val hits = r._2.map(x => x.findAllIn(permitStr).toSet.mkString(",")).getOrElse("")
  (r._1, hits)
}

// Create a new schema that is the original permits schema + a new topics field
val fields = permits_csv.schema.fields
val updatedFields = fields :+ StructField("topics", StringType, true)
val newSchema = StructType(updatedFields)

// Write the matched topic terms into their associated permit row and save to HDFS
val rows = permitHits.map(r => Row.fromSeq(r._1.toSeq :+ r._2))
val hitDf = sqlContext.createDataFrame(rows, newSchema)
hitDf.write.format("com.databricks.spark.csv")
  .option("header", "true")
  .save(s"hdfs://uscc0-master0.uncharted.software/xdata/data/permits/output/$topicName")
