var ReadOnly = require('../src/index');
var TestModel = ReadOnly.Model.extend({url: '/api'});

describe('ReadOnly.Model', function() {
  var model;
  var overrideOpts = {overrideImmutability: true};

  before(function() {
    model = new TestModel();
  });

  describe('when instantiating a new Model', function() {
    it('should set the passed attributes', function() {
      var model = new ReadOnly.Model({id: 1, name: 'John Doe'});
      expect(model.id).to.equal(1);
    });
  });

  describe('when using set()', function() {
    it('should throw exception by default', function() {
      expect(model.set.bind(model, 'name', 'Jonathan Doe')).to.throw(Error);
    });

    it('should not throw exception with override', function() {
      model.set('name', 'Jonathan Doe', overrideOpts);
      expect(model.hasChanged('name')).to.be.true;
    });
  });

  describe('when using unset()', function() {
    it('should throw exception by default', function() {
      expect(model.unset.bind(model, 'name')).to.throw(Error);
    });

    it('should not throw exception with override', function() {
      model.unset('name', overrideOpts);
      expect(model.has('name')).to.be.false;
    });
  });

  describe('when using clear()', function() {
    it('should throw exception by default', function() {
      expect(model.clear.bind(model)).to.throw(Error);
    });

    it('should not throw exception with override', function() {
      model.clear(overrideOpts);
      expect(model.has('name')).to.be.false;
    });
  });

  describe('when using the CRUD method', function() {
    var server;

    beforeEach(function() {
      server = sinon.fakeServer.create();
      model = new TestModel({id: 1, name: 'John Doe'});
    });

    afterEach(function() {
      server.restore();
    });

    describe('fetch()', function() {
      it('should not throw an exception', function() {
        model.fetch();
        server.respond([
          200,
          {'Content-Type': 'application/json'},
          JSON.stringify({id: 1, name: 'John Doe', age: 23})
        ]);
        expect(model.get('age')).to.equal(23);
      });
    });

    describe('save()', function() {
      it('should throw exception by default', function() {
        expect(model.save.bind(model, 'name', 'Jonathan Doe')).to.throw(Error);
      });

      it('should not throw exception with override', function() {
        model.save('name', 'Jonathan Doe', overrideOpts);
        server.respond([
          200,
          {'Content-Type': 'application/json'},
          JSON.stringify({})
        ]);
        expect(model.hasChanged('name')).to.be.true;
      });
    });

    describe('destroy()', function() {
      it('should throw exception by default', function() {
        expect(model.destroy.bind(model)).to.throw(Error);
      });

      it('should not throw exception with override', function() {
        model.destroy(overrideOpts);
        server.respond([
          200,
          {'Content-Type': 'application/json'},
          JSON.stringify({})
        ]);
        expect(model.id).to.be.undefined;
      });
    });
  });

  describe('when using non-mutating methods', function() {
    // We are only listing methods that do not call other methods or simply
    // return an object property. For example, toJSON() calls clone(). We test
    // clone(), so no need to test toJSON();

    var methods = ['clone', 'isValid'];
    methods.forEach(function(methodName) {
      it('should not throw exception for ' + methodName + '()', function() {
        expect(model[methodName].bind(model)).to.not.throw(Error);
      });
    });
  });
});
