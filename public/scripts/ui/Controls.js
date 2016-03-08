(function() {

    'use strict';

    var moment = require('moment');
    var LayerMenu = require('./LayerMenu');
    var Slider = require('./Slider');
    var TextBox = require('./TextBox');
    var ToggleBox = require('./ToggleBox');
    var RangeSlider = require('./RangeSlider');
    var ColorRampSlider = require('./ColorRampSlider');

    function createOpacitySlider(layer) {
        return new Slider({
            label: 'Opacity',
            min: 0,
            max: 1,
            step: 0.01,
            initialValue: layer.getOpacity(),
            change: function(event) {
                layer.setOpacity(event.newValue);
            }
        });
    }

    function createBrightnessSlider(layer) {
        return new Slider({
            label: 'Brightness',
            min: 0,
            max: 4,
            step: 0.04,
            initialValue: layer.getBrightness(),
            change: function(event) {
                layer.setBrightness(event.newValue);
            }
        });
    }

    function createTopicToggleBox(layer, topic) {

        function addTopic() {
            var filter = layer.getTermsFilter()[0];
            var topics = filter.terms;
            var index = topics.indexOf(topic);
            if (index === -1) {
                topics.push(topic);
            }
            layer.updateTermsFilter(filter.field, topics);
        }

        function removeTopic() {
            var filter = layer.getTermsFilter()[0];
            var topics = filter.terms;
            var index = topics.indexOf(topic);
            if (index !== -1) {
                topics.splice(index, 1);
            }
            layer.updateTermsFilter(filter.field, topics);
        }

        addTopic(topic);

        return new ToggleBox({
            label: topic,
            initialValue: true,
            enabled: function() {
                addTopic();
                layer.redraw();
            },
            disabled: function() {
                removeTopic();
                layer.redraw();
            },
        });
    }

    function createFieldTextBox(layer, field, def) {
        var method = 'get' + field.toUpperCase() + 'Field';
        var val = layer[method]();
        if (!val) {
            val = def;
        }
        return new TextBox({
            label: field.toUpperCase() + '-Field',
            initialValue: val,
            submit: function(text) {
                layer['set' + field.toUpperCase() + 'Field'](text);
                layer.redraw();
            }
        });
    }

    function createResolutionSlider(layer) {
        if (!layer.getResolution()) {
            layer.setResolution(256);
        }
        return new Slider({
            label: 'Resolution',
            min: 0,
            max: 8,
            step: 1,
            initialValue: Math.log2(layer.getResolution()),
            formatter: function(value) {
                return Math.pow(2, value);
            },
            slideStop: function(value) {
                var resolution = Math.pow(2, value);
                layer.setResolution(resolution);
                layer.redraw();
            }
        });
    }

    function createRampSlider(layer) {
        return new ColorRampSlider({
            label: 'Color Range',
            rampFunc: layer.getColorRamp(),
            slideStop: function(values) {
                layer.setValueRange({
                    min: values[0],
                    max: values[1]
                });
                layer.redraw();
            }
        });
    }

    function createTimeSlider(layer) {
        var meta = layer.getMeta();
        layer.setTimeField('timestamp');
        return new RangeSlider({
            label: 'Time Range',
            min: meta.timestamp.extrema.min,
            max: meta.timestamp.extrema.max,
            step: 86400000,
            initialValue: [layer.getTimeRange().from, layer.getTimeRange().to],
            formatter: function(values) {
                var from = moment.unix(values[0] / 1000).format('MMM D, YYYY');
                var to = moment.unix(values[1] / 1000).format('MMM D, YYYY');
                return from + ' to ' + to;
            },
            slideStop: function(values) {
                layer.setTimeRange({
                    from: values[0],
                    to: values[1]
                });
                layer.redraw();
            }
        });
    }

    function getControlByType(type, layer, arg) {
        switch (type) {
            case 'opacity':
                return createOpacitySlider(layer);
            case 'brightness':
                return createBrightnessSlider(layer);
            case 'resolution':
                return createResolutionSlider(layer);
            case 'time':
                return createTimeSlider(layer);
            case 'xField':
                return createFieldTextBox(layer, 'x', 'pixel.x');
            case 'yField':
                return createFieldTextBox(layer, 'y', 'pixel.y');
            case 'toggle-topic':
                return createTopicToggleBox(layer, arg.toLowerCase());
            case 'range':
                return createRampSlider(layer);
        }
    }

    module.exports = {

        create: function(layerName, layer, controls) {
            var layerMenu = new LayerMenu({
                layer: layer,
                label: layerName
            });
            controls.forEach(function(spec) {
                var split = spec.split(':');
                var type = split[0];
                var arg;
                if (split.length > 1) {
                    arg = split[1];
                }
                var control = getControlByType(type, layer, arg);
                layerMenu.getBody()
                    .append(control.getElement())
                    .append('<div style="clear:both;"></div>');
            });
            return layerMenu;
        }

    };

}());
