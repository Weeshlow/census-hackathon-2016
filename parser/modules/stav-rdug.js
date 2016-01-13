/*
    NOTE: ALL POSITION VALUES ARE INCORRECT, THE FIRST 8 ROWS CONTAIN METADATA

    [{
        "id" : 39759275,
        "name" : "DateIssued",
        "dataTypeName" : "calendar_date",
        "fieldName" : "dateissued",
        "position" : 1,
        "renderTypeName" : "calendar_date",
        "tableColumnId" : 7011233,
    },{
        "id" : 39759276,
        "name" : "PermitNo",
        "dataTypeName" : "text",
        "fieldName" : "permitno",
        "position" : 2,
        "renderTypeName" : "text",
        "tableColumnId" : 7011234,
      }, {
        "id" : 39759277,
        "name" : "PropertyAddress",
        "dataTypeName" : "location",
        "fieldName" : "propertyaddress",
        "position" : 3,
        "renderTypeName" : "location",
        "tableColumnId" : 7011235,
      }, {
        "id" : 39759278,
        "name" : "PIN",
        "dataTypeName" : "text",
        "fieldName" : "pin",
        "position" : 4,
        "renderTypeName" : "text",
        "tableColumnId" : 7011236,
      }, {
        "id" : 39759279,
        "name" : "ContractorDBA",
        "dataTypeName" : "text",
        "fieldName" : "contractordba",
        "position" : 5,
        "renderTypeName" : "text",
        "tableColumnId" : 7011237,
      }, {
        "id" : 39759280,
        "name" : "ContractorFullName",
        "dataTypeName" : "text",
        "fieldName" : "contractorfullname",
        "position" : 6,
        "renderTypeName" : "text",
        "tableColumnId" : 7011238,
      }, {
        "id" : 39759281,
        "name" : "Valuation",
        "dataTypeName" : "money",
        "fieldName" : "valuation",
        "position" : 7,
        "renderTypeName" : "money",
        "tableColumnId" : 7011239,
    }, {
        "id" : 39759282,
        "name" : "OwnerFullName",
        "dataTypeName" : "text",
        "fieldName" : "ownerfullname",
        "position" : 8,
        "renderTypeName" : "text",
        "tableColumnId" : 7011240,
      }, {
        "id" : 39759283,
        "name" : "Description",
        "dataTypeName" : "text",
        "fieldName" : "description",
        "position" : 9,
        "renderTypeName" : "text",
        "tableColumnId" : 7011241,
      }
    ]
*/

/*
    SAMPLE ROW
    {
        0: 29568,
        1: "B95DE9D4-AA88-4048-A85B-176DDDA980A9",
        2: 29568,
        3: 1358449329,
        4: "700326",
        5: 1358450606,
        6: "700326",
        7: "{\n}",
        8: "2008-10-07T00:00:00",
        9: "SFD20081000",
        10: [ "{\"address\":\"625 VINCENT AVE\",\"city\":\"ROCKFORD\",\"state\":\"IL\",\"zip\":\"61102\"}", "42.26680691153598", "-89.15889137240612", null, false ],
        11: "11-19-480-026",
        12: null,
        13: null,
        14: "7000.00",
        15: null,
        16: "TESTING - FOUND"
    }
*/

(function() {
  'use strict';

  const CENTS_MULTIPLIER = 100;
  const DATE_COL = 8;
  const LOC_COL = 10;
  const LOC_LAT_COL = 1;
  const LOC_LON_COL = 2;
  const DESC_COL = 16;
  const AMOUNT_COL = 14;

  module.exports = function(id) {
    return {
      id: () => id,
      type: () => null,
      status: () => null,
      latitude: (arr) => {
        return arr[LOC_COL] !== null ? parseFloat(arr[LOC_COL][LOC_LAT_COL]) : null;
      },
      longitude: (arr) => {
        return arr[LOC_COL] !== null ? parseFloat(arr[LOC_COL][LOC_LON_COL]) : null;
      },
      units: () => null,
      timestamp: (arr) => arr[DATE_COL], // ISO datetime string
      description: (arr) => arr[DESC_COL],
      amount: (arr) => {
        return arr[AMOUNT_COL] !== null ? arr[AMOUNT_COL] * CENTS_MULTIPLIER : null;
      }
    };
  };

}());
