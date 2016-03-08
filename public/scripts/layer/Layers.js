(function() {

    'use strict';

    var $ = require('../util/jQueryAjaxArraybuffer');
    var Config = require('../../config');

    var AJAX_TIMEOUT = 20000;

    function buildRequest(type, index, coord, params) {
        return {
            type: type,
            index: index,
            store: Config.REDIS_STORE,
            coord: coord,
            params: params
        };
    }

    function liveRequest(requestor, type, index, pendingLayer) {
        return function(coord, done) {
            if (pendingLayer) {
                // flag tile as pending
                pendingLayer.increment(coord);
            }
            var params = this.getParams();
            var req = buildRequest(type, index, coord, params);
            requestor
                .get(req)
                .done(function(url) {
                    $.ajax({
                        url: url,
                        method: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(params),
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
            return new prism.TileLayer.Image('http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', {
                attribution: 'CartoDB'
            });
        },
        label: function() {
            var layer = new prism.TileLayer.Image('http://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png');
            layer.setOpacity(0.6);
            return layer;
        },
        pending: function() {
            return new prism.TileLayer.Pending.Spin();
        },
        s3CumulativeHeatmap: function(pending) {
            var layer = new prism.TileLayer.Heatmap(null, {
                unloadInvisibleTiles: true,
                rendererClass: prism.Renderer.Canvas.Heatmap
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
            var layer = new prism.TileLayer.Heatmap(null, {
                unloadInvisibleTiles: true,
                rendererClass: prism.Renderer.Canvas.Heatmap
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
            var layer = new prism.TileLayer.Heatmap(null, {
                unloadInvisibleTiles: true,
                rendererClass: prism.Renderer.Canvas.Heatmap
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
            var layer = new prism.TileLayer.Heatmap(null, {
                unloadInvisibleTiles: true,
                rendererClass: prism.Renderer.Canvas.Heatmap
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
            var layer = new prism.TileLayer.TopicCount(null, {
                unloadInvisibleTiles: true,
                rendererClass: prism.Renderer.HTML.WordCloud
            });
            layer.requestTile = staticRequest(
                'census-hackathon-2016/topics-word-cloud',
                '.json',
                pending);
            return layer;
        },
        s3TypesWordCloud: function(pending) {
            var layer = new prism.TileLayer.TopicCount(null, {
                unloadInvisibleTiles: true,
                rendererClass: prism.Renderer.HTML.WordCloud
            });
            layer.requestTile = staticRequest(
                'census-hackathon-2016/types-word-cloud',
                '.json',
                pending);
            return layer;
        },
        esWordCloud: function(meta, index, field, topics, requester, pending) {
            var layer = new prism.TileLayer.TopicCount(meta, {
                unloadInvisibleTiles: true,
                rendererClass: prism.Renderer.HTML.WordCloud
            });
            layer.setTermsAgg(field, topics);
            layer.requestTile = liveRequest(
                requester,
                'topic_count',
                index,
                pending);
            return layer;
        },
        esHeatmap: function(meta, index, requester, pending) {
            var layer = new prism.TileLayer.Heatmap(meta, {
                unloadInvisibleTiles: true,
                rendererClass: prism.Renderer.Canvas.Heatmap
            });
            layer.setOpacity(0.8);
            layer.addRange('timestamp', meta.timestamp.extrema.min, meta.timestamp.extrema.max);
            layer.setColorRamp('spectral');
            layer.requestTile = liveRequest(
                requester,
                'heatmap',
                index,
                pending);
            return layer;
        },
        esTopicRings: function(meta, index, field, topics, requester, pending) {
            var layer = new prism.TileLayer.Heatmap(meta, {
                unloadInvisibleTiles: true,
                rendererClass: prism.Renderer.HTML.Ring
            });
            layer.addTermsFilter(field, topics);
            layer.addRange('timestamp', meta.timestamp.extrema.min, meta.timestamp.extrema.max);
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
