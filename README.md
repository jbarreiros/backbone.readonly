# Backbone.ReadOnly

A [Backbone](http://backbonejs.com) plugin for creating read-only models and collections.

When a model or collection is read-only:
* Any number of components can share an instance of it, but will be unable to make changes to it. For models, this means not being able to change its attributes. For collections, it means not be able to add or remove models.
* The `fetch()` method is still available on both models and collections.
* Attempting to call `Model.set()`, `Collection.add`, etc. will result in an exception being thrown (i.e. [fail loudly](https://en.wikipedia.org/wiki/Fail-fast)).

Lastly, this plugin takes a **simplicity** over *thorough* approach. I didn't
try to plug every hole. For example, this plugin does nothing to stop access to
`Backbone.Model.attributes`.

# Installation

The plugin is built as a Node.js module and bundled for the browser with Browserify. When using the plugin via the browser, it expects that JQuery, Underscore and Backbone are already available; they are not bundled with the plugin.

**NPM**
```
npm install backbone.readonly --save
```

**Bower**
```
bower install backbone.readonly --save
```

# Example
```
// If using as a global module (i.e. <script src="backbone.readonly.js"></script>),
// replace "ReadOnly" below with "Backbone.ReadOnly".

// If using as a node module, browserify or AMD,
var ReadOnly = require('backbone.readonly');

//
// Sample Model usage
//

var person = new ReadOnly.Model({id: 1, name: 'Jane Doe'});
person.set('name', 'Janice Doe'); //throws exception

person.on('change', function() {
    //update UI, etc.
});

person.fetch(); //still works

//
// Sample Collection usage
//

var people = new ReadOnly.Collection([person]);
people.add([{id: 2, name: 'John Doe'}]); //throws exception

people.on('update', function() {
    //update UI, etc.
});

people.fetch(); //still works

// When creating a read-only collection, unless otherwise specified, models will
// be an instance of ReadOnly.Model, which helps with:

var active = people.get(1);
active.set('isLoggedIn', true); // fail, clone the model first
```
