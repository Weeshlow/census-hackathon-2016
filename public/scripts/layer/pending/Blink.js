(function() {

    'use strict';

    var $ = require('jquery');
    var Pending = require('../core/Pending');

    var Blink = Pending.extend({

        renderTile: function(elem) {
            $(elem).addClass('blinking');
            elem.styles['animation-delay'] = -(Math.random() * 1200) + 'ms';
        }

    });

    module.exports = Blink;

}());
