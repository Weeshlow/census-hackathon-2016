(function() {

    'use strict';

    var ColorRampFuncs = require('../color/ColorRampFuncs');

    var renderCanvas = function(bins, resolution, rampFunc, type) {
        var canvas = document.createElement('canvas');
        canvas.height = resolution;
        canvas.width = resolution;
        var ctx = canvas.getContext('2d');
        var imageData = ctx.getImageData(0, 0, resolution, resolution);
        var data = imageData.data;
        var self = this;
        var color = [0, 0, 0, 0];
        bins.forEach(function(bin, index) {
            var val = self.transformValue(bin, type);
            val = Math.max(0, Math.min(1, val));
            if (val === 0) {
                color[0] = 0;
                color[1] = 0;
                color[2] = 0;
                color[3] = 0;
            } else {
                rampFunc(val, color);
            }
            data[index * 4] = color[0];
            data[index * 4 + 1] = color[1];
            data[index * 4 + 2] = color[2];
            data[index * 4 + 3] = color[3];
        });
        ctx.putImageData(imageData, 0, 0);
        return canvas;
    };

    var setColorRamp = function(type) {
        var func = ColorRampFuncs[type.toLowerCase()];
        if (func) {
            this._colorRamp = func;
        }
        return this;
    };

    var getColorRamp = function() {
        return this._colorRamp;
    };

    var initialize = function() {
        this._colorRamp = ColorRampFuncs.verdant;
    };

    module.exports = {
        initialize: initialize,
        setColorRamp: setColorRamp,
        getColorRamp: getColorRamp,
        renderCanvas: renderCanvas
    };

}());
