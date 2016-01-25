(function() {

    'use strict';

    var $ = require('jquery');
    var _ = require('lodash');

    $.ajaxTransport('+arraybuffer', function(options) {
        var xhr;
        return {
            send: function(headers, callback) {
                // setup all variables
                var url = options.url;
                var type = options.type;
                var async = options.async || true;
                var dataType = 'arraybuffer';
                var data = options.data || null;
                var username = options.username || null;
                var password = options.password || null;
                // create new XMLHttpRequest
                xhr = new XMLHttpRequest();
                xhr.addEventListener('load', function() {
                    var data = {};
                    data[options.dataType] = xhr.response;
                    // make callback and send data
                    callback(xhr.status, xhr.statusText, data, xhr.getAllResponseHeaders());
                });
                xhr.open(type, url, async, username, password);
                // setup custom headers
                _.forIn(headers, function(header, key) {
                    xhr.setRequestHeader(key, header);
                });
                xhr.responseType = dataType;
                xhr.send(data);
            },
            abort: function() {
                xhr.abort();
            }
        };
    });

    module.exports = $;

}());
