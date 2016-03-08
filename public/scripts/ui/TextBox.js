(function() {
    'use strict';

    var TextBox = function(spec) {
        var self = this;
        // parse inputs
        spec = spec || {};
        spec.label = spec.label !== undefined ? spec.label : 'missing-label';
        spec.initialValue = spec.initialValue !== undefined ? spec.initialValue : '';
        this.change = spec.change || null;
        this.submit = spec.submit || null;
        this.submittedValue = spec.initialValue;
        // create elements
        this._$container = $(Templates.textbox(spec));
        this._$submitButton = this._$container.find('.textbox-button');
        this._$textBox = this._$container.find('.textbox-field');

        // create and attach callbacks
        // enter key
        this._$textBox.keydown(function(event) {
            if (event.keyCode === 13) {
                // do something
                if (self.submit) {
                    self.submit(self._$textBox.val());
                }
                self._$submitButton.removeClass('is-dirty');
                self.submittedValue = self._$textBox.val();
            }
        });
        // letter up
        this._$textBox.keyup(function() {
            if (self.change) {
                self.change(self._$textBox.val());
            }
            if ( self._$textBox.val() !== self.submittedValue ) {
                self._$submitButton.addClass('is-dirty');
            } else {
                self._$submitButton.removeClass('is-dirty');
            }
        });
        // click button
        this._$submitButton.click(function() {
            if (self.submit) {
                self.submit(self._$textBox.val());
            }
            self._$submitButton.removeClass('is-dirty');
            self.submittedValue = self._$textBox.val();
        });
    };

    TextBox.prototype.getElement = function() {
        return this._$container;
    };

    module.exports = TextBox;

}());
