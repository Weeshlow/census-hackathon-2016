/*
      [{
        "id" : 225268532,
        "name" : "File.",
        "dataTypeName" : "text",
        "fieldName" : "file",
        "position" : 1,
        "renderTypeName" : "text",
        "tableColumnId" : 31915732,
        "width" : 160
      }, {
        "id" : 225268533,
        "name" : "Permit.",
        "dataTypeName" : "text",
        "fieldName" : "permit",
        "position" : 2,
        "renderTypeName" : "text",
        "tableColumnId" : 31915733,
        "width" : 184
      }, {
        "id" : 225268534,
        "name" : "PermitType",
        "dataTypeName" : "text",
        "fieldName" : "permittype",
        "position" : 3,
        "renderTypeName" : "text",
        "tableColumnId" : 31915734,
        "width" : 220
      }, {
        "id" : 225268535,
        "name" : "Address",
        "dataTypeName" : "text",
        "fieldName" : "address",
        "position" : 4,
        "renderTypeName" : "text",
        "tableColumnId" : 31915735,
        "width" : 184
      }, {
        "id" : 225268536,
        "name" : "Applicant",
        "dataTypeName" : "text",
        "fieldName" : "applicant",
        "position" : 5,
        "renderTypeName" : "text",
        "tableColumnId" : 31915736,
        "width" : 208
      }, {
        "id" : 225268537,
        "name" : "ApplicantAddress",
        "dataTypeName" : "text",
        "fieldName" : "applicantaddress",
        "position" : 6,
        "renderTypeName" : "text",
        "tableColumnId" : 31915737,
        "width" : 292
      }, {
        "id" : 225268538,
        "name" : "ApplicantCityStZip",
        "dataTypeName" : "text",
        "fieldName" : "applicantcitystzip",
        "position" : 7,
        "renderTypeName" : "text",
        "tableColumnId" : 31915738,
        "width" : 316
      }, {
        "id" : 225268539,
        "name" : "ProjectName",
        "dataTypeName" : "text",
        "fieldName" : "projectname",
        "position" : 8,
        "renderTypeName" : "text",
        "tableColumnId" : 31915739,
        "width" : 232
      }, {
        "id" : 225268540,
        "name" : "ApplicationDate",
        "dataTypeName" : "calendar_date",
        "fieldName" : "applicationdate",
        "position" : 9,
        "renderTypeName" : "calendar_date",
        "tableColumnId" : 31915740,
        "width" : 280
      }, {
        "id" : 225268541,
        "name" : "IssueDate",
        "dataTypeName" : "calendar_date",
        "fieldName" : "issuedate",
        "position" : 10,
        "renderTypeName" : "calendar_date",
        "tableColumnId" : 31915741,
        "width" : 208
      }, {
        "id" : 225268542,
        "name" : "ExpirationDate",
        "dataTypeName" : "calendar_date",
        "fieldName" : "expirationdate",
        "position" : 11,
        "renderTypeName" : "calendar_date",
        "tableColumnId" : 31915742,
        "width" : 268
      }, {
        "id" : 225268543,
        "name" : "Status",
        "dataTypeName" : "text",
        "fieldName" : "status",
        "position" : 12,
        "renderTypeName" : "text",
        "tableColumnId" : 31915743,
        "width" : 172
      }, {
        "id" : 225268544,
        "name" : "CloseDate",
        "dataTypeName" : "calendar_date",
        "fieldName" : "closedate",
        "position" : 13,
        "renderTypeName" : "calendar_date",
        "tableColumnId" : 31915744,
        "width" : 208
      }, {
        "id" : 229596585,
        "name" : "PermitAmount",
        "dataTypeName" : "money",
        "fieldName" : "permitamount",
        "position" : 14,
        "renderTypeName" : "money",
        "tableColumnId" : 31915745,
        "width" : 244,
        "format" : {
          "precisionStyle" : "standard",
          "align" : "right",
          "noCommas" : "false"
        }
      }, {
        "id" : 229596586,
        "name" : "AmountPaid",
        "dataTypeName" : "money",
        "fieldName" : "amountpaid",
        "position" : 15,
        "renderTypeName" : "money",
        "tableColumnId" : 31915746,
        "width" : 220,
        "format" : {
          "precisionStyle" : "standard",
          "align" : "right",
          "noCommas" : "false"
        }
      }, {
        "id" : 225268547,
        "name" : "Latitude",
        "dataTypeName" : "number",
        "fieldName" : "latitude",
        "position" : 16,
        "renderTypeName" : "number",
        "tableColumnId" : 31915747,
        "width" : 196,
      }, {
        "id" : 225268548,
        "name" : "Longitude",
        "dataTypeName" : "number",
        "fieldName" : "longitude",
        "position" : 17,
        "renderTypeName" : "number",
        "tableColumnId" : 31915748,
        "width" : 208,
      } ]
*/

/* SAMPLE ROW - POSITION VALUES ARE WRONG
 *
    0: 857798,
    1: "A157A3AE-DFED-4F7E-AC14-23447D82FC42",
    2: 857798,
    3: 1451988130,
    4: "393811",
    5: 1451988130,
    6: "393811",
    7: null,
    8: "16-000050",
    9: "P16-000004",
    10: "Residential - Existing",
    11: "275 HIGHLAND AVE",
    12: "J. J. Sullivan Plumbing & Heating Co., INC",
    13: "346 Somerville Ave.",
    14: "Somerville MA 02143",
    15: "UNDERGROUND SANITARY PIPE REPLACEMENT",
    16: "2016-01-04T00:00:00",
    17: "2016-01-04T00:00:00",
    18: "2016-07-04T00:00:00",
    19: "Issued",
    20: null,
    21: "60",
    22: "60",
    23: "42.3919932",
    24: "-71.1114597"
*/

(function() {
  'use strict';

  const CENTS_MULTIPLIER = 100;

  const AMT_COL = 21; // amount paid
  const DSP_COL = 15; // descritption
  const ISD_COL = 16; // issue date
  const LAT_COL = 23; // latitude
  const LON_COL = 24; // longitude
  const STA_COL = 19; // status
  const TYP_COL = 10; // permit type

  module.exports = function(id) {
    return {
      id: () => id,

      type: (arr) => {
        return arr[TYP_COL];
      },

      status: (arr) => {
        return arr[STA_COL];
      },

      latitude: (arr) => {
        return parseFloat(arr[LAT_COL]);
      },

      longitude: (arr) => {
        return parseFloat(arr[LON_COL]);
      },

      units: () => null,

      timestamp: (arr) => {
        return arr[ISD_COL];
      },

      description: (arr) => {
        return arr[DSP_COL];
      },

      amount: (arr) => arr[AMT_COL] * CENTS_MULTIPLIER
    };
  };
}());
