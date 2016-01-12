/*
    NOTE: ALL POSITION VALUES ARE INCORRECT, THE FIRST 8 ROWS CONTAIN METADATA

    [{
      "id" : 236692555,
      "name" : "Application/Permit Number",
      "dataTypeName" : "text",
      "description" : "The tracking number used to refer to this application or permit record in various DPD tracking systems.",
      "fieldName" : "application_permit_number",
      "position" : 1,
      "renderTypeName" : "text",
      "tableColumnId" : 1398559,
      "width" : 100,
      "format" : { }
    }, {
      "id" : 236692556,
      "name" : "Permit Type",
      "dataTypeName" : "text",
      "description" : "Type of activity covered by the permit.",
      "fieldName" : "permit_type",
      "position" : 2,
      "renderTypeName" : "text",
      "tableColumnId" : 1398560,
      "width" : 100,
      "format" : { }
    }, {
      "id" : 236692557,
      "name" : "Address",
      "dataTypeName" : "text",
      "description" : "Street address of the work site.",
      "fieldName" : "address",
      "position" : 3,
      "renderTypeName" : "text",
      "tableColumnId" : 1398561,
      "width" : 100,
      "format" : { }
    }, {
      "id" : 236692558,
      "name" : "Description",
      "dataTypeName" : "text",
      "description" : "Brief description of the work that will be done under this permit. This is subject to change prior to issuance of the permit, but generally more stable if an issue date exists. Very long descriptions have been truncated.",
      "fieldName" : "description",
      "position" : 4,
      "renderTypeName" : "text",
      "tableColumnId" : 1398562,
      "width" : 100,
      "format" : { }
    }, {
      "id" : 236692559,
      "name" : "Category",
      "dataTypeName" : "text",
      "description" : "The broad category of use or occupancy for the building where work is proposed. Valid choices are Commercial, Industrial, Institutional, Multifamily, and Single Family/Duplex. Mixed use structures are generally represented as Commercial.",
      "fieldName" : "category",
      "position" : 5,
      "renderTypeName" : "text",
      "tableColumnId" : 1398563,
      "width" : 100,
      "format" : {
        "align" : "left"
      }
    }, {
      "id" : 236692560,
      "name" : "Action Type",
      "dataTypeName" : "text",
      "description" : "Subclassification for type of work being proposed. Valid choices will vary depending on the permit type.",
      "fieldName" : "action_type",
      "position" : 6,
      "renderTypeName" : "text",
      "tableColumnId" : 1398564,
      "width" : 100,
      "format" : { }
    }, {
      "id" : 236692561,
      "name" : "Work Type",
      "dataTypeName" : "text",
      "description" : "An indicator of the complexity of the project proposed. Easier projects can be issued without plan review; more complex projects generally require plan submittal and review.",
      "fieldName" : "work_type",
      "position" : 7,
      "renderTypeName" : "text",
      "tableColumnId" : 1398565,
      "width" : 100,
      "format" : { }
    }, {
      "id" : 236692562,
      "name" : "Value",
      "dataTypeName" : "money",
      "description" : "The value of the work being proposed. The value displayed (if any) represents the best available information to date, and is subject to change as more information becomes available. Value is not collected for all permit types.",
      "fieldName" : "value",
      "position" : 8,
      "renderTypeName" : "money",
      "tableColumnId" : 1398869,
      "width" : 100,
      "format" : {
        "align" : "right"
      }
    }, {
      "id" : 236692563,
      "name" : "Applicant Name",
      "dataTypeName" : "text",
      "description" : "The name of the person or company listed on the application as the “primary applicant”. This may be the property owner, contractor, design professional, or other type of agent.\n",
      "fieldName" : "applicant_name",
      "position" : 9,
      "renderTypeName" : "text",
      "tableColumnId" : 1398567,
      "width" : 100,
      "format" : { }
    }, {
      "id" : 236692564,
      "name" : "Application Date",
      "dataTypeName" : "calendar_date",
      "description" : "The date the application was accepted as a complete submittal. If no Application Date exists this generally means the application is in a very early stage.",
      "fieldName" : "application_date",
      "position" : 10,
      "renderTypeName" : "calendar_date",
      "tableColumnId" : 1398568,
      "width" : 100,
      "format" : {
        "view" : "date",
        "align" : "left"
      }
    }, {
      "id" : 236692565,
      "name" : "Issue Date",
      "dataTypeName" : "calendar_date",
      "description" : "The date the application was issued as a valid permit. If an Application Date exists but no Issue Date exists, this generally means the application is still under review.",
      "fieldName" : "issue_date",
      "position" : 11,
      "renderTypeName" : "calendar_date",
      "tableColumnId" : 1398569,
      "width" : 100,
      "format" : {
        "view" : "date",
        "align" : "left"
      }
    }, {
      "id" : 236692566,
      "name" : "Final Date",
      "dataTypeName" : "calendar_date",
      "description" : "The date the permit had all its inspections completed. If an Issue Date exists but no Final Date exists, this generally means the permit is still under inspection.",
      "fieldName" : "final_date",
      "position" : 12,
      "renderTypeName" : "calendar_date",
      "tableColumnId" : 1398570,
      "width" : 100,
      "format" : {
        "view" : "date",
        "align" : "left"
      }
    }, {
      "id" : 236692567,
      "name" : "Expiration Date",
      "dataTypeName" : "calendar_date",
      "description" : "The date the application is due to expire. Generally, this is the date by which work is supposed to be completed (baring renewals or further extensions). If no Expiration Date exists, this generally means the application is has not been issued yet.\n",
      "fieldName" : "expiration_date",
      "position" : 13,
      "renderTypeName" : "calendar_date",
      "tableColumnId" : 1398571,
      "width" : 100,
      "format" : {
        "view" : "date",
        "align" : "left"
      }
    }, {
      "id" : 236692568,
      "name" : "Status",
      "dataTypeName" : "text",
      "description" : "The current status in the application/review/inspection lifecycle. Indicates the last process step that was fully completed.",
      "fieldName" : "status",
      "position" : 14,
      "renderTypeName" : "text",
      "tableColumnId" : 1398572,
      "width" : 100,
      "format" : { }
    }, {
      "id" : 236692569,
      "name" : "Contractor",
      "dataTypeName" : "text",
      "description" : "Contractor(s) who are associated with this permit.",
      "fieldName" : "contractor",
      "position" : 15,
      "renderTypeName" : "text",
      "tableColumnId" : 10249898,
      "width" : 100,
      "format" : { }
    }, {
      "id" : 236692570,
      "name" : "Permit and Complaint Status URL",
      "dataTypeName" : "url",
      "description" : "Link to view full details and current status information about this permit at DPD’s website",
      "fieldName" : "permit_and_complaint_status_url",
      "position" : 16,
      "renderTypeName" : "url",
      "tableColumnId" : 1398573,
      "width" : 100,
      "format" : {
        "align" : "left"
      },
      "subColumnTypes" : [ "url", "description" ]
    }, {
      "id" : 236692571,
      "name" : "Master Use Permit",
      "dataTypeName" : "text",
      "description" : "A Master Use/Land Use Permit is required before some building permits to make decisions about site-specific factors of the project, such as environmental impacts or neighborhood design considerations.",
      "fieldName" : "master_use_permit",
      "position" : 17,
      "renderTypeName" : "text",
      "tableColumnId" : 24098526,
      "width" : 100,
      "format" : {
        "align" : "left"
      }
    }, {
      "id" : 236692572,
      "name" : "Latitude",
      "dataTypeName" : "number",
      "description" : "Latitude of the worksite where permit activity occurs. May be missing for a small number of permits considered \"Unaddressable\"\n",
      "fieldName" : "latitude",
      "position" : 18,
      "renderTypeName" : "number",
      "tableColumnId" : 1403854,
      "width" : 100,
      "format" : {
        "align" : "left"
      }
    }, {
      "id" : 236692573,
      "name" : "Longitude",
      "dataTypeName" : "number",
      "description" : "Longitude of the worksite where permit activity occurs. May be missing for a small number of permits considered \"Unaddressable\"",
      "fieldName" : "longitude",
      "position" : 19,
      "renderTypeName" : "number",
      "tableColumnId" : 1403855,
      "width" : 100,
      "format" : {
        "align" : "left"
      }
    }, {
      "id" : 236692574,
      "name" : "Location",
      "dataTypeName" : "location",
      "description" : "Mapping coordinates for the permit address.",
      "fieldName" : "location",
      "position" : 20,
      "renderTypeName" : "location",
      "tableColumnId" : 1410124,
      "width" : 100,
      "format" : { },
      "subColumnTypes" : [ "human_address", "latitude", "longitude", "machine_address", "needs_recoding" ]
    }]
*/

/*
    SAMPLE ROW
    {
      0: 1,
      1: "E371B168-AEE1-4F09-8D84-C5C469FECD7F",
      2: 1,
      3: 1451991730,
      4: "387110",
      5: 1451991730,
      6: "387110",
      7: null,
      8: "6511999",
      9: "Construction",
      10: "301 NE NORTHGATE WAY",
      11: "Shoring and excavation for constuction of parking garage per plan..",
      12: "COMMERCIAL",
      13: "NEW",
      14: "Plan Review",
      15: "2308800",
      16: "CELIN, JACQUELINE",
      17: "2016-01-04T00:00:00",
      18: null,
      19: null,
      20: null,
      21: "Application Accepted",
      22: null,
      23: [ "http://web6.seattle.gov/dpd/PermitStatus/Project.aspx?id=6511999", null ],
      24: "3018742",
      25: "47.70619241",
      26: "-122.32587611",
      27: [ null, "47.70619241", "-122.32587611", null, false ]
    }
*/

(function() {
    'use strict';

    const CENTS_MULTIPLIER = 100;

    const TYPE_COL = 9;
    const LAT_COL = 25;
    const LON_COL = 26;
    const DATE_COL = 17;
    const DESC_COL = 11;
    const AMOUNT_COL = 15;
    const STAT_COL = 21;

    module.exports = function(id) {
        return {
            id: () => id,
            type: (arr) => arr[TYPE_COL],
            status: (arr) => arr[STAT_COL],
            latitude: (arr) => arr[LAT_COL],
            longitude: (arr) => arr[LON_COL],
            units: () => null,
            timestamp: (arr) => arr[DATE_COL],
            description: (arr) => arr[DESC_COL] ? arr[DESC_COL].trim() : null,
            amount: (arr) => arr[AMOUNT_COL] * CENTS_MULTIPLIER
        };
    };

}());
