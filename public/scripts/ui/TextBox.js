(function() {
    'use strict';

    var $ = require('jquery');

    var TextBox = function(spec) {
        var self = this;
        // parse inputs
        spec = spec || {};
        spec.label = spec.label !== undefined ? spec.label : 'missing-label';
        spec.initialValue = spec.initialValue !== undefined ? spec.initialValue : '';
        this.change = spec.change || null;
        this.submit = spec.submit || null;
        // create elements
        this._$container = $(Templates.textbox(spec));
        this._$submitButton = this._$container.find('.textbox-button');
        this._$textBox = this._$container.find('.textbox-field');
        // create and attach callbacks
        this._$textBox.keydown(function(event) {
            if (event.keyCode === 13) {
                // do something
                if (self.submit) {
                    self.submit(self._$textBox.val());
                }

            } else {
                if (self.change) {
                    self.change(self._$textBox.val());
                }
            }
        });
        //
        this._$submitButton.click(function() {
            if (self.submit) {
                self.submit(self._$textBox.val());
            }
        });
    };

    TextBox.prototype.getElement = function() {
        return this._$container;
    };

    module.exports = TextBox;

}());
