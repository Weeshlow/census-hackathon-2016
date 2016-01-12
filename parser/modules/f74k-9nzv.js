/*
    NOTE: ALL POSITION VALUES ARE INCORRECT, THE FIRST 8 ROWS CONTAIN METADATA

    [{
      "id" : 198632055,
      "name" : "Permit No. ",
      "dataTypeName" : "text",
      "fieldName" : "permit_no",
      "position" : 2,
      "renderTypeName" : "text",
      "tableColumnId" : 27568263,
      "width" : 232,

    }, {
      "id" : 198632056,
      "name" : "Issue Date",
      "dataTypeName" : "calendar_date",
      "fieldName" : "issue_date",
      "position" : 3,
      "renderTypeName" : "calendar_date",
      "tableColumnId" : 27568264,
      "width" : 220,

    }, {
      "id" : 198632057,
      "name" : "Project Cost",
      "dataTypeName" : "money",
      "fieldName" : "project_cost",
      "position" : 4,
      "renderTypeName" : "money",
      "tableColumnId" : 27568265,
      "width" : 244,

    }, {
      "id" : 198632058,
      "name" : "Owner",
      "dataTypeName" : "text",
      "fieldName" : "owner",
      "position" : 5,
      "renderTypeName" : "text",
      "tableColumnId" : 27568266,
      "width" : 160,

    }, {
      "id" : 198632059,
      "name" : "Project Address",
      "dataTypeName" : "location",
      "fieldName" : "project_address",
      "position" : 6,
      "renderTypeName" : "location",
      "tableColumnId" : 27568267,
      "width" : 280,
      "subColumnTypes" : [ "human_address", "latitude", "longitude", "machine_address", "needs_recoding" ]
    }, {
      "id" : 198632060,
      "name" : "Work Description",
      "dataTypeName" : "text",
      "fieldName" : "work_description",
      "position" : 7,
      "renderTypeName" : "text",
      "tableColumnId" : 27568268,
      "width" : 292,
    }, {
      "id" : 198632061,
      "name" : "Permit Fee",
      "dataTypeName" : "money",
      "fieldName" : "permit_fee",
      "position" : 8,
      "renderTypeName" : "money",
      "tableColumnId" : 27568269,
      "width" : 220,
  }]
*/

/*
    SAMPLE ROW
    {
        0: 1,
        2: "A10E3E08-60BD-4094-B51B-5EA50EA8BD98",
        3: 1,
        4: 1428719457,
        5: "914166",
        6: 1428719473,
        7: "914166",
        8: "{\n}",
        9: "15-32",
        10: "2015-04-10T00:00:00",
        11: "212189.0",
        12: "Robert McGinity",
        13: [ "{\"address\":\"938 W Fairview\",\"city\":\"Colfax\",\"state\":\"WA\",\"zip\":\"\"}", "46.87040143100006", "-117.37334436599997", null, false ],
        14: "Addition and Shop",
        15: "2549.7"
    }
*/

(function() {
    'use strict';

    var CENTS_MULTIPLIER = 100;

    var LAT_COL = 13;
    var LON_COL = 13;
    var DATE_COL = 10;
    var DESC_COL = 14;
    var AMOUNT_COL = 15;

    module.exports = function(id) {
        return {
            id: function() {
                return id;
            },
            type: function() {
                return null;
            },
            status: function() {
                return null;
            },
            latitude: function(arr) {
                return arr[LAT_COL][4];
            },
            longitude: function(arr) {
                return arr[LON_COL][5];
            },
            units: function() {
                return null;
            },
            timestamp: function(arr) {
                return arr[DATE_COL];
            },
            description: function(arr) {
                return arr[DESC_COL].trim();
            },
            amount: function(arr) {
                return arr[AMOUNT_COL] * CENTS_MULTIPLIER;
            }
        };
    };

}());