(function() {

    'use strict';

    var Requestor = require('./Requestor');

    function MetaRequester() {
        Requestor.apply(this, arguments);
    }

    MetaRequester.prototype = Object.create(Requestor.prototype);

    MetaRequester.prototype.getHash = function(req) {
        var meta = req.meta;
        var store = req.store;
        return meta.type + '-' +
            meta.endpoint + '-' +
            meta.index + '-' +
            store.type + '-' +
            store.endpoint;
    };

    MetaRequester.prototype.getURL = function(res) {
        var meta = res.meta;
        var store = res.store;
        return 'meta/' +
            meta.type + '/' +
            meta.endpoint + '/' +
            meta.index + '/' +
            store.type + '/' +
            store.endpoint;
    };

    module.exports = MetaRequester;

}());
