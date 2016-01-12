/*
    *** PUT SCHEMA HEADER HERE ***

    Ex:

    [{
        "id" : 209261636,
        "name" : "PERMIT_DATE",
        "dataTypeName" : "calendar_date",
        "description" : "The date when Building Permit has been issued.",
        "fieldName" : "issue_date",
        "position" : 1,
        "renderTypeName" : "calendar_date",
        "tableColumnId" : 20545861,
        "width" : 127,
    },{
        "id" : 209261637,
        "name" : "PERMIT_NUMBER",
        "dataTypeName" : "text",
        "description" : "The unique City-issued permit number ",
        "fieldName" : "permit_number",
        "position" : 2,
        "renderTypeName" : "text",
        "tableColumnId" : 20545862,
        "width" : 142,
    }
    ...
    ]
*/

/*
    *** PUT A SAMPLE ROW HERE ***

    Ex:

    {
        0: 342118,
        1: "40D4B809-2D01-47F2-94FD-2B3FADC6214C",
        2: 342118,
        3: 1451733094,
        4: "393213",
        5: 1451733094,
        6: "393213",
        7: null,
        8: "2015-12-31T00:00:00",
        9: "185157437-002",
        10: "2015",
        11: "12",
        12: "2015-12-31T00:00:00",
        13: "Other Miscellaneous Building",
        14: "11807 - 21 AVENUE SW",
        15: "Plan 0620257 Blk 21 Lot 18B",
        16: "RUTHERFORD",
        17: "5454",
        18: "To construct interior alterations to an existing Semi-Detached House, Basement development (NOT to be used as an additional Dwelling).1 bedroom, 1 bathroom, living room, mechanical room, storage,",
        19: "Semi-Detached House (210)",
        20: "(03) Interior Alterations",
        21: "375",
        22: "15000",
        23: "RA7, RF4",
        24: "0",
        25: "53.4107552408284",
        26: "-113.529505586126",
        27: [ "{\"address\":\"\",\"city\":\"\",\"state\":\"\",\"zip\":\"\"}", "53.4107552408284", "-113.529505586126", null, false ],
        28: "1"
    }
*/

(function() {
    'use strict';

    module.exports = function(id) {
        return {
            id: () => id,
            type: (/* arr */) => null,
            status: (/* arr */) => null,
            latitude: (/* arr */) => null,
            longitude: (/* arr */) => null,
            units: (/* arr */) => null,
            timestamp: (/* arr */) => null, // ISO Date format!
            description: (/* arr */) => null,
            amount: (/* arr */) => null // Use Cents!
        };
    };

}());
