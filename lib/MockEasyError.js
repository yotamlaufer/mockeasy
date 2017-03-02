
const getMessage = (type, moduleName, funcName) => {
  switch(type) {
    case MockEasyError.INVOCATION_WILL_NEVER_BE_REACHED:
      return '[mockeasy] always() was defined for ' + moduleName + '.' + funcName + ' and this invocation will not be reached';
    case MockEasyError.NOT_DEFINED:
      return '[mockeasy] bogus function ' + moduleName + '.' + funcName + ' was not defined for this invocation';
    case MockEasyError.ILLEGAL_INVOCATION:
      return '[mockeasy] bogus function ' + moduleName + '.' + funcName + ' should not have been invoked';
    case MockEasyError.INCORRECT_TIME_DEFINITION:
      return 'times must be equal or greater than 1';
    default:
      return 'General Error';
  }
};

/**
 * @param {string} type
 * @param {string} moduleName
 * @param {string} funcName
 * @constructor
 * @extends {Error}
 */
class MockEasyError extends Error {
  constructor(type, moduleName, funcName) {
    super(getMessage(type, moduleName, funcName));
    this.moduleName = moduleName;
    this.funcName = funcName;
    Error.captureStackTrace(this, MockEasyError);
  }
  toString() {
    return this.message;
  }
  where() {
    return this.moduleName + '.' + this.funcName;
  }
}

MockEasyError.INVOCATION_WILL_NEVER_BE_REACHED = 'invocation will never be reached';
MockEasyError.NOT_DEFINED = 'not defined';
MockEasyError.ILLEGAL_INVOCATION = 'illegal invocation';
MockEasyError.INCORRECT_TIME_DEFINITION = 'incorrect time definition';

module.exports = MockEasyError;