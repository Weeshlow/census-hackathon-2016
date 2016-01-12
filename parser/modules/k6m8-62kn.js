  /*
  [{
    "id" : 141278145,
    "name" : "issueDate",
    "dataTypeName" : "calendar_date",
    "fieldName" : "issuedate",
    "position" : 1,
    "renderTypeName" : "calendar_date",
    "tableColumnId" : 1485881,
    "width" : 137
    }, {
    "id" : 141278146,
    "name" : "tract",
    "dataTypeName" : "text",
    "fieldName" : "tract",
    "position" : 2,
    "renderTypeName" : "text",
    "tableColumnId" : 1489783,
    "width" : 160
    }, {
    "id" : 141278147,
    "name" : "type",
    "dataTypeName" : "text",
    "fieldName" : "type",
    "position" : 3,
    "renderTypeName" : "text",
    "tableColumnId" : 1485876,
    "width" : 148
    }, {
    "id" : 141278148,
    "name" : "useDescription",
    "dataTypeName" : "text",
    "fieldName" : "usedescription",
    "position" : 4,
    "renderTypeName" : "text",
    "tableColumnId" : 1485877,
    "width" : 268
    }, {
    "id" : 141278149,
    "name" : "description",
    "dataTypeName" : "text",
    "fieldName" : "description",
    "position" : 5,
    "renderTypeName" : "text",
    "tableColumnId" : 1485878,
    "width" : 232
    }, {
    "id" : 141278150,
    "name" : "amount",
    "dataTypeName" : "money",
    "fieldName" : "amount",
    "position" : 6,
    "renderTypeName" : "money",
    "tableColumnId" : 1489784,
    "width" : 172,
    }, {
    "id" : 141278151,
    "name" : "Location 1",
    "dataTypeName" : "location",
    "fieldName" : "location_1",
    "position" : 7,
    "renderTypeName" : "location",
    "tableColumnId" : 1485880,
    "width" : 220
  }]
  */

  /*
      *** PUT A SAMPLE ROW HERE ***
      [
        0 = 2444,
        1 = "8A881E72-03CF-4DA1-BFF7-9CB88BDC1BE5",
        2 = 2444,
        3 = 1345486305,
        4 = "393202",
        5 = 1345486502,
        6 = "393202",
        7 = "{\n}",
        8 = "2006-01-05T00:00:00",
        9 = "250103",
        10 = "AAR - Addition, alteration, or repair.",
        11 = "Institutional",
        12 = ,
        13 = "80000.00",
        14 = ["{\"address\":\"1001 PINE HEIGHTS AV\",\"city\":\"\",\"state\":\"\",\"zip\":\"21229\"}", "39.270463760754865", "-76.6760947616554", null, false ]
      ]
  */

  (function() {
    'use strict';

      module.exports = function(id) {

          const CENTS_MULTIPLIER = 100;
          const DATE_COL = 8;
          const TYPE_COL = 10;
          const USE_DESC_COL = 11;
          const DESC_COL = 12;
          const AMOUNT_COL = 13;
          const LOCATION_COL = 14;

          return {
              id: () => id,
              type: (arr) => arr[TYPE_COL],
              status: (/* arr */) => null,
              latitude: (arr) => arr[LOCATION_COL] ? arr[LOCATION_COL][1] : null,
              longitude: (arr) => arr[LOCATION_COL] ? arr[LOCATION_COL][2] : null,
              units: (/* arr */) => null,
              timestamp: (arr) => arr[DATE_COL],
              description: (arr) => arr[USE_DESC_COL] + ': ' + arr[TYPE_COL] + ',' + arr[DESC_COL],
              amount: (arr) => CENTS_MULTIPLIER * arr[AMOUNT_COL]
          };
      };
  }());
