/**
 * Copyright (c) 2014-2015 Uncharted Software Inc. All rights reserved.
 *
 * Property of Uncharted(tm), formerly Oculus Info Inc.
 * http://uncharted.software/
 *
 * This software is the confidential and proprietary information of
 * Uncharted Software Inc. ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into
 * with Uncharted Software Inc.
 */
package software.uncharted.censushackathon2016

import software.uncharted.salt.core.projection.numeric.{MercatorProjection, NumericProjection}

object MercatorTimeProjection  {
  val minLon = -180.0
  val maxLon = 180.0
  val minLat = -85.05112878
  val maxLat = 85.05112878
}

class MercatorTimeProjection(
  zoomLevels: Seq[Int],
  min: (Double, Double, Long) = (MercatorTimeProjection.minLon, MercatorTimeProjection.minLat, 0),
  max: (Double, Double, Long) = (MercatorTimeProjection.maxLon, MercatorTimeProjection.maxLat, Long.MaxValue),
  rangeBuckets: Long = Long.MaxValue,
  tms: Boolean = true
) extends NumericProjection[(Double, Double, Long), (Int, Int, Int), (Int, Int, Int)](min, max) {

  def this(zoomLevels: Seq[Int], timeRange: RangeDescription[Long]) = {
    this(
      zoomLevels,
      (MercatorTimeProjection.minLon, MercatorTimeProjection.minLat, timeRange.min),
      (MercatorTimeProjection.maxLon, MercatorTimeProjection.maxLat, timeRange.max),
      timeRange.count
    )
  }

  // Baseline mercator projection to compute X,Y coords
  val mercatorProjection = new MercatorProjection(zoomLevels, (min._1, min._2), (max._1, max._2), tms)

  override def project (dCoords: Option[(Double, Double, Long)], maxBin: (Int, Int, Int)): Option[Seq[((Int, Int, Int), (Int, Int, Int))]] = {
    if (!dCoords.isDefined) {
      None
    } else {
      val coords = dCoords.get;
      // Call base project to get 2D tile coords, add in the computed time bin
      val merc = mercatorProjection.project(Some((coords._1, coords._2)), (maxBin._1, maxBin._2))
      if (!merc.isDefined) {
        None
      } else {
        Some(merc.get.flatMap(m => {
          if (coords._3 >= min._3 && coords._3 <= max._3) {
            val binSize = (max._3 - min._3) / rangeBuckets
            val timeBin = (coords._3 - min._3) / binSize
            Some((m._1, (m._2._1, m._2._2, timeBin.asInstanceOf[Int])))
          } else {
            None
          }
        }))
      }
    }
  }

  override def binTo1D(bin: (Int, Int, Int), maxBin: (Int, Int, Int)): Int = {
    val result = (maxBin._1 + 1) * (maxBin._2 + 1) * bin._3 + (maxBin._1 + 1) * bin._2 + bin._1
    result
  }
}
