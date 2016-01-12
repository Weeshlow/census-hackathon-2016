/*
    NOTE: ALL POSITION VALUES ARE INCORRECT, THE FIRST 8 ROWS CONTAIN METADATA

    [{
      "id" : 10544685,
      "name" : "PERMIT#",
      "dataTypeName" : "number",
      "fieldName" : "permit_no",
      "position" : 1,
      "renderTypeName" : "number",
      "tableColumnId" : 3041229,
      "width" : 107,

    }, {
      "id" : 10544686,
      "name" : "PERMIT_TYPE",
      "dataTypeName" : "text",
      "fieldName" : "permit_type",
      "position" : 2,
      "renderTypeName" : "text",
      "tableColumnId" : 3041230,
      "width" : 232,

    }, {
      "id" : 10544687,
      "name" : "ISSUED_DATE",
      "dataTypeName" : "calendar_date",
      "fieldName" : "issued_date",
      "position" : 3,
      "renderTypeName" : "calendar_date",
      "tableColumnId" : 3041231,
      "width" : 146,

    }, {
      "id" : 10544688,
      "name" : "ADDRESS",
      "dataTypeName" : "text",
      "fieldName" : "address",
      "position" : 4,
      "renderTypeName" : "text",
      "tableColumnId" : 3041232,
      "width" : 184,

    }, {
      "id" : 10544689,
      "name" : "WORK_DESCRIPTION",
      "dataTypeName" : "text",
      "fieldName" : "work_description",
      "position" : 5,
      "renderTypeName" : "text",
      "tableColumnId" : 3041233,
      "width" : 292,

    }, {
      "id" : 10544690,
      "name" : "AMOUNT_WAIVED",
      "dataTypeName" : "money",
      "fieldName" : "amount_waived",
      "position" : 6,
      "renderTypeName" : "money",
      "tableColumnId" : 3041234,
      "width" : 157,

    }, {
      "id" : 10544691,
      "name" : "AMOUNT_PAID",
      "dataTypeName" : "money",
      "fieldName" : "amount_paid",
      "position" : 7,
      "renderTypeName" : "money",
      "tableColumnId" : 3041235,
      "width" : 152,

    }, {
      "id" : 10544693,
      "name" : "CONTACT_NAME",
      "dataTypeName" : "text",
      "fieldName" : "contact_name",
      "position" : 8,
      "renderTypeName" : "text",
      "tableColumnId" : 3066743,
      "width" : 100,

    }, {
      "id" : 10544692,
      "name" : "CONTACT_ORGANIZATION",
      "dataTypeName" : "text",
      "fieldName" : "contact_organization",
      "position" : 9,
      "renderTypeName" : "text",
      "tableColumnId" : 3041237,
      "width" : 340,

      }
    ]
*/

/*
    SAMPLE ROW
    {
      0: 1,
      1: "10B910CB-9557-44BB-93C6-3407C56F06EB",
      2: 1,
      3: 1338827476,
      4: "386464",
      5: 1338827476,
      6: "386464",
      7: "{\n}",
      8: "100442998",
      9: "PERMIT - RENOVATION/ALTERATION",
      10: "2012-05-30T00:00:00",
      11: "1234 N MONTICELLO AVE",
      12: "CAMERON SCHOOL: Three Story Kindergarten thru Eight Grade Elementary School. Masonry Repairs, New Elevator, Accessibility Upgrades, Re-Roof, Limited Renovation of Finishes, Site Improvements, Parking Lot Replacement.",
      13: "46931.25",
      14: "0.00",
      15: "CHGO PUBLIC SCHOOLS",
      16: "CHGO PUBLIC SCHOOLS"
    }
*/

(function() {
    'use strict';

    const CENTS_MULTIPLIER = 100;
    const AMOUNT_COL = 14;
    const DATE_COL = 10;
    const TYPE_COL = 9;
    const DESC_COL = 12;

    module.exports = function(id) {
        return {
            id: () => id,
            type: () => arr[TYPE_COL],
            status: () => null,
            latitude: (arr) => null,
            longitude: (arr) => null,
            units: () => null,
            timestamp: (arr) => arr[DATE_COL],  // ISO datetime string
            description: (arr) => arr[DESC_COL],
            amount: (arr) => {
              return arr[AMOUNT_COL] !== null ? arr[AMOUNT_COL] * CENTS_MULTIPLIER : null;
            }
        };
    };

}());
