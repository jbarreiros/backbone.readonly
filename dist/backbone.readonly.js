(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.Backbone || (g.Backbone = {})).ReadOnly = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);
var ReadOnlyModel = require('./Model');

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

module.exports = Backbone.Collection.extend({
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

    if (!options.model) {
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
    if (_.isEmpty(models)) {
      return [];
    }

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
    if (_.isEmpty(models)) {
      return [];
    }

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
    if (_.isEmpty(models)) {
      return [];
    }

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
    if (_.isEmpty(model)) {
      return;
    }

    if (isNotImmutable(options, 'create')) {
      return Backbone.Collection.prototype.create.apply(this, arguments);
    }
  },
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./Model":2}],2:[function(require,module,exports){
(function (global){
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var _ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

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

module.exports = Backbone.Model.extend({
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],3:[function(require,module,exports){
(function (global){
var Backbone = (typeof window !== "undefined" ? window['Backbone'] : typeof global !== "undefined" ? global['Backbone'] : null);
var ReadOnly = Backbone.ReadOnly = {
  Model: require('./Model'),
  Collection: require('./Collection')
};
module.exports = ReadOnly;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./Collection":1,"./Model":2}]},{},[2,3])(3)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQ29sbGVjdGlvbi5qcyIsInNyYy9Nb2RlbC5qcyIsInNyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDdkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgQmFja2JvbmUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snQmFja2JvbmUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ0JhY2tib25lJ10gOiBudWxsKTtcbnZhciBfID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ18nXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ18nXSA6IG51bGwpO1xudmFyIFJlYWRPbmx5TW9kZWwgPSByZXF1aXJlKCcuL01vZGVsJyk7XG5cbnZhciBpc05vdEltbXV0YWJsZSA9IGZ1bmN0aW9uKG9wdGlvbnMsIG1ldGhvZE5hbWUpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgaWYgKG9wdGlvbnMub3ZlcnJpZGVJbW11dGFiaWxpdHkgIT09IHRydWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnQXR0ZW1wdGluZyB0byAnICsgbWV0aG9kTmFtZSArICcgYSBjb2xsZWN0aW9uIHRoYXQgaXMgaW1tdXRhYmxlLiAnICtcbiAgICAgICdQbGVhc2UgY2xvbmUgdGhpcyBmb3IgYSBtdXRhYmxlIHZlcnNpb24uJ1xuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQmFja2JvbmUuQ29sbGVjdGlvbi5leHRlbmQoe1xuICAvKipcbiAgICogT3ZlcnJpZGRlbiB0byBwYXNzIHRoZSBvdmVycmlkZSBvcHRpb24gdG8gYWxsb3cgc2V0dGluZyB0aGUgcGFzc2VkXG4gICAqIG1vZGVscyAoaWYgYW55KS5cbiAgICpcbiAgICogQWRkaXRpb25hbGx5LCBpZiBvcHRpb25zLm1vZGVsIGlzIG5vdCBwcm92aWRlZCwgaXQgd2lsbCBiZSBzZXQgdG8gYW5cbiAgICogaW5zdGFuY2Ugb2Yge0BsaW5rIGxpYi9tb2RlbHMvUmVhZE9ubHlNb2RlbH0uXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl9IG1vZGVsc1xuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKi9cbiAgY29uc3RydWN0b3I6IGZ1bmN0aW9uKG1vZGVscywgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIG9wdGlvbnMub3ZlcnJpZGVJbW11dGFiaWxpdHkgPSB0cnVlO1xuXG4gICAgaWYgKCFvcHRpb25zLm1vZGVsKSB7XG4gICAgICBvcHRpb25zLm1vZGVsID0gUmVhZE9ubHlNb2RlbDtcbiAgICB9XG5cbiAgICBCYWNrYm9uZS5Db2xsZWN0aW9uLmNhbGwodGhpcywgbW9kZWxzLCBvcHRpb25zKTtcbiAgfSxcblxuICAvKipcbiAgICogQSByZWFkLW9ubHkgY29sbGVjdGlvbiBpcyBhbGxvd2VkIHRvIGZldGNoLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKiBAcmV0dXJuIHtqUXVlcnkuUHJvbWlzZXxCb29sZWFufVxuICAgKi9cbiAgZmV0Y2g6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBvcHRpb25zLm92ZXJyaWRlSW1tdXRhYmlsaXR5ID0gdHJ1ZTtcbiAgICByZXR1cm4gQmFja2JvbmUuQ29sbGVjdGlvbi5wcm90b3R5cGUuZmV0Y2guY2FsbCh0aGlzLCBvcHRpb25zKTtcbiAgfSxcblxuICAvKipcbiAgICogUHJldmVudHMgcmVtb3ZpbmcgbW9kZWxzLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fSBtb2RlbHNcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICogQHJldHVybiB7QXJyYXl9XG4gICAqL1xuICByZW1vdmU6IGZ1bmN0aW9uKG1vZGVscywgb3B0aW9ucykge1xuICAgIGlmIChfLmlzRW1wdHkobW9kZWxzKSkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGlmIChpc05vdEltbXV0YWJsZShvcHRpb25zLCAncmVtb3ZlJykpIHtcbiAgICAgIHJldHVybiBCYWNrYm9uZS5Db2xsZWN0aW9uLnByb3RvdHlwZS5yZW1vdmUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFByZXZlbnRzIGFkZGluZy9yZW1vdmluZy91cGRhdGluZyBtb2RlbHMuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJyYXl9IG1vZGVsc1xuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICovXG4gIHNldDogZnVuY3Rpb24obW9kZWxzLCBvcHRpb25zKSB7XG4gICAgaWYgKF8uaXNFbXB0eShtb2RlbHMpKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgaWYgKGlzTm90SW1tdXRhYmxlKG9wdGlvbnMsICdzZXQnKSkge1xuICAgICAgcmV0dXJuIEJhY2tib25lLkNvbGxlY3Rpb24ucHJvdG90eXBlLnNldC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogUHJldmVudHMgcmVzZXRpbmcgY29sbGVjdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheX0gbW9kZWxzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqIEByZXR1cm4ge0FycmF5fVxuICAgKi9cbiAgcmVzZXQ6IGZ1bmN0aW9uKG1vZGVscywgb3B0aW9ucykge1xuICAgIGlmIChfLmlzRW1wdHkobW9kZWxzKSkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGlmIChpc05vdEltbXV0YWJsZShvcHRpb25zLCAncmVzZXQnKSkge1xuICAgICAgcmV0dXJuIEJhY2tib25lLkNvbGxlY3Rpb24ucHJvdG90eXBlLnJlc2V0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBQcmV2ZW50cyBjcmVhdGluZyAoYWRkaW5nKSBhIG1vZGVsIHRvIHRoZSBjb2xsZWN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdHxCYWNrYm9uZS5Nb2RlbH0gbW9kZWxcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICogQHJldHVybiB7QmFja2JvbmUuTW9kZWx9XG4gICAqL1xuICBjcmVhdGU6IGZ1bmN0aW9uKG1vZGVsLCBvcHRpb25zKSB7XG4gICAgaWYgKF8uaXNFbXB0eShtb2RlbCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoaXNOb3RJbW11dGFibGUob3B0aW9ucywgJ2NyZWF0ZScpKSB7XG4gICAgICByZXR1cm4gQmFja2JvbmUuQ29sbGVjdGlvbi5wcm90b3R5cGUuY3JlYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9LFxufSk7XG4iLCJ2YXIgQmFja2JvbmUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snQmFja2JvbmUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ0JhY2tib25lJ10gOiBudWxsKTtcbnZhciBfID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ18nXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ18nXSA6IG51bGwpO1xuXG52YXIgaXNOb3RJbW11dGFibGUgPSBmdW5jdGlvbihvcHRpb25zLCBtZXRob2ROYW1lKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIGlmIChvcHRpb25zLm92ZXJyaWRlSW1tdXRhYmlsaXR5ICE9PSB0cnVlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ0F0dGVtcHRpbmcgdG8gJyArIG1ldGhvZE5hbWUgKyAnIGEgbW9kZWwgdGhhdCBpcyBpbW11dGFibGUuICcgK1xuICAgICAgJ1BsZWFzZSBjbG9uZSB0aGlzIGZvciBhIG11dGFibGUgdmVyc2lvbi4nXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYWNrYm9uZS5Nb2RlbC5leHRlbmQoe1xuICAvKipcbiAgICogT3ZlcnJpZGRlbiB0byBwYXNzIHRoZSBvdmVycmlkZSBvcHRpb24gdG8gYWxsb3cgc2V0dGluZyB0aGUgcGFzc2VkXG4gICAqIGF0dHJpYnV0ZXMgKGlmIGFueSkuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhdHRyaWJ1dGVzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqL1xuICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24oYXR0cmlidXRlcywgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIG9wdGlvbnMub3ZlcnJpZGVJbW11dGFiaWxpdHkgPSB0cnVlO1xuICAgIEJhY2tib25lLk1vZGVsLmNhbGwodGhpcywgYXR0cmlidXRlcywgb3B0aW9ucyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEFsbCBCYWNrYm9uZS5Nb2RlbCBtZXRob2RzIHRoYXQgbXV0YXRlIE1vZGVsLmF0dHJpYnV0ZXMgdXNlIHNldCgpLCB3aGljaFxuICAgKiBzaW1wbGlmaWVzIHRoaW5ncy4gV2UgcmVhbGx5IG9ubHkgbmVlZCB0byBvdmVycmlkZSB0aGlzIG1ldGhvZCB0byBwcmV2ZW50XG4gICAqIG11dGF0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdHxTdHJpbmd9IGtleVxuICAgKiBAcGFyYW0ge09iamVjdHxTdHJpbmd9IHZhbFxuICAgKiBAcGFyYW0ge09iamVjdHx1bmRlZmluZWR9IG9wdGlvbnNcbiAgICovXG4gIHNldDogZnVuY3Rpb24oa2V5LCB2YWwsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAgIGlmIChfLmlzRW1wdHkoa2V5KSkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLy8gQmFja2JvbmUgYWxsb3dzIGZvciBzZXQoe30pIG9yIHNldCgnJywgJycpLCBzbyB0aGUgZm9sbG93aW5nIGVuc3VyZXNcbiAgICAvLyB3ZSBncmFiIHRoZSBjb3JyZWN0IHBhcmFtZXRlciByZXByZXNlbnRpbmcgXCJvcHRpb25zXCIuXG4gICAgaWYgKHR5cGVvZiBrZXkgPT09ICdvYmplY3QnKSB7XG4gICAgICBvcHRpb25zID0gdmFsIHx8IHt9O1xuICAgIH1cblxuICAgIGlmIChpc05vdEltbXV0YWJsZShvcHRpb25zLCAnc2V0JykpIHtcbiAgICAgIHJldHVybiBCYWNrYm9uZS5Nb2RlbC5wcm90b3R5cGUuc2V0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBBIHJlYWQtb25seSBtb2RlbCBpcyBhbGxvd2VkIHRvIGZldGNoLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKiBAcmV0dXJuIHtqUXVlcnkuUHJvbWlzZXxCb29sZWFufVxuICAgKi9cbiAgZmV0Y2g6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBvcHRpb25zLm92ZXJyaWRlSW1tdXRhYmlsaXR5ID0gdHJ1ZTtcbiAgICByZXR1cm4gQmFja2JvbmUuTW9kZWwucHJvdG90eXBlLmZldGNoLmNhbGwodGhpcywgb3B0aW9ucyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFByZXZlbnQgZGVzdHJveWluZyB0aGUgbW9kZWwuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqIEByZXR1cm4ge2pRdWVyeS5Qcm9taXNlfVxuICAgKi9cbiAgZGVzdHJveTogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIGlmIChpc05vdEltbXV0YWJsZShvcHRpb25zLCAnZGVzdHJveScpKSB7XG4gICAgICByZXR1cm4gQmFja2JvbmUuTW9kZWwucHJvdG90eXBlLmNsZWFyLmNhbGwodGhpcywgb3B0aW9ucyk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBQcmV2ZW50IGNsZWFyaW5nIHRoZSBtb2RlbC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICogQHJldHVybiB7QmFja2JvbmUuTW9kZWx9XG4gICAqL1xuICBjbGVhcjogZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIGlmIChpc05vdEltbXV0YWJsZShvcHRpb25zLCAnY2xlYXInKSkge1xuICAgICAgcmV0dXJuIEJhY2tib25lLk1vZGVsLnByb3RvdHlwZS5jbGVhci5jYWxsKHRoaXMsIG9wdGlvbnMpO1xuICAgIH1cbiAgfSxcbn0pO1xuIiwidmFyIEJhY2tib25lID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ0JhY2tib25lJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydCYWNrYm9uZSddIDogbnVsbCk7XG52YXIgUmVhZE9ubHkgPSBCYWNrYm9uZS5SZWFkT25seSA9IHtcbiAgTW9kZWw6IHJlcXVpcmUoJy4vTW9kZWwnKSxcbiAgQ29sbGVjdGlvbjogcmVxdWlyZSgnLi9Db2xsZWN0aW9uJylcbn07XG5tb2R1bGUuZXhwb3J0cyA9IFJlYWRPbmx5O1xuIl19
