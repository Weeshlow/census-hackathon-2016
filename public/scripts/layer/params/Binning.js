(function() {

    'use strict';

    var Tiling = require('./Tiling');

    var setResolution = function(resolution) {
        if (resolution !== this._params.resolution) {
            this._params.resolution = resolution;
            this.clearExtrema();
        }
        return this;
    };

    var getResolution = function() {
        return this._params.resolution;
    };

    var setZField = function(field) {
        if (field !== this._params.z) {
            this._params.z = field;
            this.clearExtrema();
        }
        return this;
    };

    var getZField = function() {
        return this._params.z;
    };

    module.exports = {
        // tiling
        setXField: Tiling.setXField,
        getXField: Tiling.getXField,
        setYField: Tiling.setYField,
        getYField: Tiling.getYField,
        // extents
        setExtents: Tiling.setExtents,
        getExtents: Tiling.getExtents,
        // binning
        setZField: setZField,
        getZField: getZField,
        setResolution: setResolution,
        getResolution: getResolution
    };

}());
