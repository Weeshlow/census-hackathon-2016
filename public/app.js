(function() {

    'use strict';

    var $ = require('./scripts/util/jQueryAjaxArrayBuffer');
    var async = require('async');

    var Config = require('./config');
    var Layers = require('./scripts/layer/Layers');
    var Controls = require('./scripts/ui/Controls');
    var DateSlider = require('./scripts/ui/DateSlider');

    function init(done) {
        var req = {};
        // meta data reqs
        _.forIn(Config.ES_INDICES, function(val, key) {
            req[key] = function(done) {
                $.ajax({
                    url: 'meta/' + Config.META_TYPE + '/' + val + '/' + Config.REDIS_STORE
                }).done(function(meta) {
                    done(null, meta);
                }).fail(function(err) {
                    done(err, null);
                });
            };
        });
        // tile requester
        req.requester = function(done) {
            var requester = new prism.TileRequestor('tile-dispatch', function() {
                done(null, requester);
            });
        };
        // blink map while we wait for metadata
        $('#map').css('background-color', '#ccc');
        $('#map').addClass('blinking');
        // request everything at once in a blaze of glory
        async.parallel(req, function(err, res) {
            // check for error
            if (err) {
                done(err, null);
                return;
            }
            // unblink the map
            $('#map').removeClass('blinking');
            $('#map').css('background-color', '');
            // get the meta data responses
            var meta = {};
            _.forIn(res, function(val, key) {
                if (Config.ES_INDICES[key]) {
                    meta[key] = val;
                }
            });
            // execute callback
            done(null, {
                requester: res.requester,
                meta: meta
            });
        });
    }

    window.startApp = function() {

        // Map control
        var map = new L.Map('map', {
            zoomControl: false,
            // zoom: 4,
            // center: [0, 0],
            zoom: 5,
            center: [39.5, -98.3],
            maxZoom: 18,
            fadeAnimation: true,
            zoomAnimation: true
        });

        // top right controls
        new L.Control.Zoom({
            position: 'topright'
        }).addTo(map);

        // Base map
        var baseLayer = Layers.base();
        var base = {
            layer: baseLayer,
            controls: Controls.create('Basemap', baseLayer, ['brightness'])
        };

        // Label layer
        var labelLayer = Layers.label();
        var label = {
            layer: labelLayer,
            controls: Controls.create('Labels', labelLayer, ['opacity'])
        };

        // Pending tile layer
        var pendingLayer = new prism.TileLayer.Pending({
            rendererClass: prism.Renderer.Pending.Blink
        });
        pendingLayer.addTo(map);

        // pull meta data and establish a websocket connection for generating tiles
        init(function(err, res) {
            if (err) {
                console.error(err);
                return;
            }
            var requester = res.requester;
            var meta = res.meta;

            // crime rings
            var crimeTopics = _.map(Config.CRIME_TOPICS, function(topic) {
                return 'toggle-topic:' + topic;
            });
            $('.controls').append();
            var esRingsLayer = Layers.esTopicRings(
                meta.crime,
                Config.ES_INDICES.crime,
                'description',
                Config.CRIME_TOPICS,
                requester,
                pendingLayer);
            var esRings = {
                layer: esRingsLayer,
                controls: Controls.create(
                    'Crime (ES)',
                    esRingsLayer,
                    ['opacity', 'resolution'].concat(crimeTopics)
                )
            };

            // cumulative
            var cumulativeLayer = Layers.s3CumulativeHeatmap(pendingLayer);
            var s3CumulativeHeatmap = {
                layer: cumulativeLayer,
                controls: Controls.create(
                    'Cumulative Heatmap (S3)',
                    cumulativeLayer,
                    ['opacity', 'range']
                )
            };

            // minority permits
            var minLayer = Layers.s3MinorityHeatmap(pendingLayer);
            var s3MinorityHeatmap = {
                layer: minLayer,
                controls: Controls.create(
                    'Minority Heatmap (S3)',
                    minLayer,
                    ['opacity', 'range']
                )
            };

            // non-minority permits
            var nonMinLayer = Layers.s3NonMinorityHeatmap(pendingLayer);
            var s3NonMinorityHeatmap = {
                layer: nonMinLayer,
                controls: Controls.create(
                    'Non-Minority Heatmap (S3)',
                    nonMinLayer,
                    ['opacity', 'range']
                )
            };

            // permits heatmap
            var permitLayer = Layers.s3PermitsHeatmap(pendingLayer);
            var s3PermitsHeatmap = {
                layer: permitLayer,
                controls: Controls.create(
                    'Permits Heatmap (S3)',
                    permitLayer,
                    ['opacity', 'range']
                )
            };

            // topics word cloud
            var topicsLayer = Layers.s3TopicsWordCloud(pendingLayer);
            var s3TopicsWordCloud = {
                layer: topicsLayer,
                controls: Controls.create(
                    'Topics WordCloud (S3)',
                    topicsLayer,
                    ['opacity']
                )
            };

            // types word cloud
            var typesLayer = Layers.s3TypesWordCloud(pendingLayer);
            var s3TypesWordCloud = {
                layer: typesLayer,
                controls: Controls.create(
                    'Types WordCloud (S3)',
                    typesLayer,
                    ['opacity']
                )
            };

            // live permits heatmap
            var esPermitLayer = Layers.esHeatmap(
                meta.census,
                Config.ES_INDICES.census,
                requester,
                pendingLayer);
            var esPermitsHeatmap = {
                layer: esPermitLayer,
                controls: Controls.create(
                    'Census Heatmap (ES)',
                    esPermitLayer,
                    ['opacity', 'resolution', 'range', 'xField', 'yField']
                )
            };

            // controls

            var minDate = Number.MAX_VALUE;
            _.min(meta, function(meta) {
                minDate = Math.min(minDate, meta.timestamp.extrema.min);
            });
            var maxDate = 0;
            _.max(meta, function(meta) {
                maxDate = Math.max(maxDate, meta.timestamp.extrema.max);
            });

            $('.date-controls').append(
                new DateSlider({
                    label: 'Date Range',
                    min: minDate,
                    max: maxDate,
                    slideStop: function(values) {
                        esPermitsHeatmap.layer.setTimeRange({
                            from: values[0],
                            to: values[1]
                        });
                        esPermitsHeatmap.layer.redraw();
                        esRings.layer.setTimeRange({
                            from: values[0],
                            to: values[1]
                        });
                        esRings.layer.redraw();
                    }
                }).getElement());

            var orderings = [
                s3TopicsWordCloud,
                s3TypesWordCloud,
                label,
                esRings,
                esPermitsHeatmap,
                s3CumulativeHeatmap,
                s3PermitsHeatmap,
                s3MinorityHeatmap,
                s3NonMinorityHeatmap,
                base
            ];

            orderings.forEach(function(entry, index) {
                entry.layer.setZIndex(orderings.length - index);
                entry.layer.addTo(map);
                $('.controls').append(entry.controls.getElement());
                entry.controls.minimize();
            });

            s3TopicsWordCloud.controls.disable();
            s3TypesWordCloud.controls.disable();
            //label.controls.disable();
            esRings.controls.disable();
            //esPermitsHeatmap.controls.disable();
            s3CumulativeHeatmap.controls.disable();
            s3PermitsHeatmap.controls.disable();
            s3MinorityHeatmap.controls.disable();
            s3NonMinorityHeatmap.controls.disable();

        });
    };

}());
