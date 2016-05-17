var Backbone = require('backbone');
var _ = require('underscore');
var ReadOnlyModel = require('./Model');

/**
 * @name Collection~isNotImmutable
 * @private
 * @param {Object} options
 * @param {String} methodName
 * @return {Boolean}
 */
var isNotImmutable = function(options, methodName) {
  options = options || {};

  if (options.overrideImmutability !== true) {
    throw new Error(
      'Attempting to ' + methodName + ' a collection that is immutable. ' +
      'Please clone this for a mutable version.'
    );
  } else {
    return true;
  }
};

/**
 * A read-only Backbone Collection.
 *
 * When a collection is read-only, any number of components can read its models
 * and listen for change events. However, those components are not allowed to
 * mutate the collection.
 *
 * Important! A read-only collection is not fully immutable. The collection can
 * still call fetch() on itself. Additionally, if you go against best practices
 * and mutate Collection.models directly, this object will not prevent that.
 *
 * @constructor
 * @augments {Backbone.Collection}
 * @name Collection
 */
module.exports = Backbone.Collection.extend(
/** @lends Collection.prototype */
{
  /**
   * Overridden to pass the override option to allow setting the passed
   * models (if any).
   *
   * Additionally, if options.model is not provided, it will be set to an
   * instance of {@link lib/models/ReadOnlyModel}.
   *
   * @param {Array} models
   * @param {Object} options
   */
  constructor: function(models, options) {
    options = options || {};
    options.overrideImmutability = true;

    if (!('model' in this) && !options.model) {
      options.model = ReadOnlyModel;
    }

    Backbone.Collection.call(this, models, options);
  },

  /**
   * A read-only collection is allowed to fetch.
   *
   * @param {Object} options
   * @return {jQuery.Promise|Boolean}
   */
  fetch: function(options) {
    options = options || {};
    options.overrideImmutability = true;
    return Backbone.Collection.prototype.fetch.call(this, options);
  },

  /**
   * Prevents removing models.
   *
   * @param {Array} models
   * @param {Object} options
   * @return {Array}
   */
  remove: function(models, options) {
    if (isNotImmutable(options, 'remove')) {
      return Backbone.Collection.prototype.remove.apply(this, arguments);
    }
  },

  /**
   * Prevents adding/removing/updating models.
   *
   * @param {Array} models
   * @param {Object} options
   * @return {Array}
   */
  set: function(models, options) {
    if (isNotImmutable(options, 'set')) {
      return Backbone.Collection.prototype.set.apply(this, arguments);
    }
  },

  /**
   * Prevents reseting collection.
   *
   * @param {Array} models
   * @param {Object} options
   * @return {Array}
   */
  reset: function(models, options) {
    if (isNotImmutable(options, 'reset')) {
      return Backbone.Collection.prototype.reset.apply(this, arguments);
    }
  },

  /**
   * Prevents creating (adding) a model to the collection.
   *
   * @param {Object|Backbone.Model} model
   * @param {Object} options
   * @return {Backbone.Model}
   */
  create: function(model, options) {
    if (isNotImmutable(options, 'create')) {
      return Backbone.Collection.prototype.create.apply(this, arguments);
    }
  },
});
