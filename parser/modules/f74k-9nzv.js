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
        1: "A10E3E08-60BD-4094-B51B-5EA50EA8BD98",
        2: 1,
        3: 1428719457,
        4: "914166",
        5: 1428719473,
        6: "914166",
        7: "{\n}",
        8: "15-32",
        9: "2015-04-10T00:00:00",
        10: "212189.0",
        11: "Robert McGinity",
        12: [ "{\"address\":\"938 W Fairview\",\"city\":\"Colfax\",\"state\":\"WA\",\"zip\":\"\"}", "46.87040143100006", "-117.37334436599997", null, false ],
        13: "Addition and Shop",
        14: "2549.7"
    }
*/

(function() {
  'use strict';

  const CENTS_MULTIPLIER = 100;

  const LAT_COL = 12;
  const LON_COL = 12;
  const DATE_COL = 9;
  const DESC_COL = 13;
  const AMOUNT_COL = 14;
  const APPLICANT_COL = 11;

  module.exports = function(id) {
    const d = require('../demographics.js');

    return {
      id: () => id,
      type: () => null,
      status: () => null,
      latitude: (arr) => {
        return arr[LAT_COL] !== null ? parseFloat(arr[LAT_COL][1]) : null;
      },
      longitude: (arr) => {
        return arr[LON_COL] !== null ? parseFloat(arr[LON_COL][2]) : null;
      },
      units: () => null,
      timestamp: (arr) => arr[DATE_COL],
      description: (arr) => {
        return arr[DESC_COL] !== null ? arr[DESC_COL].trim() : null;
      },
      amount: (arr) => arr[AMOUNT_COL] * CENTS_MULTIPLIER,
      applicantRace: (arr) => {
        if (arr[APPLICANT_COL] === null) {
          return null;
        }
        let tokens = arr[APPLICANT_COL].split(' ');
        let surname = tokens[tokens.length-1].trim().toUpperCase();
        return d(surname) !== undefined ? d(surname)[0] : null;
      },
      applicantRaceProb: (arr) => {
        if (arr[APPLICANT_COL] === null) {
          return null;
        }
        let tokens = arr[APPLICANT_COL].trim().split(' ');
        let surname = tokens[tokens.length-1].toUpperCase();
        return d(surname) !== undefined ? d(surname)[1] : null;
      }
    };
  };

}());
