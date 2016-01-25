(function() {

    'use strict';

    var $ = require('jquery');
    require('../util/jQueryAjaxArrayBuffer');

    var Config = require('../../config');
    var TileLayer = require('./TileLayer');

    var AJAX_TIMEOUT = 20000;

    function buildRequest(type, index, coord, params) {
        return {
            tile: {
                type: type,
                endpoint: Config.ES_ENDPOINT,
                index: index,
                coord: coord,
                params: params
            },
            store: {
                type: Config.REDIS_STORE,
                endpoint: Config.REDIS_ENDPOINT
            }
        };
    }

    function liveRequest(requester, type, index, pendingLayer) {
        return function(coord, done) {
            if (pendingLayer) {
                // flag tile as pending
                pendingLayer.increment(coord);
            }
            var params = this.getParams();
            var req = buildRequest(type, index, coord, params);
            requester
                .get(req)
                .done(function(url) {
                    $.ajax({
                        url: url,
                        dataType: (type === 'heatmap') ? 'arraybuffer' : 'json',
                        timeout: AJAX_TIMEOUT
                    }).done(function(buffer) {
                        done(buffer);
                    }).fail(function() {
                        done(null);
                    }).always(function() {
                        if (pendingLayer) {
                            // flag tile as no longer pending
                            pendingLayer.decrement(coord);
                        }
                    });
                })
                .fail(function() {
                    console.error('Could not generate tile.');
                    if (pendingLayer) {
                        // flag tile as no longer pending
                        pendingLayer.decrement(coord);
                    }
                    done(null);
                });
        };
    }

    function staticRequest(type, ext, pendingLayer) {
        return function(coord, done) {
            if (pendingLayer) {
                // flag tile as pending
                pendingLayer.increment(coord);
            }
            $.ajax({
                url: Config.S3_BUCKET + '/' + type + '/' + coord.z + '/' + coord.x + '/' + coord.y + ext,
                dataType: (ext === '.bin') ? 'arraybuffer' : 'json',
                timeout: AJAX_TIMEOUT
            }).done(function(buffer) {
                done(buffer);
            }).fail(function() {
                done(null);
            }).always(function() {
                if (pendingLayer) {
                    // flag tile as no longer pending
                    pendingLayer.decrement(coord);
                }
            });
        };
    }

    module.exports = {
        base: function() {
            return new TileLayer.Image('http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', {
                attribution: 'CartoDB'
            });
        },
        label: function() {
            var layer = new TileLayer.Image('http://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png');
            layer.setOpacity(0.6);
            return layer;
        },
        pending: function() {
            return new TileLayer.Pending.Spin();
        },
        s3CumulativeHeatmap: function(pending) {
            var layer = new TileLayer.Canvas.Heatmap(null, {
                unloadInvisibleTiles: true
            });
            layer.setOpacity(0.8);
            layer.setColorRamp('spectral');
            layer.requestTile = staticRequest(
                'census-hackathon-2016/cumulative-amounts',
                '.bin',
                pending);
            return layer;
        },
        s3MinorityHeatmap: function(pending) {
            var layer = new TileLayer.Canvas.Heatmap(null, {
                unloadInvisibleTiles: true
            });
            layer.setOpacity(0.8);
            layer.setColorRamp('hot');
            layer.requestTile = staticRequest(
                'census-hackathon-2016/minority-permits',
                '.bin',
                pending);
            return layer;
        },
        s3NonMinorityHeatmap: function(pending) {
            var layer = new TileLayer.Canvas.Heatmap(null, {
                unloadInvisibleTiles: true
            });
            layer.setOpacity(0.8);
            layer.setColorRamp('cold');
            layer.requestTile = staticRequest(
                'census-hackathon-2016/non-minority-permits',
                '.bin',
                pending);
            return layer;
        },
        s3PermitsHeatmap: function(pending) {
            var layer = new TileLayer.Canvas.Heatmap(null, {
                unloadInvisibleTiles: true
            });
            layer.setOpacity(0.8);
            layer.setColorRamp('spectral');
            layer.requestTile = staticRequest(
                'census-hackathon-2016/permits',
                '.bin',
                pending);
            return layer;
        },
        s3TopicsWordCloud: function(pending) {
            var layer = new TileLayer.HTML.WordCloud(null, {
                unloadInvisibleTiles: true
            });
            layer.requestTile = staticRequest(
                'census-hackathon-2016/topics-word-cloud',
                '.json',
                pending);
            return layer;
        },
        s3TypesWordCloud: function(pending) {
            var layer = new TileLayer.HTML.WordCloud(null, {
                unloadInvisibleTiles: true
            });
            layer.requestTile = staticRequest(
                'census-hackathon-2016/types-word-cloud',
                '.json',
                pending);
            return layer;
        },
        esWordCloud: function(meta, index, field, topics, requester, pending) {
            var layer = new TileLayer.HTML.WordCloud(meta, {
                unloadInvisibleTiles: true
            });
            layer.setTopicField(field);
            layer.setTopics(topics);
            layer.requestTile = liveRequest(
                requester,
                'topiccount',
                index,
                pending);
            return layer;
        },
        esHeatmap: function(meta, index, requester, pending) {
            var layer = new TileLayer.Canvas.Heatmap(meta, {
                unloadInvisibleTiles: true
            });
            layer.setOpacity(0.8);
            layer.setColorRamp('spectral');
            layer.requestTile = liveRequest(
                requester,
                'heatmap',
                index,
                pending);
            return layer;
        },
        esTopicRings: function(meta, index, field, topics, requester, pending) {
            var layer = new TileLayer.HTML.Ring(meta, {
                unloadInvisibleTiles: true
            });
            layer.setTopicField(field);
            layer.setTopics(topics);
            layer.setResolution(8);
            layer.requestTile = liveRequest(
                requester,
                'heatmap',
                index,
                pending);
            return layer;
        }
    };

}());
