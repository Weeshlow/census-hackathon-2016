(function() {

    'use strict';

    var _ = require('lodash');
    var Canvas = require('../core/Canvas');
    var Binning = require('../params/Binning');
    var Topic = require('../params/Topic');
    var TimeRange = require('../params/TimeRange');
    var ColorRamp = require('../mixins/ColorRamp');

    var Heatmap = Canvas.extend({

        includes: [
            Binning,
            Topic,
            TimeRange,
            ColorRamp
        ],

        initialize: function() {
            ColorRamp.initialize.apply(this, arguments);
            // base
            Canvas.prototype.initialize.apply(this, arguments);
        },

        extractExtrema: function(data) {
            var bins = new Float64Array(data);
            return {
                min: _.min(bins),
                max: _.max(bins)
            };
        },

        renderTile: function(canvas, data) {
            if (!data) {
                return;
            }
            var bins = new Float64Array(data);
            var resolution = Math.sqrt(bins.length);
            var ramp = this.getColorRamp();
            var tileCanvas = this.renderCanvas(bins, resolution, ramp, 'log');
            var ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(
                tileCanvas,
                0, 0,
                resolution, resolution,
                0, 0,
                canvas.width, canvas.height);
        }

    });

    module.exports = Heatmap;

}());
