/*
  "id" : 114400032,
  "name" : "Permit Number",
  "dataTypeName" : "text",
  "description" : "Number assigned to uniquely identify permit",
  "fieldName" : "permitno",
  "position" : 1,
  "renderTypeName" : "text",
  "tableColumnId" : 3659618,
  "width" : 196,
  "
}, {
  "id" : 114400041,
  "name" : "Added Date",
  "dataTypeName" : "calendar_date",
  "description" : "The date that the applicant applied for the permit and the information entered into the database",
  "fieldName" : "addeddate",
  "position" : 10,
  "renderTypeName" : "calendar_date",
  "tableColumnId" : 3659620,
  "width" : 208,
}, {
  "id" : 114400042,
  "name" : "Issue Date",
  "dataTypeName" : "calendar_date",
  "description" : "The date that the permit is issued.  When the permit is issued, construction is allowed to commence.  DPS has reviewed the construction plans according to the applicable building and life safety codes and approved the plans",
  "fieldName" : "issueddate",
  "position" : 11,
  "renderTypeName" : "calendar_date",
  "tableColumnId" : 3659621,
  "width" : 220,
}, {
  "id" : 114400043,
  "name" : "Final Date",
  "dataTypeName" : "calendar_date",
  "description" : "The final date indicates the date that construction has been completed and approved by DPS.  The final inspection was conducted that date/time by the DPS inspector and was acceptable",
  "fieldName" : "finaleddate",
  "position" : 12,
  "renderTypeName" : "calendar_date",
  "tableColumnId" : 3659622,
  "width" : 232
}, {
  "id" : 114400044,
  "name" : "Building Area",
  "dataTypeName" : "number",
  "description" : "The number of square feet for the proposed construction.  For a new home, it is the entire building area.  For an addition or alteration, it represents only the area of the affected space, not the entire structure",
  "fieldName" : "buildingarea",
  "position" : 13,
  "renderTypeName" : "number",
  "tableColumnId" : 3659623,
  "width" : 244
}, {
  "id" : 114400045,
  "name" : "Declared Valuation",
  "dataTypeName" : "money",
  "description" : "The value or cost of the proposed construction or work as declared by the applicant",
  "fieldName" : "declaredvaluation",
  "position" : 14,
  "renderTypeName" : "money",
  "tableColumnId" : 3659624,
  "width" : 304
}, {
  "id" : 114400046,
  "name" : "Description",
  "dataTypeName" : "text",
  "description" : "Description of planned work",
  "fieldName" : "description",
  "position" : 15,
  "renderTypeName" : "text",
  "tableColumnId" : 3659625,
  "width" : 232,

}, {
  "id" : 114400047,
  "name" : "Application Type",
  "dataTypeName" : "text",
  "description" : "Type of permit application",
  "fieldName" : "applicationtype",
  "position" : 16,
  "renderTypeName" : "text",
  "tableColumnId" : 3659626,
  "width" : 280
}, {
  "id" : 114400048,
  "name" : "Work Type",
  "dataTypeName" : "text",
  "description" : "Type of work to be performed",
  "fieldName" : "worktype",
  "position" : 17,
  "renderTypeName" : "text",
  "tableColumnId" : 3659627,
  "width" : 196
}, {
  "id" : 114400049,
  "name" : "Use Code",
  "dataTypeName" : "text",
  "description" : "Type of structure work will be performed on",
  "fieldName" : "usecode",
  "position" : 18,
  "renderTypeName" : "text",
  "tableColumnId" : 3659628,
  "width" : 184,
}, {
  "id" : 114400050,
  "name" : "Pre-direction",
  "dataTypeName" : "text",
  "description" : "Pre-direction, if the street name has a direction as a prefix. For example, E Jefferson Street",
  "fieldName" : "predir",
  "position" : 19,
  "renderTypeName" : "text",
  "tableColumnId" : 3659630,
  "width" : 172
}, {
  "id" : 114400051,
  "name" : "Location",
  "dataTypeName" : "location",
  "fieldName" : "location",
  "position" : 20,
  "renderTypeName" : "location",
  "tableColumnId" : 12064676,
  "width" : 100,
  "subColumnTypes" : [ "human_address", "latitude", "longitude", "machine_address", "needs_recoding" ]
}
*/

/*
Sample record:
0: 3969557,
1: F9E4B37E-DF53-4C6C-88D6-40EE545965EA",
2: 43969557,
3: 1451971455,
4: 498050,
5: 1451972667,
6: 498050,
7: null,
8: 208826,
9: Issued,
10: 5107,
11: DALECARLIA,
12: DR,
13: null,
14: BETHESDA,
15: MD,
16: 20816,
17: 2000-01-05T08:01:31,
18: 2000-01-05T09:01:00,
19: null,
20: 346,
21: 20000,
22: KITCHEN REMODEL,
23: BUILDING RESIDENTIAL PERMIT,
24: ALTER,
25: SINGLE FAMILY DWELLING,
26: null,
27: "{\"address\":\"5107 DALECARLIA DR\",\"city\":\"BETHESDA\",\"state\":\"MD\",\"zip\":\"20816\"}", "38.94928", "-77.102596", null, false
*/

// id, type, status, location, units, timestamp, description, amount

  (function() {
    'use strict';

      module.exports = function(id) {

        const CENTS_MULTIPLIER = 100;
        const TYPE_COL = 23;
        const DESC_COL_ARR = [22, 24, 25];
        const DATE_COL = 18;
        const LOC_COL = 27;
        const AMOUNT_COL = 21;

        return {
          id: () => id,
          type: (arr) => arr[TYPE_COL],
          status: () =>  null,
          latitude: (arr) => arr[LOC_COL] ? arr[LOC_COL][1] : null,
          longitude: (arr) => arr[LOC_COL] ? arr[LOC_COL][2] : null,
          units: () => null,
          timestamp: (arr) => arr[DATE_COL],
          description: (arr) => {
            const desc0 = arr[DESC_COL_ARR] ? arr[DESC_COL_ARR][0] : null;
            const desc1 = arr[DESC_COL_ARR] ? arr[DESC_COL_ARR][1] : null;
            const desc2 = arr[DESC_COL_ARR] ? arr[DESC_COL_ARR][2] : null;
            return arr[TYPE_COL] + ': ' + desc0 + ',' + desc1 + ',' + desc2;
          },
          amount: (arr) => arr[AMOUNT_COL] * CENTS_MULTIPLIER
        };
      };
  }());
