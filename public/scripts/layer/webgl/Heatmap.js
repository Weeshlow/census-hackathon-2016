(function() {

    'use strict';

    var _ = require('lodash');
    var WebGL = require('../core/WebGL');
    var Binning = require('../params/Binning');
    var Topic = require('../params/Topic');
    var TimeRange = require('../params/TimeRange');
    var ColorRamp = require('../mixins/ColorRamp');

    var Heatmap = WebGL.extend({

        includes: [
            Binning,
            Topic,
            TimeRange,
            ColorRamp
        ],

        options: {
            shaders: {
                vert: '../../shaders/heatmap.vert',
                frag: '../../shaders/heatmap.frag',
            }
        },

        initialize: function() {
            ColorRamp.initialize.apply(this, arguments);
            // base
            WebGL.prototype.initialize.apply(this, arguments);
        },

        getColorRamp: function() {
            var from = this._colorRamp.from;
            var to = this._colorRamp.to;
            return {
                from: [
                    from.r / 255,
                    from.g / 255,
                    from.b / 255,
                    from.a / 255
                ],
                to: [
                    to.r / 255,
                    to.g / 255,
                    to.b / 255,
                    to.a / 255
                ]
            };
        },

        extractExtrema: function(data) {
            var bins = new Float64Array(data);
            return {
                min: _.min(bins),
                max: _.max(bins)
            };
        },

        beforeDraw: function() {
            this._shader.setUniform('uMin', this.getExtrema().min);
            this._shader.setUniform('uMax', this.getExtrema().max);
            this._shader.setUniform('uColorRampFrom', this.getColorRamp().from);
            this._shader.setUniform('uColorRampTo', this.getColorRamp().to);
        }

    });

    module.exports = Heatmap;

}());
