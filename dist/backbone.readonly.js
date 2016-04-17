(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("backbone"), require("underscore"));
	else if(typeof define === 'function' && define.amd)
		define(["backbone", "underscore"], factory);
	else if(typeof exports === 'object')
		exports["backbone.readonly"] = factory(require("backbone"), require("underscore"));
	else
		root["backbone.readonly"] = factory(root["Backbone"], root["_"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Backbone = __webpack_require__(1);
	var ReadOnly = Backbone.ReadOnly = {
	  Model: __webpack_require__(2),
	  Collection: __webpack_require__(4)
	};
	module.exports = ReadOnly;


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Backbone = __webpack_require__(1);
	var _ = __webpack_require__(3);

	/**
	 * @name Model~isNotImmutable
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


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Backbone = __webpack_require__(1);
	var ReadOnlyModel = __webpack_require__(2);

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


/***/ }
/******/ ])
});
;