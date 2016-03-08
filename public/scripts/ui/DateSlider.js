(function() {
    'use strict';

    var moment = require('moment');
    var DAY_MS = 86400000;

    var _getFriendlyDate = function(date) {
        return moment.utc(date).format('dddd, MMMM Do YYYY');
    };

    var DateSlider = function(spec) {
        var self = this;
        // parse inputs
        spec = spec || {};
        spec.label = spec.label || 'missing-label';
        spec.min = spec.min !== undefined ? spec.min : 0;
        spec.max = spec.max !== undefined ? spec.max : Date.Now();
        spec.step = DAY_MS;
        this._formatter = spec.formatter || function(values) {
            return _getFriendlyDate(values[0]) + ' to ' + _getFriendlyDate(values[1]);
        };
        if (spec.initialValue !== undefined) {
            spec.initialFormattedValue = this._formatter(spec.initialValue);
            spec.initialValue = '[' + spec.initialValue[0] + ',' + spec.initialValue[1] + ']';
        } else {
            spec.initialFormattedValue = this._formatter([spec.min, spec.max]);
            spec.initialValue = '[' + spec.min + ',' + spec.max + ']';
        }
        // create container element
        this._$container = $(Templates.dateslider(spec));
        this._$label = this._$container.find('.date-label');
        // create slider and attach callbacks
        this._$slider = new Slider(this._$container.find('.slider')[0], {
            tooltip: 'hide',
        });
        if ($.isFunction(spec.slideStart)) {
            this._$slider.on('slideStart', spec.slideStart);
        }
        if ($.isFunction(spec.slideStop)) {
            this._$slider.on('slideStop', spec.slideStop);
        }
        if ($.isFunction(spec.change)) {
            this._$slider.on('change', spec.change);
        }
        if ($.isFunction(spec.slide)) {
            this._$slider.on('slide', spec.slide);
        }
        this._$slider.on('change', function(event) {
            self._$label.text(self._formatter(event.newValue));
        });
    };

    DateSlider.prototype.getElement = function() {
        return this._$container;
    };
    module.exports = DateSlider;

}());
