/*
    NOTE: ALL POSITION VALUES ARE INCORRECT, THE FIRST 8 ROWS CONTAIN METADATA

    [{
        "id" : 236663335,
        "name" : "RequestID",
        "dataTypeName" : "number",
        "fieldName" : "requestid",
        "position" : 1,
        "renderTypeName" : "number",
        "tableColumnId" : 29583337,
    },{
        "id" : 236663336,
        "name" : "ApplicationID",
        "dataTypeName" : "text",
        "fieldName" : "applicationid",
        "position" : 2,
        "renderTypeName" : "text",
        "tableColumnId" : 29583338,
      }, {
        "id" : 236663337,
        "name" : "RequestType",
        "dataTypeName" : "text",
        "fieldName" : "requesttype",
        "position" : 3,
        "renderTypeName" : "text",
        "tableColumnId" : 29583339,
      }, {
        "id" : 236663338,
        "name" : "House",
        "dataTypeName" : "text",
        "fieldName" : "house",
        "position" : 4,
        "renderTypeName" : "text",
        "tableColumnId" : 29583340,
      }, {
        "id" : 236663339,
        "name" : "Street",
        "dataTypeName" : "text",
        "fieldName" : "street",
        "position" : 5,
        "renderTypeName" : "text",
        "tableColumnId" : 29583341,
      }, {
        "id" : 236663340,
        "name" : "Borough",
        "dataTypeName" : "text",
        "fieldName" : "borough",
        "position" : 6,
        "renderTypeName" : "text",
        "tableColumnId" : 29583342,
      }, {
        "id" : 236663341,
        "name" : "Bin",
        "dataTypeName" : "number",
        "fieldName" : "bin",
        "position" : 7,
        "renderTypeName" : "number",
        "tableColumnId" : 29583343,
    }, {
        "id" : 236663342,
        "name" : "Block",
        "dataTypeName" : "text",
        "fieldName" : "block",
        "position" : 8,
        "renderTypeName" : "text",
        "tableColumnId" : 29583344,
      }, {
        "id" : 236663344,
        "name" : "OwnerName",
        "dataTypeName" : "text",
        "fieldName" : "ownername",
        "position" : 10,
        "renderTypeName" : "text",
        "tableColumnId" : 29583346,
      }, {
        "id" : 236663345,
        "name" : "ExpirationDate",
        "dataTypeName" : "calendar_date",
        "fieldName" : "expirationdate",
        "position" : 11,
        "renderTypeName" : "calendar_date",
        "tableColumnId" : 29583347,
      }, {
        "id" : 236663346,
        "name" : "Make",
        "dataTypeName" : "text",
        "fieldName" : "make",
        "position" : 12,
        "renderTypeName" : "text",
        "tableColumnId" : 29583348,
      }, {
        "id" : 236663347,
        "name" : "Model",
        "dataTypeName" : "text",
        "fieldName" : "model",
        "position" : 13,
        "renderTypeName" : "text",
        "tableColumnId" : 29583349,
      }, {
        "id" : 236663348,
        "name" : "BurnerMake",
        "dataTypeName" : "text",
        "fieldName" : "burnermake",
        "position" : 14,
        "renderTypeName" : "text",
        "tableColumnId" : 29583350,
      }, {
        "id" : 236663349,
        "name" : "BurnerModel",
        "dataTypeName" : "text",
        "fieldName" : "burnermodel",
        "position" : 15,
        "renderTypeName" : "text",
        "tableColumnId" : 29583351,
      }, {
        "id" : 236663350,
        "name" : "PrimaryFuel",
        "dataTypeName" : "text",
        "fieldName" : "primaryfuel",
        "position" : 16,
        "renderTypeName" : "text",
        "tableColumnId" : 29583352,
      }, {
        "id" : 236663351,
        "name" : "SecondaryFuel",
        "dataTypeName" : "text",
        "fieldName" : "secondaryfuel",
        "position" : 17,
        "renderTypeName" : "text",
        "tableColumnId" : 29583353,
      }, {
        "id" : 236663352,
        "name" : "Quantity",
        "dataTypeName" : "number",
        "fieldName" : "quantity",
        "position" : 18,
        "renderTypeName" : "number",
        "tableColumnId" : 29583354,
      }, {
        "id" : 236663353,
        "name" : "IssueDate",
        "dataTypeName" : "calendar_date",
        "fieldName" : "issuedate",
        "position" : 19,
        "renderTypeName" : "calendar_date",
        "tableColumnId" : 29583355,
      }, {
        "id" : 236663354,
        "name" : "status",
        "dataTypeName" : "text",
        "fieldName" : "status",
        "position" : 20,
        "renderTypeName" : "text",
        "tableColumnId" : 29583356,
      }, {
        "id" : 236663355,
        "name" : "PremiseName",
        "dataTypeName" : "text",
        "fieldName" : "premisename",
        "position" : 21,
        "renderTypeName" : "text",
        "tableColumnId" : 29583357,
      }
    ]
*/

/*
    SAMPLE ROW
    {
        0: 1,
        1: "09E2D521-7554-412A-AF11-8D535A5BDAE6",
        2: 1,
        3: 1451957793,
        4: "399231",
        5: 1451957793,
        6: "399231",
        7: null,
        8: "36814",
        9: "CA003388",
        10: "REGISTRATION",
        11: "1572",
        12: "HOE AVENUE",
        13: "BRONX",
        14: "92189",
        15: "02989",
        16: "0011",
        17: "NYC HOUSING AUTHORITY",
        18: "2018-01-17T00:00:00",
        19: "HYDROTHERM #MR 2700 BP",
        20: "HYDROTHERM #MR 2700 BP",
        21: "HYDROTHERM #MR 2700",
        22: "HYDROTHERM #MR 2700",
        23: "NATURALGAS",
        24: "NONE",
        25: "1",
        26: "2014-10-09T15:21:46",
        27: "APPROVED       ",
        28: "EAS 173 STREET-VYSE AVENUE"
    }
*/

(function() {
  'use strict';

  const DATE_COL = 26;
  const STATUS_COL = 27;
  const TYPE_COL = 10;
  const DESC1_COL = 19;
  const DESC2_COL = 23;

  module.exports = function(id) {
    return {
      id: () => id,
      type: (arr) => arr[TYPE_COL] !== null ? 'BOILER ' + arr[TYPE_COL].trim() :  null,
      status: (arr) => arr[STATUS_COL] !== null ? arr[STATUS_COL].trim() : null,
      latitude: () => null,
      longitude: () => null,
      units: () => null,
      timestamp: (arr) => arr[DATE_COL], // ISO datetime string
      description: (arr) => arr[DESC1_COL] + ': ' + arr[DESC2_COL],
      amount: () => null,
      applicantRace: () => null,
      applicantRaceProb: () => null
    };
  };

}());
