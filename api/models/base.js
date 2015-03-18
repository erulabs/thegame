'use strict';

/**
 * Represents the base model functionality
 * @constructor
 */
const BaseModel = {
  /**
   * @description
   * Extends a class with functionality from the "model" object below
   * @returns {undefined}
   */
  _extend: function (input) {
    let self = this;
    for (let prop in self.model) {
      if (self.model.hasOwnProperty(prop)) {
        input.prototype[prop] = self.model[prop];
      }
    }
  },
  model: {
    /**
     * @description
     * Saves the model to the datastore
     * @returns {Promise}
     */
    save: function () {
      console.log(this.username);
    }
  }
};

module.exports = BaseModel;
