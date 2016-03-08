(function() {
    'use strict';

    function drawRamp(elem, colorFn) {
        var width = $(elem).width();
        var height = $(elem).height() - 2;
        $(elem).empty();
        var canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.border = '1px solid black';
        canvas.width = width;
        canvas.height = height;
        $(elem).append(canvas);
        var ctx = canvas.getContext('2d');
        var start = 0;
        var end = 1;
        var startX = Math.floor(start * width);
        var range = Math.floor((end - start) * width);
        var color = [];
        ctx.lineWidth = 2;
        ctx.clearRect(0, 0, width, height);
        // Start
        if (start > 0) {
            colorFn(0, color);
            ctx.fillStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (color[3] / 255) + ')';
            ctx.fillRect(0, 0, Math.floor(start * width), height);
        }
        // Gradient
        for (var x = 0; x < range; x++) {
            ctx.beginPath();
            colorFn(x / range, color);
            ctx.fillStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (color[3] / 255) + ')';
            ctx.fillRect(x + startX, 0, 1, height);
        }
        // End
        if (end < 1) {
            colorFn(1, color);
            ctx.fillStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (color[3] / 255) + ')';
            ctx.fillRect(Math.floor(end * width), 0, width - Math.floor(end * width), height);
        }
    }

    var ColorRampSlider = function(spec) {
        var self = this;
        // parse inputs
        spec = spec || {};
        spec.label = spec.label || 'missing-label';
        spec.min = spec.min !== undefined ? spec.min : 0.0;
        spec.max = spec.max !== undefined ? spec.max : 1.0;
        spec.step = spec.step !== undefined ? spec.step : 0.01;
        spec.rampFunc = spec.rampFunc;
        this._formatter = spec.formatter || function(values) {
            return values[0].toFixed(2) + ' to ' + values[1].toFixed(2);
        };
        if (spec.initialValue !== undefined) {
            spec.initialFormattedValue = this._formatter(spec.initialValue);
            spec.initialValue = '[' + spec.initialValue[0] + ',' + spec.initialValue[1] + ']';
        } else {
            spec.initialFormattedValue = this._formatter([spec.min, spec.max]);
            spec.initialValue = '[' + spec.min + ',' + spec.max + ']';
        }
        // create container element
        this._$container = $(Templates.slider(spec));
        this._$label = this._$container.find('.control-value-label');
        // create slider
        this._$slider = new Slider(this._$container.find('.slider')[0], {
            tooltip: 'hide',
        });
        // set initial ramp canvas
        // temporarily append container to body so measurements are correct
        $('body').append(this._$container);
        // make background transparent (for ramp)
        this._$container.find('.slider-selection').css('background-color', 'transparent');
        // draw ramp
        drawRamp(this._$container.find('.slider-selection'), spec.rampFunc);
        // remove from body
        $(this._container).remove();
        // attach callbacks
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
            var vals = event.newValue;
            self._$label.text(self._formatter(vals));
            // add cavnas to selection box
            drawRamp(self._$container.find('.slider-selection'), spec.rampFunc);
        });
    };

    ColorRampSlider.prototype.getElement = function() {
        return this._$container;
    };

    module.exports = ColorRampSlider;

}());
