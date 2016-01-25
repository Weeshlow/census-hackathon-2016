(function() {

    'use strict';

    var $ = require('jquery');
    var _ = require('lodash');
    var HTML = require('../core/HTML');
    var Binning = require('../params/Binning');
    var Topic = require('../params/Topic');
    var TimeBucket = require('../params/TimeBucket');

    var TILE_SIZE = 256;
    var SIZE_FUNCTION = 'log';

    var Ring = HTML.extend({

        includes: [
            Binning,
            Topic,
            TimeBucket
        ],

        onHover: function(e) {
            var target = $(e.originalEvent.target);
            $('.topic-frequency-entry').removeClass('hover');
            var word = target.attr('data-word');
            if (word) {
                $('.topic-frequency-entry[data-word=' + word + ']').addClass('hover');
            }
        },

        onClick: function(e) {
            var target = $(e.originalEvent.target);
            $('.topic-frequency-entry').removeClass('highlight');
            var word = target.attr('data-word');
            if (word) {
                $(this._container).addClass('highlight');
                $('.topic-frequency-entry[data-word=' + word + ']').addClass('highlight');
                this.highlight = word;
            } else {
                $(this._container).removeClass('highlight');
                this.highlight = null;
            }
        },

        extractExtrema: function(data) {
            var bins = new Float64Array(data);
            return {
                min: _.min(bins),
                max: _.max(bins)
            };
        },

        renderTile: function(container, data) {
            if (!data) {
                return;
            }
            var self = this;
            var bins = new Float64Array(data);
            var resolution = Math.sqrt(bins.length);
            var binSize = (TILE_SIZE / resolution);
            var rings = [];
            bins.forEach(function(bin, index) {
                if (!bin) {
                    return;
                }
                var percent = self.transformValue(bin, SIZE_FUNCTION);
                var radius = percent * binSize;
                var offset = (binSize - radius) / 2;
                var left = (index % resolution) * binSize;
                var top = Math.floor(index / resolution) * binSize;
                rings.push('<div class="ring" style="' +
                    'left:' + (left + offset) + 'px;' +
                    'top:' + (top + offset) + 'px;' +
                    'width:' + radius + 'px;' +
                    'height:' + radius + 'px;' +
                    '"></div>');
            });
            container.innerHTML = rings.join('\n');
        }
    });

    module.exports = Ring;

}());
