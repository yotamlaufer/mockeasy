const chai = require('chai');
const MockEasyError = require('../lib/MockEasyError');

const mockeasy = require('../lib');
// don't exit when context fails, so we can complete the test suite.
mockeasy.ignoreFatalErrors();

const targetModule = require('./mock-me');
const mockedTargetModule = mockeasy.stub(targetModule);

describe('mockeasy - Mock by path', function() {

  describe('successfully stubs methods', function () {

    beforeEach(function() {
      mockedTargetModule.isStub.reset();
    });

    it('arguments are passed to the mocked invocation', function () {

      mockedTargetModule.isStub.always(function mockIAm(firstArg, secondArg) {
        return [firstArg, secondArg];
      });

      chai.assert.deepEqual(mockedTargetModule.isStub('arg1', 'arg2'), ['arg1', 'arg2']);
    });

    it('once() overrides a function and expires after one invocation', function () {

      let wasInvoked = false;
      mockedTargetModule.isStub.once(function mockIAm() {
        wasInvoked = true;
        return true;
      });

      chai.assert.isTrue(mockedTargetModule.isStub());
      chai.assert.isTrue(wasInvoked);
      chai.assert.throws(mockedTargetModule.isStub, new MockEasyError(MockEasyError.NOT_DEFINED, 'mock-me', 'isStub').message);
    });

    it('times() overrides a function and expires after the specified number of invocations', function () {

      let wasInvoked = false;
      mockedTargetModule.isStub.times(function mockIAm() {
        wasInvoked = true;
        return true;
      }, 2);

      chai.assert.isTrue(mockedTargetModule.isStub());
      chai.assert.isTrue(mockedTargetModule.isStub());
      chai.assert.isTrue(wasInvoked);
      chai.assert.throws(mockedTargetModule.isStub, new MockEasyError(MockEasyError.NOT_DEFINED, 'mock-me', 'isStub').message);
    });

    it('always() overrides a function perpetually', function () {

      let wasInvoked = false;
      mockedTargetModule.isStub.always(function mockIAm() {
        wasInvoked = true;
        return true;
      });

      chai.assert.isTrue(mockedTargetModule.isStub());
      chai.assert.isTrue(mockedTargetModule.isStub());
      chai.assert.isTrue(wasInvoked);
      chai.assert.doesNotThrow(mockedTargetModule.isStub, new MockEasyError(MockEasyError.NOT_DEFINED, 'mock-me', 'isStub').message);
    });

    it('once always() was called the mocked function is locked', function () {

      let wasInvoked = false;
      mockedTargetModule.isStub.always(function mockIAm() {
        wasInvoked = true;
        return true;
      });

      chai.assert.throws(mockedTargetModule.isStub.once, new MockEasyError(MockEasyError.INVOCATION_WILL_NEVER_BE_REACHED, 'mock-me', 'isStub').message);
    });

    it('never() throws an error when the method is invoked', function() {

      mockedTargetModule.isStub.never();

      chai.assert.throws(mockedTargetModule.isStub, new MockEasyError(MockEasyError.ILLEGAL_INVOCATION, 'mock-me', 'isStub').message);
    });

    it('once() and then always() executes in defined order', function() {

      let onceInvoked = false;
      let alwaysInvoked = false;
      mockedTargetModule.isStub
        .once(function mockIAm() {
          onceInvoked = true;
          return 'once';
        })
        .always(function hereIAm() {
          alwaysInvoked = true;
          return 'always';
        });

      chai.assert.equal(mockedTargetModule.isStub(), 'once');
      chai.assert.isTrue(onceInvoked);
      chai.assert.isFalse(alwaysInvoked);
      chai.assert.equal(mockedTargetModule.isStub(), 'always');
      chai.assert.isTrue(alwaysInvoked);
      chai.assert.doesNotThrow(mockedTargetModule.isStub, '[Ted] bogus function StubMe.isStub was not defined for this invocation');
    });

    it('replaceMethodsWithStubs() returns the stubbed method to its non defined state', function () {

      let wasInvoked = false;
      mockedTargetModule.isStub
        .always(function mockIAm() {
          wasInvoked = true;
          return true;
        })
        .reset();

      chai.assert.throws(mockedTargetModule.isStub, new MockEasyError(MockEasyError.NOT_DEFINED, 'mock-me', 'isStub').message);
    });
  });

  it('successfully resets all stubbed methods', function () {

    mockedTargetModule.isStub.always(function mockIAm() {
      return true;
    });

    mockedTargetModule.getString.once(function aNumber() {
      return 100;
    });

    mockeasy.reset(mockedTargetModule);

    chai.assert.throws(mockedTargetModule.isStub, new MockEasyError(MockEasyError.NOT_DEFINED, 'mock-me', 'isStub').message);
    chai.assert.throws(mockedTargetModule.getString, new MockEasyError(MockEasyError.NOT_DEFINED, 'mock-me', 'getString').message);
  });

  it('successfully injects resets all method', function () {

    mockedTargetModule.isStub.always(function mockIAm() {
      return true;
    });

    mockedTargetModule.getString.once(function aNumber() {
      return 100;
    });

    mockeasy.reset(mockedTargetModule);

    chai.assert.throws(mockedTargetModule.isStub, new MockEasyError(MockEasyError.NOT_DEFINED, 'mock-me', 'isStub').message);
    chai.assert.throws(mockedTargetModule.getString, new MockEasyError(MockEasyError.NOT_DEFINED, 'mock-me', 'getString').message);
  });

});

describe('mockeasy - Mock Module', function() {

  describe('successfully stubs methods', function () {

    beforeEach(function () {
      mockedTargetModule.isStub.reset();
    });

    it('arguments are passed to the mocked invocation', function () {

      mockedTargetModule.isStub.always(function mockIAm(firstArg, secondArg) {
        return [firstArg, secondArg];
      });

      chai.assert.deepEqual(mockedTargetModule.isStub('arg1', 'arg2'), ['arg1', 'arg2']);
    });

  });
});
