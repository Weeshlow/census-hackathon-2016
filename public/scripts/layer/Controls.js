(function() {

    'use strict';

    var moment = require('moment');
    var LayerMenu = require('../ui/LayerMenu');
    var Slider = require('../ui/Slider');
    var TextBox = require('../ui/TextBox');
    var ToggleBox = require('../ui/ToggleBox');
    var RangeSlider = require('../ui/RangeSlider');
    var ColorRampSlider = require('../ui/ColorRampSlider');

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
            var topics = layer.getTopics();
            var index = topics.indexOf(topic);
            if (index === -1) {
                topics.push(topic);
            }
            layer.setTopics(topics);
        }

        function removeTopic() {
            var topics = layer.getTopics();
            var index = topics.indexOf(topic);
            if (index !== -1) {
                topics.splice(index, 1);
            }
            layer.setTopics(topics);
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
        return new TextBox({
            label: field.toUpperCase() + '-Field',
            initialValue: def,
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
        layer.setTimeRange({
            from: meta.timestamp.extrema.min,
            to: meta.timestamp.extrema.max
        });
        return new RangeSlider({
            label: 'Time Range',
            min: layer.getMeta().timestamp.extrema.min,
            max: layer.getMeta().timestamp.extrema.max,
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
            case 'zField':
                return createFieldTextBox(layer, 'z', '');
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
            controls.forEach(function(control) {
                var split = control.split(':');
                var type = split[0];
                var arg;
                if (split.length > 1) {
                    arg = split[1];
                }
                layerMenu.getBody()
                    .append(getControlByType(type, layer, arg).getElement())
                    .append('<div style="clear:both;"></div>');
            });
            return layerMenu;
        }

    };

}());
