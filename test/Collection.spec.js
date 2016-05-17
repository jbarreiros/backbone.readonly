var ReadOnly = require('../src/index');
var TestCollection = ReadOnly.Collection.extend({url: '/api', comparator: 'name'});

describe('ReadOnly.Collection', function() {
  var collection;
  var overrideOpts = {overrideImmutability: true};

  before(function() {
    collection = new TestCollection([{id: 1, name: 'John Doe'}]);
  });

  describe('when instantiating a new Collection', function() {
    it('should set the passed models', function() {
      var collection = new TestCollection([{id: 1, name: 'John Doe'}]);
      expect(collection.length).to.equal(1);
    });
  });

  describe('when using fetch()', function() {
    it('should not throw an exception', function() {
      var server = sinon.fakeServer.create();
      collection.fetch();
      server.respond([
        200,
        {'Content-Type': 'application/json'},
        JSON.stringify([{id: 1, name: 'John Doe'}])
      ]);
      expect(collection.length).to.equal(1);
      server.restore();
    });
  });

  describe('when using set()', function() {
    it('should throw exception by default', function() {
      expect(collection.set.bind(collection, [{id: 1, name: 'Johnathan Doe'}]))
        .to.throw(Error);
    });

    it('should not throw exception with override', function() {
      collection.set([{id: 1, name: 'Johnathan Doe'}], overrideOpts);
      expect(collection.length).to.equal(1);
    });
  });

  describe('when using remove()', function() {
    var model;

    before(function() {
      model = collection.get(1);
    });

    it('should throw exception by default', function() {
      expect(collection.remove.bind(collection, [model]))
        .to.throw(Error);
    });

    it('should not throw exception with override', function() {
      collection.remove(model, overrideOpts);
      expect(collection.length).to.equal(0);
    });
  });

  describe('when using reset()', function() {
    var models = [{id: 1, name: 'Jane Doe'}, {id: 2, name: 'Thomas Top'}];

    it('should throw exception by default', function() {
      expect(collection.reset.bind(collection, models))
        .to.throw(Error);
    });

    it('should not throw exception with override', function() {
      collection.reset(models, overrideOpts);
      expect(collection.length).to.equal(2);
    });
  });

  describe('when using create()', function() {
    var model = {id: 1, name: 'Jane Doe'};

    it('should throw exception by default', function() {
      expect(collection.create.bind(collection, model))
        .to.throw(Error);
    });

    it('should not throw exception with override', function() {
      collection.create(model, overrideOpts);
      expect(collection.length).to.equal(2);
    });
  });

  describe('when using non-mutating methods', function() {
    // We are only listing methods that do not call other methods or simply
    // returns a value.

    var methods = ['sort', 'clone'];
    methods.forEach(function(methodName) {
      it('should not throw exception for ' + methodName + '()', function() {
        expect(collection[methodName].bind(collection)).to.not.throw(Error);
      });
    });
  });

  describe('when extending ReadOnly.Collection', function() {
    it('should work with a custom Model', function() {
      var Model = Backbone.Model.extend({someRandomProp: 'success'});
      var Collection = TestCollection.extend({model: Model});
      var list = new Collection([{id: 1, name: 'John Doe'}]);

      expect(list.get(1).someRandomProp).to.equal('success');
    });
  });
});
