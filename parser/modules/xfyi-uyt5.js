/*
  [{
      "id" : 75767556,
      "name" : "Source",
      "dataTypeName" : "text",
      "fieldName" : "source",
      "position" : 2,
      "renderTypeName" : "text",
      "tableColumnId" : 11256900,
      "width" : 109,

    }, {
      "id" : 75767557,
      "name" : "License_Permit_Holder",
      "dataTypeName" : "text",
      "fieldName" : "license_permit_holder",
      "position" : 3,
      "renderTypeName" : "text",
      "tableColumnId" : 11256901,
      "width" : 271,

    }, {
      "id" : 75767558,
      "name" : "Business_Description",
      "dataTypeName" : "text",
      "fieldName" : "business_description",
      "position" : 4,
      "renderTypeName" : "text",
      "tableColumnId" : 11256902,
      "width" : 303,

    }, {
      "id" : 75767559,
      "name" : "License/Permit_Number",
      "dataTypeName" : "text",
      "fieldName" : "license_permit_number",
      "position" : 5,
      "renderTypeName" : "text",
      "tableColumnId" : 11256903,
      "width" : 187,

<<<<<<< HEAD
/*
    SAMPLE ROW: 
    {
      0: 1370997875,
      1: 461725,
      2: "DOB Job Permit", 
      3: "VAS & SONS CORP",
      4: null,
      5: "32010861902",
      6:  "EQUIPMENT WORK",
      7: null,
      8: "2010-05-06",
      9: "2011-04-25",
      10: "2010-05-06",
      11: "PERMIT ISSUED",
      12: "1954",
      13: "OCEAN AVENUE",
      14: "BROOKLYN",
      15: "11230",
      16: "BROOKLYN",
      17: "3181615",
      18: "3067570042",
      19: "40.614241", 
      20: "-73.954631"
      21: null,
      22: "0600253"
      23: "GC"
    }
*/





(function() {
    'use strict';

    var LAT_COL = 25;
    var LON_COL = 26;   
    var DESC_COL = 10; 
    var STAT_COL = 17; 
    var EXP_DATE = 15; 
    var ISS_DATE = 14; 
    var STAT_DATE = 16; 
    var TYPE_DESC = 12; 
    var SUBTYPE_DESC = 13; 


    module.exports = function(id) {
        return {
            id: function() {
                return id;
            }, 
            type: function (arr) {
                return arr[TYPE_DESC] + ';' + arr[SUBTYPE_DESC];
            },
            status: function (arr) {
                return arr[STAT_COL];
            },
            latitude: function (arr) {
                return arr[LAT_COL]; 
            },
            longitude: function (arr) {
                return arr[LON_COL]; 
            },
            units: function() {
                return null; 
            },
            timestamp: function (arr) {
                return arr[ISS_DATE]; 
            },
            description: function (arr) {
                return arr[DESC_COL]; 
            },
            amount: function () {
                return null;
            }
        };
    };
}()); 

=======
    }, {
      "id" : 75767560,
      "name" : "Permit_Type_Description",
      "dataTypeName" : "text",
      "fieldName" : "permit_type_description",
      "position" : 6,
      "renderTypeName" : "text",
      "tableColumnId" : 11256904,
      "width" : 249,
>>>>>>> e97a277c2482db542a30b2aa4b62b387bef2b957

    }, {
      "id" : 75767561,
      "name" : "Permit_Subtype_Description",
      "dataTypeName" : "text",
      "fieldName" : "permit_subtype_description",
      "position" : 7,
      "renderTypeName" : "text",
      "tableColumnId" : 11256905,
      "width" : 247,
    }, {
      "id" : 75767562,
      "name" : "Permit_Issuance_Date",
      "dataTypeName" : "text",
      "fieldName" : "permit_issuance_date",
      "position" : 8,
      "renderTypeName" : "text",
      "tableColumnId" : 11256906,
      "width" : 180,
    }, {
      "id" : 75767563,
      "name" : "Permit_Expiration_Date",
      "dataTypeName" : "text",
      "fieldName" : "permit_expiration_date",
      "position" : 9,
      "renderTypeName" : "text",
      "tableColumnId" : 11256907,
      "width" : 186,
    }, {
      "id" : 75767564,
      "name" : "Permit_Status_Date",
      "dataTypeName" : "text",
      "fieldName" : "permit_status_date",
      "position" : 10,
      "renderTypeName" : "text",
      "tableColumnId" : 11256908,
      "width" : 175,
    }, {
      "id" : 75767565,
      "name" : "Permit_Status_Description",
      "dataTypeName" : "text",
      "fieldName" : "permit_status_description",
      "position" : 11,
      "renderTypeName" : "text",
      "tableColumnId" : 11256909,
      "width" : 217,
    }, {
      "id" : 75767566,
      "name" : "Address",
      "dataTypeName" : "text",
      "fieldName" : "address",
      "position" : 12,
      "renderTypeName" : "text",
      "tableColumnId" : 11256910,
      "width" : 110,

    }, {
      "id" : 75767567,
      "name" : "Street",
      "dataTypeName" : "text",
      "fieldName" : "street",
      "position" : 13,
      "renderTypeName" : "text",
      "tableColumnId" : 11256911,
      "width" : 172,

    }, {
      "id" : 75767568,
      "name" : "City",
      "dataTypeName" : "text",
      "fieldName" : "city",
      "position" : 14,
      "renderTypeName" : "text",
      "tableColumnId" : 11256912,
      "width" : 128,

    }, {
      "id" : 75767569,
      "name" : "Zip_Code",
      "dataTypeName" : "text",
      "fieldName" : "zip_code",
      "position" : 15,
      "renderTypeName" : "text",
      "tableColumnId" : 11256913,
      "width" : 104,

    }, {
      "id" : 75767570,
      "name" : "Borough",
      "dataTypeName" : "text",
      "fieldName" : "borough",
      "position" : 16,
      "renderTypeName" : "text",
      "tableColumnId" : 11256914,
      "width" : 107,

    }, {
      "id" : 75767571,
      "name" : "Building_ID_No",
      "dataTypeName" : "text",
      "fieldName" : "building_id",
      "position" : 17,
      "renderTypeName" : "text",
      "tableColumnId" : 11256915,
      "width" : 152,

    }, {
      "id" : 75767572,
      "name" : "Borough_Block_Lot",
      "dataTypeName" : "text",
      "fieldName" : "borough_block_lot",
      "position" : 18,
      "renderTypeName" : "text",
      "tableColumnId" : 11256916,
      "width" : 166,

    }, {
      "id" : 75767573,
      "name" : "Latitude_WGS84",
      "dataTypeName" : "text",
      "fieldName" : "latitude_wgs84",
      "position" : 19,
      "renderTypeName" : "text",
      "tableColumnId" : 11256917,
      "width" : 165,

    }, {
      "id" : 75767574,
      "name" : "Longitude_WGS84",
      "dataTypeName" : "text",
      "fieldName" : "longitude_wgs84",
      "position" : 20,
      "renderTypeName" : "text",
      "tableColumnId" : 11256918,
      "width" : 165,

    }, {
      "id" : 75767575,
      "name" : "License/Permit_Holder_Name",
      "dataTypeName" : "text",
      "fieldName" : "license_permit_holder_name",
      "position" : 21,
      "renderTypeName" : "text",
      "tableColumnId" : 11256919,
      "width" : 264,

    }, {
      "id" : 75767576,
      "name" : "DOB_Skilled_Trades_Lic_Num",
      "dataTypeName" : "text",
      "fieldName" : "dob_skilled_trades_lic_num",
      "position" : 22,
      "renderTypeName" : "text",
      "tableColumnId" : 11256920,
      "width" : 229,

    }, {
      "id" : 75767577,
      "name" : "DOB_Skilled_Trades_Lic_Type",
      "dataTypeName" : "text",
      "fieldName" : "dob_skilled_trades_lic_type",
      "position" : 23,
      "renderTypeName" : "text",
      "tableColumnId" : 11256921,
      "width" : 246,

    } ],

*/

/*
    SAMPLE ROW:
    {
      0: 1,
      1: "98161E97-47D1-41C0-AA1D-7F7FEE5B0DF9",
      2: 1,
      3: 1370997875,
      4: "435151",
      5: 1370997875,
      6: "435151",
      7: "{\n}",
      8: "DOB Job Permit",
      11: "SAME",
      12: null,
      13: "30043914901",
      14: "EQUIPMENT WORK",
      15: null,
      16: "1999-06-03",
      17: "2000-06-02",
      18: "1999-06-03",
      19: "PERMIT ISSUED",
      20: "753",
      21: "EAST 52 STREET",
      22: "BROOKLYN",
      23: "11203",
      24: "BROOKLYN",
      25: "3222087",
      26: "3079280038",
      27: "40.641806",
      28: -73.92708",
      29: null,
      30: null,
      31: "OW"
    }
*/

(function() {
  'use strict';

  const LAT_COL = 27;
  const LON_COL = 28;
  const DESC_COL = 12;
  const STAT_COL = 19;
  const DATE_COL = 16;
  const TYPE_DESC = 14;
  const SUBTYPE_DESC = 15;

  module.exports = function(id) {
    return {
      id: () => id,
      type: (arr) => {
        return arr[TYPE_DESC] + ((arr[SUBTYPE_DESC] !== null) ? (':' + arr[SUBTYPE_DESC]) : '');
      },
      status: (arr) => arr[STAT_COL],
      latitude: (arr) => arr[LAT_COL],
      longitude: (arr) => arr[LON_COL],
      units: () => null,
      timestamp: (arr) => arr[DATE_COL],
      description: (arr) => arr[DESC_COL],
      amount: () => null
    };
  };
}());
