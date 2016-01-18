import scala.util.matching.Regex
import org.apache.spark.sql.types.{StructType, StructField, StringType}
import org.apache.spark.sql.Row

// load permits file
val permits_csv = sqlContext.load(
  "com.databricks.spark.csv",
  Map("path" -> "hdfs://uscc0-master0.uncharted.software/xdata/data/permits/2hre-tvqe-0.csv",
    "header" -> "true",
    "inferSchema" -> "true"))
val permits_rows = permits_csv.map(x => x)

val topics = sc.textFile("hdfs://uscc0-master0.uncharted.software/user/cbethune/permit_topics/terms.txt")
val topicsById = topics.map(x => x.split("=")).map(x => (x(0).toLong, x(1).split(",")))
val terms = sc.broadcast(topicsById.collect.toMap)
val termRegex = sc.broadcast(terms.value.map(t => (t._1, t._2.map(s => "(\\b+" + s + "\\b+)").mkString("|").r)))

// loads format localhost_27017_permits_2hre-tvqe_569525a1a1b51ff6f32a969b_2hre-tvqe_0
val rowMapRaw = sc.textFile("hdfs://uscc0-master0.uncharted.software/user/cbethune/permit_topics/2hre-tvqe_reduced_documents.txt")
val x = rowMapRaw.map(s => ".*_(\\d+)".r.findAllIn(s).matchData.map(_.group(1))).flatMap(x => x).collect
val rowMap = sc.broadcast(x.map(x => x.toLong).zipWithIndex.toMap)

val topicMapRaw = sc.textFile("hdfs://uscc0-master0.uncharted.software/user/cbethune/permit_topics/2hre-tvqe_assignments_30.csv")
val y = topicMapRaw.map(s => s.split(",").filter(_ != "").map(_.toLong)).flatMap(x => x)
val topicMap = sc.broadcast(y.collect)

val numberedPermits = permits_rows.zipWithIndex

val words = numberedPermits.map { r =>
    val index = r._2.asInstanceOf[Int]
    if (rowMap.value.contains(index.toLong)) {
      Some(termRegex.value(topicMap.value(rowMap.value(index))))
    } else {
      None
    }
}

val permitsWithTopics = permits_rows.zip(words)

val permitHits = permitsWithTopics.map { r =>
  val permitStr = (r._1(1).asInstanceOf[String] + " " + r._1(7).asInstanceOf[String]).toLowerCase
  val hits = r._2.map(x => x.findAllIn(permitStr).toSet.mkString(",")).getOrElse("")
  (r._1, hits)
}

val fields = permits_csv.schema.fields
val updatedFields = fields :+ StructField("topics", StringType, true)
val newSchema = StructType(updatedFields)

val rows = permitHits.map(r => Row.fromSeq(r._1.toSeq :+ r._2))
val hitDf = sqlContext.createDataFrame(rows, newSchema)
hitDf.write.format("com.databricks.spark.csv")
  .option("header", "true")
  .save("hdfs://uscc0-master0.uncharted.software/xdata/data/permits/output/2hre-tvqe")
