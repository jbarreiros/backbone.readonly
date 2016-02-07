var Backbone = require('backbone');
var _ = require('underscore');

/**
 * @method Model~isNotImmutable
 * @private
 * @param {Object} options
 * @param {String} methodName
 * @return {Boolean}
 */
var isNotImmutable = function(options, methodName) {
  options = options || {};

  if (options.overrideImmutability !== true) {
    throw new Error(
      'Attempting to ' + methodName + ' a model that is immutable. ' +
      'Please clone this for a mutable version.'
    );
  } else {
    return true;
  }
};

/**
 * A read-only Backbone model.
 *
 * When a model is read-only, any number of components can read its attributes
 * and listen for change events. However, those components are not allowed to
 * mutate its attributes.
 *
 * Important! A read-only model is not fully immutable. The model can still
 * call fetch() on itself. Additionally, if you go against best practices and
 * mutate Model.attributes directly, this object will not prevent that.
 *
 * To achieve "read-only", I wanted to keep the logic as lightweight as
 * possible and not be too tricky; including not overriding every method.
 * Luckily, Backbone does a really good job of ensuring that "option" hashes
 * are passed down between function calls. That is ultimately how we achieve
 * read-only. Very backbone!
 *
 * @constructor
 * @augments {Backbone.Model}
 * @name Model
 */
module.exports = Backbone.Model.extend(
/** @lends Model.prototype */
{
  /**
   * Overridden to pass the override option to allow setting the passed
   * attributes (if any).
   *
   * @param {Object} attributes
   * @param {Object} options
   */
  constructor: function(attributes, options) {
    options = options || {};
    options.overrideImmutability = true;
    Backbone.Model.call(this, attributes, options);
  },

  /**
   * All Backbone.Model methods that mutate Model.attributes use set(), which
   * simplifies things. We really only need to override this method to prevent
   * mutation.
   *
   * @param {Object|String} key
   * @param {Object|String} val
   * @param {Object|undefined} options
   */
  set: function(key, val, options) {
    options = options || {};

    if (_.isEmpty(key)) {
      return this;
    }

    // Backbone allows for set({}) or set('', ''), so the following ensures
    // we grab the correct parameter representing "options".
    if (typeof key === 'object') {
      options = val || {};
    }

    if (isNotImmutable(options, 'set')) {
      return Backbone.Model.prototype.set.apply(this, arguments);
    }
  },

  /**
   * A read-only model is allowed to fetch.
   *
   * @param {Object} options
   * @return {jQuery.Promise|Boolean}
   */
  fetch: function(options) {
    options = options || {};
    options.overrideImmutability = true;
    return Backbone.Model.prototype.fetch.call(this, options);
  },

  /**
   * Prevent destroying the model.
   *
   * @param {Object} options
   * @return {jQuery.Promise}
   */
  destroy: function(options) {
    if (isNotImmutable(options, 'destroy')) {
      return Backbone.Model.prototype.clear.call(this, options);
    }
  },

  /**
   * Prevent clearing the model.
   *
   * @param {Object} options
   * @return {Backbone.Model}
   */
  clear: function(options) {
    if (isNotImmutable(options, 'clear')) {
      return Backbone.Model.prototype.clear.call(this, options);
    }
  },
});
