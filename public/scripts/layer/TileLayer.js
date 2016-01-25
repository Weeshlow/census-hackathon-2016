(function() {

    'use strict';

    // pending tile layer
    var Pending = require('./core/Pending');
    Pending.Blink = require('./pending/Blink');
    Pending.Spin = require('./pending/Spin');

    // standard XYZ / TMX image layer
    var Image = require('./core/Image');

    // html tile layer
    var HTML = require('./core/HTML');
    HTML.WordCloud = require('./html/WordCloud');
    HTML.TopicFrequency = require('./html/TopicFrequency');
    HTML.Ring = require('./html/Ring');

    // canvas tile layer
    var Canvas = require('./core/Canvas');
    Canvas.Heatmap = require('./canvas/Heatmap');

    // webgl tile layer
    var WebGL = require('./core/WebGL');
    WebGL.Heatmap = require('./webgl/Heatmap');

    module.exports = {
        Pending: Pending,
        Image: Image,
        HTML: HTML,
        Canvas: Canvas,
        WebGL: WebGL
    };

}());
