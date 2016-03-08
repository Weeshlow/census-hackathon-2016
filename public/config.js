(function() {

    'use strict';

    module.exports = {
        ES_INDICES: {
            census: 'census',
            crime: 'crime'
        },
        S3_BUCKET: 'http://xdata-tiles.s3-website-us-east-1.amazonaws.com',
        REDIS_STORE: 'redis',
        META_TYPE: 'default',
        PERMIT_TOPICS: [
            'EQUIPMENT',
            'WORK',
            'CHILD CARE APPLICATION TRACKING SYSTEM',
            'PLUMBING',
            'FOOD SERVICE EST',
            'INCORRECT LICENSE',
            'ALTERATION',
            'FENCE',
            'NEW BUILDING',
            'TEMP FOOD SERV ESTAB',
            'ELECTRIC WIRING',
            'SIDEWALK SHED',
            'BUILDING RESIDENTIAL PERMIT',
            'EASY PERMIT PROCESS',
            'RENOVATION/ALTERATION',
            'Street Occupancy Permit',
            'Construction',
            'Short Form Bldg Permit',
            'SIGN',
            'ELECTRICAL',
            'RETAIL FOOD PROCESS',
            'Additions',
            'Alterations',
            'Repairs',
            'Plumbing',
            'FULL DEMOLITION',
            'SCAFFOLD',
            'BOILER REGISTRATION',
            'GAS'
        ],
        CRIME_TOPICS: [
            'Burglary',
            'Robbery',
            'Larceny',
            'Theft',
            'Homicide',
            'Shooting'
        ]
    };

}());
