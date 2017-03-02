const _ = require('lodash');
const path = require('path');

const MockEasyError = require('./MockEasyError');

const anonymous = 'anonymous';

const wasMocked = {};
let exitOnFatalError = true;


function ignoreFatalErrors() {
  exitOnFatalError = false;
  return exports;
}

const stub = (module) => {

  let moduleName;
  let keys = Object.keys(require.cache);

  for (let i = 0; i <  keys.length; i++) {
    let modulePath = keys[i];
    if (require.cache[modulePath].exports === module) {
      moduleName = path.basename(keys[i], '.js');
      if (wasMocked[modulePath]) {
        throw new Error('[mockeasy Error] already stubbed ' + moduleName)
      }
      wasMocked[modulePath] = true;
      break;
    }
  }

  for (let functionName in module) {
    if (module.hasOwnProperty(functionName)) {
      if (_.isFunction(module[functionName])) {
        module[functionName] = inject(moduleName, functionName);
      }
    }
  }

  return module;
};

const reset = (...modules) => {
  modules.forEach((module) => {
    for (let prop in module) {
      if (module.hasOwnProperty(prop)) {
        const fn = module[prop];
        if (_.isFunction(fn) && _.isFunction(fn.reset)) {
          fn.reset();
        }
      }
    }
  });
};

function inject(mockName, functionName) {

  console.warn('[mockeasy] ' + mockName + '.' + functionName + ' replaced with mock');

  let queue = null;
  let alwaysOn = false;

  function fn(...args) {

    try {

      if (_.isEmpty(queue)) {
        notFound();
        return;
      }

      const action = queue[0];
      action.times--;

      if (action.times === 0) {
        queue.shift();
      }

      return action.callback(...args);

    } catch(error) {

      let fatal = false;

      if (error instanceof MockEasyError) {
        console.error('[mockeasy Error] ILLEGAL OPERATION, ASSUME TEST CONTEXT IS NOW UNSTABLE');
        console.error('[mockeasy Error] INVOCATION FAILED AT: ' + error.where());
        fatal = true;
      }

      if (error instanceof TypeError) {
        console.error('[TYPE ERROR]');
        fatal = true;
      }

      if (exitOnFatalError && fatal) {
        console.error(error.stack);
        process.exit(999);
        return;
      }

      throw error;
    }
  }

  function reset() {
    queue = [];
    alwaysOn = false;
    return fn;
  }

  function notFound() {
    throw new MockEasyError(MockEasyError.NOT_DEFINED, mockName, functionName);
  }

  function once(callback) {
    times(callback, 1);
    return fn;
  }

  function never() {
    return times(function() {
      throw new MockEasyError(MockEasyError.ILLEGAL_INVOCATION, mockName, functionName);
    }, Infinity);

  }

  function always(callback) {
    return times(callback, Infinity);
  }

  function times(callback, count) {
    if (alwaysOn) {
      throw new MockEasyError(MockEasyError.INVOCATION_WILL_NEVER_BE_REACHED, mockName, functionName);
    }

    if (count < 1) {
      throw new MockEasyError(MockEasyError.INCORRECT_TIME_DEFINITION, mockName, functionName);
    }

    alwaysOn = count == Infinity;

    if (!queue) {
      queue = [];
    }

    queue.push({times: count, callback: callback});

    return fn;
  }

  fn.reset = reset;
  fn.times = times;
  fn.never = never;
  fn.once = once;
  fn.always = always;
  return fn;
}

exports.stub = stub;
exports.reset = reset;
exports.ignoreFatalErrors = ignoreFatalErrors;

