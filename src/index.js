var Backbone = require('backbone');
var ReadOnly = Backbone.ReadOnly = {
  Model: require('./Model'),
  Collection: require('./Collection')
};
module.exports = ReadOnly;
