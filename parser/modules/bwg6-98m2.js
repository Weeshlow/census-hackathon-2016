/*
    NOTE: ALL POSITION VALUES ARE INCORRECT, THE FIRST 8 ROWS CONTAIN METADATA

    [{
        "id" : 178502931,
        "name" : "Permit Number",
        "dataTypeName" : "text",
        "fieldName" : "permit_number",
        "position" : 1,
        "renderTypeName" : "text",
        "tableColumnId" : 20720574,
        "width" : 117,

      }, {
        "id" : 178502932,
        "name" : "block",
        "dataTypeName" : "text",
        "fieldName" : "block",
        "position" : 2,
        "renderTypeName" : "text",
        "tableColumnId" : 20720575,
        "width" : 85,

      }, {
        "id" : 178502933,
        "name" : "lot",
        "dataTypeName" : "number",
        "fieldName" : "lot",
        "position" : 3,
        "renderTypeName" : "number",
        "tableColumnId" : 20720576,
        "width" : 77,

      }, {
        "id" : 178502934,
        "name" : "PropertyAddress",
        "dataTypeName" : "text",
        "fieldName" : "propertyaddress",
        "position" : 4,
        "renderTypeName" : "text",
        "tableColumnId" : 20720577,
        "width" : 208,

      }, {
        "id" : 178502935,
        "name" : "Description",
        "dataTypeName" : "text",
        "fieldName" : "description",
        "position" : 5,
        "renderTypeName" : "text",
        "tableColumnId" : 20720578,
        "width" : 515,

      }, {
        "id" : 178502936,
        "name" : "Location",
        "dataTypeName" : "location",
        "fieldName" : "location",
        "position" : 6,
        "renderTypeName" : "location",
        "tableColumnId" : 20720579,
        "width" : 193,
        ,
        "subColumnTypes" : [ "human_address", "latitude", "longitude", "machine_address", "needs_recoding" ]
    }]
*/

/*
    SAMPLE ROW
    {
       0: 1,
       1: "1180A77D-B125-4AC2-AACB-49C607AECFD8",
       2: 1,
       3: 1417793394,
       4: "393202",
       5: 1417793440,
       6: "393202",
       7: "{\n}",
       8: "P000202             ",
       9: "1478",
       10: "27",
       11: "1544 N WOLFE ST",
       12: "2 BOW WINDOWS                                                                                       ",
       13: [ "{\"address\":\"1544 N WOLFE ST\",\"city\":\"Baltimore\",\"state\":\"MD\",\"zip\":\"\"}", "39.308548390000055", "-76.59153638199996", null, false ]
    }
*/

(function() {
    'use strict';

    var LAT_COL = 13;
    var LON_COL = 13;
    var DESC_COL = 12;

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
            timestamp: function() {
                return null;
            },
            description: function(arr) {
                return arr[DESC_COL].trim();
            },
            amount: function() {
                return null;
            }
        };
    };

}());
