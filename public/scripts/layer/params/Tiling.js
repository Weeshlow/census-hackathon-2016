(function() {

    'use strict';

    var setXField = function(field) {
        if (field !== this._params.x) {
            this._params.x = field;
            this.clearExtrema();
        }
        return this;
    };

    var getXField = function() {
        return this._params.x;
    };

    var setYField = function(field) {
        if (field !== this._params.y) {
            this._params.y = field;
            this.clearExtrema();
        }
        return this;
    };

    var getYField = function() {
        return this._params.y;
    };

    var setExtents = function(extents) {
        if (extents.top !== undefined) {
            this._params.top = extents.top;
        }
        if (extents.bottom !== undefined) {
            this._params.bottom = extents.bottom;
        }
        if (extents.left !== undefined) {
            this._params.left = extents.left;
        }
        if (extents.right !== undefined) {
            this._params.right = extents.right;
        }
        return this;
    };

    var getExtents = function() {
        return {
            top: this._params.top,
            bottom: this._params.bottom,
            left: this._params.left,
            right: this._params.right
        };
    };

    module.exports = {
        setXField: setXField,
        getXField: getXField,
        setYField: setYField,
        getYField: getYField,
        setExtents: setExtents,
        getExtents: getExtents
    };

}());
