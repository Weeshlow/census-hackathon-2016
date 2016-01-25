(function() {

    'use strict';

    var $ = require('jquery');
    var _ = require('lodash');
    var Requestor = require('./Requestor');

    function TileRequester() {
        Requestor.apply(this, arguments);
    }

    TileRequester.prototype = Object.create(Requestor.prototype);

    TileRequester.prototype.getHash = function(req) {
        var tile = req.tile;
        var coord = tile.coord;
        var store = req.store;
        var params = [];
        _.forIn(tile.params, function(val, key) {
            if (val !== undefined && val !== null) {
                params.push(key.toLowerCase() + '=' + val);
            }
        });
        params.sort(function(a, b) {
            return (a < b) ? -1 : (a > b) ? 1 : 0;
        });
        return tile.type + '-' +
            tile.endpoint + '-' +
            tile.index + '-' +
            store.type + '-' +
            store.endpoint + '-' +
            coord.x + '-' +
            coord.y + '-' +
            coord.z + '-' +
            params.join('-');
    };

    TileRequester.prototype.getURL = function(res) {
        var tile = res.tile;
        var coord = tile.coord;
        var params = tile.params;
        var store = res.store;
        return 'tile/' +
            tile.type + '/' +
            tile.endpoint + '/' +
            tile.index + '/' +
            store.type + '/' +
            store.endpoint + '/' +
            coord.z + '/' +
            coord.x + '/' +
            coord.y +
            ((_.keys(params).length > 0) ? ('?' + $.param(params)) : '');
    };

    module.exports = TileRequester;

}());
