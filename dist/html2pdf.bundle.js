/**
 * html2pdf.js v0.9.0
 * Copyright (c) 2018 Erik Koopmans
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('fs')) :
	typeof define === 'function' && define.amd ? define(['fs'], factory) :
	(global.html2pdf = factory(global.fs));
}(this, (function (fs) { 'use strict';

fs = fs && fs.hasOwnProperty('default') ? fs['default'] : fs;

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
}



function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var es6Promise = createCommonjsModule(function (module, exports) {
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   v4.2.4+314e4831
 */

(function (global, factory) {
	module.exports = factory();
}(commonjsGlobal, (function () { function objectOrFunction(x) {
  var type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}

function isFunction(x) {
  return typeof x === 'function';
}



var _isArray = void 0;
if (Array.isArray) {
  _isArray = Array.isArray;
} else {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
}

var isArray = _isArray;

var len = 0;
var vertxNext = void 0;
var customSchedulerFn = void 0;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var vertx = Function('return this')().require('vertx');
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = void 0;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && typeof commonjsRequire === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;


  if (_state) {
    var callback = arguments[_state - 1];
    asap(function () {
      return invokeCallback(_state, child, callback, parent._result);
    });
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve$1(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(2);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

var TRY_CATCH_ERROR = { error: null };

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function getThen(promise) {
  try {
    return promise.then;
  } catch (error) {
    TRY_CATCH_ERROR.error = error;
    return TRY_CATCH_ERROR;
  }
}

function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
  try {
    then$$1.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then$$1) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then$$1, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return resolve(promise, value);
    }, function (reason) {
      return reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$1) {
  if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$1 === TRY_CATCH_ERROR) {
      reject(promise, TRY_CATCH_ERROR.error);
      TRY_CATCH_ERROR.error = null;
    } else if (then$$1 === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$1)) {
      handleForeignThenable(promise, maybeThenable, then$$1);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function resolve(promise, value) {
  if (promise === value) {
    reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    handleMaybeThenable(promise, value, getThen(value));
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;


  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = void 0,
      callback = void 0,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function tryCatch(callback, detail) {
  try {
    return callback(detail);
  } catch (e) {
    TRY_CATCH_ERROR.error = e;
    return TRY_CATCH_ERROR;
  }
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = void 0,
      error = void 0,
      succeeded = void 0,
      failed = void 0;

  if (hasCallback) {
    value = tryCatch(callback, detail);

    if (value === TRY_CATCH_ERROR) {
      failed = true;
      error = value.error;
      value.error = null;
    } else {
      succeeded = true;
    }

    if (promise === value) {
      reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
    succeeded = true;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
    resolve(promise, value);
  } else if (failed) {
    reject(promise, error);
  } else if (settled === FULFILLED) {
    fulfill(promise, value);
  } else if (settled === REJECTED) {
    reject(promise, value);
  }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      resolve(promise, value);
    }, function rejectPromise(reason) {
      reject(promise, reason);
    });
  } catch (e) {
    reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
}

var Enumerator = function () {
  function Enumerator(Constructor, input) {
    this._instanceConstructor = Constructor;
    this.promise = new Constructor(noop);

    if (!this.promise[PROMISE_ID]) {
      makePromise(this.promise);
    }

    if (isArray(input)) {
      this.length = input.length;
      this._remaining = input.length;

      this._result = new Array(this.length);

      if (this.length === 0) {
        fulfill(this.promise, this._result);
      } else {
        this.length = this.length || 0;
        this._enumerate(input);
        if (this._remaining === 0) {
          fulfill(this.promise, this._result);
        }
      }
    } else {
      reject(this.promise, validationError());
    }
  }

  Enumerator.prototype._enumerate = function _enumerate(input) {
    for (var i = 0; this._state === PENDING && i < input.length; i++) {
      this._eachEntry(input[i], i);
    }
  };

  Enumerator.prototype._eachEntry = function _eachEntry(entry, i) {
    var c = this._instanceConstructor;
    var resolve$$1 = c.resolve;


    if (resolve$$1 === resolve$1) {
      var _then = getThen(entry);

      if (_then === then && entry._state !== PENDING) {
        this._settledAt(entry._state, i, entry._result);
      } else if (typeof _then !== 'function') {
        this._remaining--;
        this._result[i] = entry;
      } else if (c === Promise$1) {
        var promise = new c(noop);
        handleMaybeThenable(promise, entry, _then);
        this._willSettleAt(promise, i);
      } else {
        this._willSettleAt(new c(function (resolve$$1) {
          return resolve$$1(entry);
        }), i);
      }
    } else {
      this._willSettleAt(resolve$$1(entry), i);
    }
  };

  Enumerator.prototype._settledAt = function _settledAt(state, i, value) {
    var promise = this.promise;


    if (promise._state === PENDING) {
      this._remaining--;

      if (state === REJECTED) {
        reject(promise, value);
      } else {
        this._result[i] = value;
      }
    }

    if (this._remaining === 0) {
      fulfill(promise, this._result);
    }
  };

  Enumerator.prototype._willSettleAt = function _willSettleAt(promise, i) {
    var enumerator = this;

    subscribe(promise, undefined, function (value) {
      return enumerator._settledAt(FULFILLED, i, value);
    }, function (reason) {
      return enumerator._settledAt(REJECTED, i, reason);
    });
  };

  return Enumerator;
}();

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all(entries) {
  return new Enumerator(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject$1(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {Function} resolver
  Useful for tooling.
  @constructor
*/

var Promise$1 = function () {
  function Promise(resolver) {
    this[PROMISE_ID] = nextId();
    this._result = this._state = undefined;
    this._subscribers = [];

    if (noop !== resolver) {
      typeof resolver !== 'function' && needsResolver();
      this instanceof Promise ? initializePromise(this, resolver) : needsNew();
    }
  }

  /**
  The primary way of interacting with a promise is through its `then` method,
  which registers callbacks to receive either a promise's eventual value or the
  reason why the promise cannot be fulfilled.
   ```js
  findUser().then(function(user){
    // user is available
  }, function(reason){
    // user is unavailable, and you are given the reason why
  });
  ```
   Chaining
  --------
   The return value of `then` is itself a promise.  This second, 'downstream'
  promise is resolved with the return value of the first promise's fulfillment
  or rejection handler, or rejected if the handler throws an exception.
   ```js
  findUser().then(function (user) {
    return user.name;
  }, function (reason) {
    return 'default name';
  }).then(function (userName) {
    // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
    // will be `'default name'`
  });
   findUser().then(function (user) {
    throw new Error('Found user, but still unhappy');
  }, function (reason) {
    throw new Error('`findUser` rejected and we're unhappy');
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
    // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
  });
  ```
  If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
   ```js
  findUser().then(function (user) {
    throw new PedagogicalException('Upstream error');
  }).then(function (value) {
    // never reached
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // The `PedgagocialException` is propagated all the way down to here
  });
  ```
   Assimilation
  ------------
   Sometimes the value you want to propagate to a downstream promise can only be
  retrieved asynchronously. This can be achieved by returning a promise in the
  fulfillment or rejection handler. The downstream promise will then be pending
  until the returned promise is settled. This is called *assimilation*.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // The user's comments are now available
  });
  ```
   If the assimliated promise rejects, then the downstream promise will also reject.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // If `findCommentsByAuthor` fulfills, we'll have the value here
  }, function (reason) {
    // If `findCommentsByAuthor` rejects, we'll have the reason here
  });
  ```
   Simple Example
  --------------
   Synchronous Example
   ```javascript
  let result;
   try {
    result = findResult();
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
  findResult(function(result, err){
    if (err) {
      // failure
    } else {
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findResult().then(function(result){
    // success
  }, function(reason){
    // failure
  });
  ```
   Advanced Example
  --------------
   Synchronous Example
   ```javascript
  let author, books;
   try {
    author = findAuthor();
    books  = findBooksByAuthor(author);
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
   function foundBooks(books) {
   }
   function failure(reason) {
   }
   findAuthor(function(author, err){
    if (err) {
      failure(err);
      // failure
    } else {
      try {
        findBoooksByAuthor(author, function(books, err) {
          if (err) {
            failure(err);
          } else {
            try {
              foundBooks(books);
            } catch(reason) {
              failure(reason);
            }
          }
        });
      } catch(error) {
        failure(err);
      }
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findAuthor().
    then(findBooksByAuthor).
    then(function(books){
      // found books
  }).catch(function(reason){
    // something went wrong
  });
  ```
   @method then
  @param {Function} onFulfilled
  @param {Function} onRejected
  Useful for tooling.
  @return {Promise}
  */

  /**
  `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
  as the catch block of a try/catch statement.
  ```js
  function findAuthor(){
  throw new Error('couldn't find that author');
  }
  // synchronous
  try {
  findAuthor();
  } catch(reason) {
  // something went wrong
  }
  // async with promises
  findAuthor().catch(function(reason){
  // something went wrong
  });
  ```
  @method catch
  @param {Function} onRejection
  Useful for tooling.
  @return {Promise}
  */


  Promise.prototype.catch = function _catch(onRejection) {
    return this.then(null, onRejection);
  };

  /**
    `finally` will be invoked regardless of the promise's fate just as native
    try/catch/finally behaves
  
    Synchronous example:
  
    ```js
    findAuthor() {
      if (Math.random() > 0.5) {
        throw new Error();
      }
      return new Author();
    }
  
    try {
      return findAuthor(); // succeed or fail
    } catch(error) {
      return findOtherAuther();
    } finally {
      // always runs
      // doesn't affect the return value
    }
    ```
  
    Asynchronous example:
  
    ```js
    findAuthor().catch(function(reason){
      return findOtherAuther();
    }).finally(function(){
      // author was either found, or not
    });
    ```
  
    @method finally
    @param {Function} callback
    @return {Promise}
  */


  Promise.prototype.finally = function _finally(callback) {
    var promise = this;
    var constructor = promise.constructor;

    return promise.then(function (value) {
      return constructor.resolve(callback()).then(function () {
        return value;
      });
    }, function (reason) {
      return constructor.resolve(callback()).then(function () {
        throw reason;
      });
    });
  };

  return Promise;
}();

Promise$1.prototype.then = then;
Promise$1.all = all;
Promise$1.race = race;
Promise$1.resolve = resolve$1;
Promise$1.reject = reject$1;
Promise$1._setScheduler = setScheduler;
Promise$1._setAsap = setAsap;
Promise$1._asap = asap;

/*global self*/
function polyfill() {
  var local = void 0;

  if (typeof commonjsGlobal !== 'undefined') {
    local = commonjsGlobal;
  } else if (typeof self !== 'undefined') {
    local = self;
  } else {
    try {
      local = Function('return this')();
    } catch (e) {
      throw new Error('polyfill failed because global object is unavailable in this environment');
    }
  }

  var P = local.Promise;

  if (P) {
    var promiseToString = null;
    try {
      promiseToString = Object.prototype.toString.call(P.resolve());
    } catch (e) {
      // silently ignored
    }

    if (promiseToString === '[object Promise]' && !P.cast) {
      return;
    }
  }

  local.Promise = Promise$1;
}

// Strange compat..
Promise$1.polyfill = polyfill;
Promise$1.Promise = Promise$1;

return Promise$1;

})));




});

var auto = es6Promise.polyfill();

var jspdf_min = createCommonjsModule(function (module, exports) {
!function(t,e){module.exports=e();}(commonjsGlobal,function(){var t,w,e,I,i,o,a,c,A,T,d,p,F,n,r,s,l,q,E,P,g,m,y,h,v,b,x,S,u,k,_,f,C,O,B,j,R,D,M,z,N,L,U,H,W,V,G,Y,X,J,vt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},K=function(pt){var gt="1.3",mt={a0:[2383.94,3370.39],a1:[1683.78,2383.94],a2:[1190.55,1683.78],a3:[841.89,1190.55],a4:[595.28,841.89],a5:[419.53,595.28],a6:[297.64,419.53],a7:[209.76,297.64],a8:[147.4,209.76],a9:[104.88,147.4],a10:[73.7,104.88],b0:[2834.65,4008.19],b1:[2004.09,2834.65],b2:[1417.32,2004.09],b3:[1000.63,1417.32],b4:[708.66,1000.63],b5:[498.9,708.66],b6:[354.33,498.9],b7:[249.45,354.33],b8:[175.75,249.45],b9:[124.72,175.75],b10:[87.87,124.72],c0:[2599.37,3676.54],c1:[1836.85,2599.37],c2:[1298.27,1836.85],c3:[918.43,1298.27],c4:[649.13,918.43],c5:[459.21,649.13],c6:[323.15,459.21],c7:[229.61,323.15],c8:[161.57,229.61],c9:[113.39,161.57],c10:[79.37,113.39],dl:[311.81,623.62],letter:[612,792],"government-letter":[576,756],legal:[612,1008],"junior-legal":[576,360],ledger:[1224,792],tabloid:[792,1224],"credit-card":[153,243]};function yt(o){var a={};this.subscribe=function(t,e,n){if("function"!=typeof e)return!1;a.hasOwnProperty(t)||(a[t]={});var r=Math.random().toString(35);return a[t][r]=[e,!!n], r}, this.unsubscribe=function(t){for(var e in a)if(a[e][t])return delete a[e][t], !0;return!1}, this.publish=function(t){if(a.hasOwnProperty(t)){var e=Array.prototype.slice.call(arguments,1),n=[];for(var r in a[t]){var i=a[t][r];try{i[0].apply(o,e);}catch(t){pt.console&&console.error("jsPDF PubSub Error",t.message,t);}i[1]&&n.push(r);}n.length&&n.forEach(this.unsubscribe);}};}function wt(t,e,n,r){var i={};"object"===(void 0===t?"undefined":vt(t))&&(t=(i=t).orientation, e=i.unit||e, n=i.format||n, r=i.compress||i.compressPdf||r), e=e||"mm", n=n||"a4", t=(""+(t||"P")).toLowerCase();(""+n).toLowerCase();var tt,y,w,o,u,v,a,s,c,l,h,f=!!r&&"function"==typeof Uint8Array,et=i.textColor||"0 g",d=i.drawColor||"0 G",nt=i.fontSize||16,rt=i.charSpace||0,it=i.R2L||!1,ot=i.lineHeight||1.15,p=i.lineWidth||.200025,g="00000000000000000000000000000000",m=2,b=!1,x=[],at={},S={},k=0,_=[],C=[],I=[],A=[],T=[],F=0,q=0,E=0,P={title:"",subject:"",author:"",keywords:"",creator:""},O={},st=new yt(O),B=i.hotfixes||[],j=function(t){var e,n=t.ch1,r=t.ch2,i=t.ch3,o=t.ch4,a=(t.precision, "draw"===t.pdfColorType?["G","RG","K"]:["g","rg","k"]),s={aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgreen:"#006400",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",green:"#008000",greenyellow:"#adff2f",honeydew:"#f0fff0",hotpink:"#ff69b4","indianred ":"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgrey:"#d3d3d3",lightgreen:"#90ee90",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370d8",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#d87093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",rebeccapurple:"#663399",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"};if("string"==typeof n&&s.hasOwnProperty(n)&&(n=s[n]), "string"==typeof n&&/^#[0-9A-Fa-f]{3}$/.test(n)&&(n="#"+n[1]+n[1]+n[2]+n[2]+n[3]+n[3]), "string"==typeof n&&/^#[0-9A-Fa-f]{6}$/.test(n)){var c=parseInt(n.substr(1),16);n=c>>16&255, r=c>>8&255, i=255&c;}if(void 0===r||void 0===o&&n===r&&r===i)if("string"==typeof n)e=n+" "+a[0];else switch(t.precision){case 2:e=N(n/255)+" "+a[0];break;case 3:default:e=L(n/255)+" "+a[0];}else if(void 0===o||"object"===(void 0===o?"undefined":vt(o))){if("string"==typeof n)e=[n,r,i,a[1]].join(" ");else switch(t.precision){case 2:e=[N(n/255),N(r/255),N(i/255),a[1]].join(" ");break;default:case 3:e=[L(n/255),L(r/255),L(i/255),a[1]].join(" ");}o&&0===o.a&&(e=["255","255","255",a[1]].join(" "));}else if("string"==typeof n)e=[n,r,i,o,a[2]].join(" ");else switch(t.precision){case 2:e=[N(n),N(r),N(i),N(o),a[2]].join(" ");break;case 3:default:e=[L(n),L(r),L(i),L(o),a[2]].join(" ");}return e},R=function(t){var e=function(t){return("0"+parseInt(t)).slice(-2)},n=t.getTimezoneOffset(),r=n<0?"+":"-",i=Math.floor(Math.abs(n/60)),o=Math.abs(n%60),a=[r,e(i),"'",e(o),"'"].join("");return["D:",t.getFullYear(),e(t.getMonth()+1),e(t.getDate()),e(t.getHours()),e(t.getMinutes()),e(t.getSeconds()),a].join("")},D=function(t){var e;return void 0===(void 0===t?"undefined":vt(t))&&(t=new Date), e="object"===(void 0===t?"undefined":vt(t))&&"[object Date]"===Object.prototype.toString.call(t)?R(t):/^D:(20[0-2][0-9]|203[0-7]|19[7-9][0-9])(0[0-9]|1[0-2])([0-2][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])(0[0-9]|[1-5][0-9])(0[0-9]|[1-5][0-9])(\+0[0-9]|\+1[0-4]|\-0[0-9]|\-1[0-1])\'(0[0-9]|[1-5][0-9])\'?$/.test(t)?t:R(new Date), l=e},M=function(t){var e=l;return"jsDate"===t&&(e=function(t){var e=parseInt(t.substr(2,4),10),n=parseInt(t.substr(6,2),10)-1,r=parseInt(t.substr(8,2),10),i=parseInt(t.substr(10,2),10),o=parseInt(t.substr(12,2),10),a=parseInt(t.substr(14,2),10);parseInt(t.substr(16,2),10), parseInt(t.substr(20,2),10);return new Date(e,n,r,i,o,a,0)}(l)), e},z=function(t){return t=t||"12345678901234567890123456789012".split("").map(function(){return"ABCDEF0123456789".charAt(Math.floor(16*Math.random()))}).join(""), g=t},N=function(t){return t.toFixed(2)},L=function(t){return t.toFixed(3)},ct=function(t){t="string"==typeof t?t:t.toString(), b?_[o].push(t):(E+=t.length+1, A.push(t));},U=function(){return x[++m]=E, ct(m+" 0 obj"), m},H=function(t){ct("stream"), ct(t), ct("endstream");},W=function(){for(var t in ct("/ProcSet [/PDF /Text /ImageB /ImageC /ImageI]"), ct("/Font <<"), at)at.hasOwnProperty(t)&&ct("/"+t+" "+at[t].objectNumber+" 0 R");ct(">>"), ct("/XObject <<"), st.publish("putXobjectDict"), ct(">>");},V=function(){!function(){for(var t in at)at.hasOwnProperty(t)&&(e=at[t], st.publish("putFont",{font:e,out:ct,newObject:U}), !0!==e.isAlreadyPutted&&(e.objectNumber=U(), ct("<<"), ct("/Type /Font"), ct("/BaseFont /"+e.postScriptName), ct("/Subtype /Type1"), "string"==typeof e.encoding&&ct("/Encoding /"+e.encoding), ct("/FirstChar 32"), ct("/LastChar 255"), ct(">>"), ct("endobj")));var e;}(), st.publish("putResources"), x[2]=E, ct("2 0 obj"), ct("<<"), W(), ct(">>"), ct("endobj"), st.publish("postPutResources");},G=function(t,e,n){S.hasOwnProperty(e)||(S[e]={}), S[e][n]=t;},Y=function(t,e,n,r){var i="F"+(Object.keys(at).length+1).toString(10),o=at[i]={id:i,postScriptName:t,fontName:e,fontStyle:n,encoding:r,metadata:{}};return G(i,e,n), st.publish("addFont",o), i},lt=function(t,e){return function(t,e){var n,r,i,o,a,s,c,l,h;if(i=(e=e||{}).sourceEncoding||"Unicode", a=e.outputEncoding, (e.autoencode||a)&&at[tt].metadata&&at[tt].metadata[i]&&at[tt].metadata[i].encoding&&(o=at[tt].metadata[i].encoding, !a&&at[tt].encoding&&(a=at[tt].encoding), !a&&o.codePages&&(a=o.codePages[0]), "string"==typeof a&&(a=o[a]), a)){for(c=!1, s=[], n=0, r=t.length;n<r;n++)(l=a[t.charCodeAt(n)])?s.push(String.fromCharCode(l)):s.push(t[n]), s[n].charCodeAt(0)>>8&&(c=!0);t=s.join("");}for(n=t.length;void 0===c&&0!==n;)t.charCodeAt(n-1)>>8&&(c=!0), n--;if(!c)return t;for(s=e.noBOM?[]:[254,255], n=0, r=t.length;n<r;n++){if((h=(l=t.charCodeAt(n))>>8)>>8)throw new Error("Character at position "+n+" of string '"+t+"' exceeds 16bits. Cannot be encoded into UCS-2 BE");s.push(h), s.push(l-(h<<8));}return String.fromCharCode.apply(void 0,s)}(t,e).replace(/\\/g,"\\\\").replace(/\(/g,"\\(").replace(/\)/g,"\\)")},X=function(){(function(t,e){var n="string"==typeof e&&e.toLowerCase();if("string"==typeof t){var r=t.toLowerCase();mt.hasOwnProperty(r)&&(t=mt[r][0]/y, e=mt[r][1]/y);}if(Array.isArray(t)&&(e=t[1], t=t[0]), n){switch(n.substr(0,1)){case"l":t<e&&(n="s");break;case"p":e<t&&(n="s");}"s"===n&&(w=t, t=e, e=w);}b=!0, _[++k]=[], I[k]={width:Number(t)||u,height:Number(e)||v}, C[k]={}, J(k);}).apply(this,arguments), ct(N(p*y)+" w"), ct(d), 0!==F&&ct(F+" J"), 0!==q&&ct(q+" j"), st.publish("addPage",{pageNumber:k});},J=function(t){0<t&&t<=k&&(u=I[o=t].width, v=I[t].height);},K=function(t,e){var n,r;return t=void 0!==t?t:at[tt].fontName, e=void 0!==e?e:at[tt].fontStyle, r=t.toLowerCase(), void 0!==S[r]&&void 0!==S[r][e]?n=S[r][e]:void 0!==S[t]&&void 0!==S[t][e]?n=S[t][e]:console.warn("Unable to look up font label for font '"+t+"', '"+e+"'. Refer to getFontList() for available fonts."), n||null==(n=S.times[e])&&(n=S.times.normal), n},Q=function(){b=!1, m=2, E=0, A=[], x=[], T=[], st.publish("buildDocument"), ct("%PDF-"+gt), ct("%ºß¬à"), function(){var t,e,n,r,i,o,a,s,c,l=[];for(a=pt.adler32cs||wt.API.adler32cs, f&&void 0===a&&(f=!1), t=1;t<=k;t++){if(l.push(U()), s=(u=I[t].width)*y, c=(v=I[t].height)*y, ct("<</Type /Page"), ct("/Parent 1 0 R"), ct("/Resources 2 0 R"), ct("/MediaBox [0 0 "+N(s)+" "+N(c)+"]"), st.publish("putPage",{pageNumber:t,page:_[t]}), ct("/Contents "+(m+1)+" 0 R"), ct(">>"), ct("endobj"), e=_[t].join("\n"), U(), f){for(n=[], r=e.length;r--;)n[r]=e.charCodeAt(r);o=a.from(e), (i=new Deflater(6)).append(new Uint8Array(n)), e=i.flush(), (n=new Uint8Array(e.length+6)).set(new Uint8Array([120,156])), n.set(e,2), n.set(new Uint8Array([255&o,o>>8&255,o>>16&255,o>>24&255]),e.length+2), e=String.fromCharCode.apply(null,n), ct("<</Length "+e.length+" /Filter [/FlateDecode]>>");}else ct("<</Length "+e.length+">>");H(e), ct("endobj");}x[1]=E, ct("1 0 obj"), ct("<</Type /Pages");var h="/Kids [";for(r=0;r<k;r++)h+=l[r]+" 0 R ";ct(h+"]"), ct("/Count "+k), ct(">>"), ct("endobj"), st.publish("postPutPages");}(), function(){st.publish("putAdditionalObjects");for(var t=0;t<T.length;t++){var e=T[t];x[e.objId]=E, ct(e.objId+" 0 obj"), ct(e.content), ct("endobj");}m+=T.length, st.publish("postPutAdditionalObjects");}(), V(), U(), ct("<<"), function(){for(var t in ct("/Producer (jsPDF "+wt.version+")"), P)P.hasOwnProperty(t)&&P[t]&&ct("/"+t.substr(0,1).toUpperCase()+t.substr(1)+" ("+lt(P[t])+")");ct("/CreationDate ("+l+")");}(), ct(">>"), ct("endobj"), U(), ct("<<"), function(){switch(ct("/Type /Catalog"), ct("/Pages 1 0 R"), s||(s="fullwidth"), s){case"fullwidth":ct("/OpenAction [3 0 R /FitH null]");break;case"fullheight":ct("/OpenAction [3 0 R /FitV null]");break;case"fullpage":ct("/OpenAction [3 0 R /Fit]");break;case"original":ct("/OpenAction [3 0 R /XYZ null null 1]");break;default:var t=""+s;"%"===t.substr(t.length-1)&&(s=parseInt(s)/100), "number"==typeof s&&ct("/OpenAction [3 0 R /XYZ null null "+N(s)+"]");}switch(c||(c="continuous"), c){case"continuous":ct("/PageLayout /OneColumn");break;case"single":ct("/PageLayout /SinglePage");break;case"two":case"twoleft":ct("/PageLayout /TwoColumnLeft");break;case"tworight":ct("/PageLayout /TwoColumnRight");}a&&ct("/PageMode /"+a), st.publish("putCatalog");}(), ct(">>"), ct("endobj");var t,e=E,n="0000000000";for(ct("xref"), ct("0 "+(m+1)), ct(n+" 65535 f "), t=1;t<=m;t++){var r=x[t];ct("function"==typeof r?(n+x[t]()).slice(-10)+" 00000 n ":(n+x[t]).slice(-10)+" 00000 n ");}return ct("trailer"), ct("<<"), ct("/Size "+(m+1)), ct("/Root "+m+" 0 R"), ct("/Info "+(m-1)+" 0 R"), ct("/ID [ <"+g+"> <"+g+"> ]"), ct(">>"), ct("startxref"), ct(""+e), ct("%%EOF"), b=!0, A.join("\n")},Z=function(t){var e="S";return"F"===t?e="f":"FD"===t||"DF"===t?e="B":"f"!==t&&"f*"!==t&&"B"!==t&&"B*"!==t||(e=t), e},$=function(){for(var t=Q(),e=t.length,n=new ArrayBuffer(e),r=new Uint8Array(n);e--;)r[e]=t.charCodeAt(e);return n},ht=function(){return new Blob([$()],{type:"application/pdf"})},ut=((h=function(t,e){var n="dataur"===(""+t).substr(0,6)?"data:application/pdf;base64,"+btoa(Q()):0;switch(t){case void 0:return Q();case"save":if("object"===("undefined"==typeof navigator?"undefined":vt(navigator))&&navigator.getUserMedia&&(void 0===pt.URL||void 0===pt.URL.createObjectURL))return O.output("dataurlnewwindow");bt(ht(),e), "function"==typeof bt.unload&&pt.setTimeout&&setTimeout(bt.unload,911);break;case"arraybuffer":return $();case"blob":return ht();case"bloburi":case"bloburl":return pt.URL&&pt.URL.createObjectURL(ht())||void 0;case"datauristring":case"dataurlstring":return n;case"dataurlnewwindow":var r=pt.open(n);if(r||"undefined"==typeof safari)return r;case"datauri":case"dataurl":return pt.document.location.href=n;default:throw new Error('Output type "'+t+'" is not supported.')}}).foo=function(){try{return h.apply(this,arguments)}catch(t){var e=t.stack||"";~e.indexOf(" at ")&&(e=e.split(" at ")[1]);var n="Error in function "+e.split("\n")[0].split("<")[0]+": "+t.message;if(!pt.console)throw new Error(n);pt.console.error(n,t), pt.alert&&alert(n);}}, (h.foo.bar=h).foo),ft=function(t){return!0===Array.isArray(B)&&-1<B.indexOf(t)};switch(e){case"pt":y=1;break;case"mm":y=72/25.4;break;case"cm":y=72/2.54;break;case"in":y=72;break;case"px":y=1==ft("px_scaling")?.75:96/72;break;case"pc":case"em":y=12;break;case"ex":y=6;break;default:throw"Invalid unit: "+e}for(var dt in D(), z(), O.internal={pdfEscape:lt,getStyle:Z,getFont:function(){return at[K.apply(O,arguments)]},getFontSize:function(){return nt},getCharSpace:function(){return rt},getTextColor:function(){var t=et.split(" ");if(2===t.length&&"g"===t[1]){var e=parseFloat(t[0]);t=[e,e,e,"r"];}for(var n="#",r=0;r<3;r++)n+=("0"+Math.floor(255*parseFloat(t[r])).toString(16)).slice(-2);return n},getLineHeight:function(){return nt*ot},write:function(t){ct(1===arguments.length?t:Array.prototype.join.call(arguments," "));},getCoordinateString:function(t){return N(t*y)},getVerticalCoordinateString:function(t){return N((v-t)*y)},collections:{},newObject:U,newAdditionalObject:function(){var t=2*_.length+1,e={objId:t+=T.length,content:""};return T.push(e), e},newObjectDeferred:function(){return x[++m]=function(){return E}, m},newObjectDeferredBegin:function(t){x[t]=E;},putStream:H,events:st,scaleFactor:y,pageSize:{getWidth:function(){return u},getHeight:function(){return v}},output:function(t,e){return ut(t,e)},getNumberOfPages:function(){return _.length-1},pages:_,out:ct,f2:N,getPageInfo:function(t){return{objId:2*(t-1)+3,pageNumber:t,pageContext:C[t]}},getCurrentPageInfo:function(){return{objId:2*(o-1)+3,pageNumber:o,pageContext:C[o]}},getPDFVersion:function(){return gt},hasHotfix:ft}, O.addPage=function(){return X.apply(this,arguments), this}, O.setPage=function(){return J.apply(this,arguments), this}, O.insertPage=function(t){return this.addPage(), this.movePage(o,t), this}, O.movePage=function(t,e){if(e<t){for(var n=_[t],r=I[t],i=C[t],o=t;e<o;o--)_[o]=_[o-1], I[o]=I[o-1], C[o]=C[o-1];_[e]=n, I[e]=r, C[e]=i, this.setPage(e);}else if(t<e){for(n=_[t], r=I[t], i=C[t], o=t;o<e;o++)_[o]=_[o+1], I[o]=I[o+1], C[o]=C[o+1];_[e]=n, I[e]=r, C[e]=i, this.setPage(e);}return this}, O.deletePage=function(){return function(t){0<t&&t<=k&&(_.splice(t,1), I.splice(t,1), --k<o&&(o=k), this.setPage(o));}.apply(this,arguments), this}, O.setCreationDate=function(t){return D(t), this}, O.getCreationDate=function(t){return M(t)}, O.setFileId=function(t){return z(t), this}, O.getFileId=function(){return g}, O.setDisplayMode=function(t,e,n){if(s=t, c=e, -1==[void 0,null,"UseNone","UseOutlines","UseThumbs","FullScreen"].indexOf(a=n))throw new Error('Page mode must be one of UseNone, UseOutlines, UseThumbs, or FullScreen. "'+n+'" is not recognized.');return this}, O.text=function(t,e,n,i){var r,o,a="";function s(t){for(var e,n=t.concat(),r=[],i=n.length;i--;)"string"==typeof(e=n.shift())?r.push(e):"[object Array]"===Object.prototype.toString.call(t)&&1===e.length?r.push(e[0]):r.push([e[0],e[1],e[2]]);return r}function c(t,e){var n;if("string"==typeof t)n=e(t)[0];else if("[object Array]"===Object.prototype.toString.call(t)){for(var r,i,o=t.concat(),a=[],s=o.length;s--;)"string"==typeof(r=o.shift())?a.push(e(r)[0]):"[object Array]"===Object.prototype.toString.call(r)&&"string"===r[0]&&(i=e(r[0],r[1],r[2]), a.push([i[0],i[1],i[2]]));n=a;}return n}var l=function(t,e){return"function"==typeof e.font.metadata.widthOfString?e.font.metadata.widthOfString(t,e.fontSize,e.charSpace):u(function(t,e){var n,r,i,o=(e=e||{}).widths?e.widths:e.font.metadata.Unicode.widths,a=o.fof?o.fof:1,s=e.kerning?e.kerning:e.font.metadata.Unicode.kerning,c=s.fof?s.fof:1,l=0,h=o[0]||a,u=[];for(n=0, r=t.length;n<r;n++)i=t.charCodeAt(n), u.push((o[i]||h)/a+(s[i]&&s[i][l]||0)/c), l=i;return u}(t,e))*e.fontSize};var h,u=function(t){for(var e=t.length,n=0;e;)n+=t[--e];return n};"number"==typeof t&&(h=n, n=e, e=t, t=h);var f=i,d=arguments[4],p=arguments[5];"object"===(void 0===f?"undefined":vt(f))&&null!==f||("string"==typeof d&&(p=d, d=null), "string"==typeof f&&(p=f, f=null), "number"==typeof f&&(d=f, f=null), i={flags:f,angle:d,align:p});var g=!1,m=!0;if("string"==typeof t)g=!0;else if("[object Array]"===Object.prototype.toString.call(t)){for(var y,w=t.concat(),v=[],b=w.length;b--;)("string"!=typeof(y=w.shift())||"[object Array]"===Object.prototype.toString.call(y)&&"string"!=typeof y[0])&&(m=!1);g=m;}if(!1===g)throw new Error('Type of text must be string or Array. "'+t+'" is not recognized.');var x=at[tt].encoding;"WinAnsiEncoding"!==x&&"StandardEncoding"!==x||(t=c(t,function(t,e,n){return[(r=t, r=r.split("\t").join(Array(i.TabLen||9).join(" ")), lt(r,f)),e,n];var r;})), "string"==typeof t&&(t=t.match(/[\r?\n]/)?t.split(/\r\n|\r|\n/g):[t]);var S=i.maxWidth||0,k=i.maxWidthAlgorythm||"first-fit";o=i.lineHeight||ot;var _=at[tt],C=this.internal.scaleFactor,I=i.charSpace||rt,A=l(" ",{font:_,charSpace:I,fontSize:nt})/C,T=function(t,e){var n=0,r=0,i=[],o=[],a=[],s=[],c=[];for(s=t.split(/ /g), n=0;n<s.length;n+=1)o.push(l(s[n],{font:_,charSpace:I,fontSize:nt})/C);for(n=0;n<s.length;n+=1)a=o.slice(r,n), e<=u(a)+A*(a.length-1)?(i.push(s.slice(r,0!==n?n-1:0).join(" ")), r=0!==n?n-1:0, n-=1):n===o.length-1&&i.push(s.slice(r,o.length).join(" "));for(c=[], n=0;n<i.length;n+=1)c=c.concat(i[n]);return c};if(0<S)switch(k){case"first-fit":default:t=function(t,e){var n=0,r=[];for(n=0;n<t.length;n+=1)r=r.concat(T(t[n],e));return r}(t,S);}var F={text:t,x:e,y:n,options:i,mutex:{pdfEscape:lt,activeFontKey:tt,fonts:at,activeFontSize:nt}};st.publish("preProcessText",F), t=F.text;d=(i=F.options).angle, C=this.internal.scaleFactor, this.internal.pageSize.getHeight();var q=[];if(d){d*=Math.PI/180;var E=Math.cos(d),P=Math.sin(d),O=function(t){return t.toFixed(2)};q=[O(E),O(P),O(-1*P),O(E)];}void 0!==(I=i.charSpace)&&(a+=I+" Tc\n");i.lang;var B=-1,j=i.renderingMode||i.stroke,R=this.internal.getCurrentPageInfo().pageContext;switch(j){case 0:case!1:case"fill":B=0;break;case 1:case!0:case"stroke":B=1;break;case 2:case"fillThenStroke":B=2;break;case 3:case"invisible":B=3;break;case 4:case"fillAndAddForClipping":B=4;break;case 5:case"strokeAndAddPathForClipping":B=5;break;case 6:case"fillThenStrokeAndAddToPathForClipping":B=6;break;case 7:case"addToPathForClipping":B=7;}var D=R.usedRenderingMode||-1;-1!==B?a+=B+" Tr\n":-1!==D&&(a+="0 Tr\n"), -1!==B&&(R.usedRenderingMode=B);p=i.align||"left";var M=nt*o,z=this.internal.pageSize.getHeight(),N=this.internal.pageSize.getWidth(),L=(C=this.internal.scaleFactor, _=at[tt], I=i.charSpace||rt, S=i.maxWidth||0, f={}, []);if("[object Array]"===Object.prototype.toString.call(t)){var U,H;v=s(t);"left"!==p&&(H=v.map(function(t){return l(t,{font:_,charSpace:I,fontSize:nt})/C}));var W,V=Math.max.apply(Math,H),G=0;if("right"===p){e-=H[0], t=[];var Y=0;for(b=v.length;Y<b;Y++)V-H[Y], 0===Y?(W=e*C, U=(z-n)*C):(W=(G-H[Y])*C, U=-M), t.push([v[Y],W,U]), G=H[Y];}else if("center"===p){e-=H[0]/2, t=[];for(Y=0, b=v.length;Y<b;Y++)(V-H[Y])/2, 0===Y?(W=e*C, U=(z-n)*C):(W=(G-H[Y])/2*C, U=-M), t.push([v[Y],W,U]), G=H[Y];}else if("left"===p){t=[];for(Y=0, b=v.length;Y<b;Y++)U=0===Y?(z-n)*C:-M, W=0===Y?e*C:0, t.push(v[Y]);}else{if("justify"!==p)throw new Error('Unrecognized alignment option, use "left", "center", "right" or "justify".');t=[];for(S=0!==S?S:N, Y=0, b=v.length;Y<b;Y++)U=0===Y?(z-n)*C:-M, W=0===Y?e*C:0, Y<b-1&&L.push(((S-H[Y])/(v[Y].split(" ").length-1)*C).toFixed(2)), t.push([v[Y],W,U]);}}!0===("boolean"==typeof i.R2L?i.R2L:it)&&(t=c(t,function(t,e,n){return[t.split("").reverse().join(""),e,n]}));F={text:t,x:e,y:n,options:i,mutex:{pdfEscape:lt,activeFontKey:tt,fonts:at,activeFontSize:nt}};st.publish("postProcessText",F), t=F.text, r=F.mutex.isHex;v=s(t);t=[];var X,J,K,Q=0,Z=(b=v.length, "");for(Y=0;Y<b;Y++)Z="", "[object Array]"!==Object.prototype.toString.call(v[Y])?(X=parseFloat(e*C).toFixed(2), J=parseFloat((z-n)*C).toFixed(2), K=(r?"<":"(")+v[Y]+(r?">":")")):"[object Array]"===Object.prototype.toString.call(v[Y])&&(X=parseFloat(v[Y][1]).toFixed(2), J=parseFloat(v[Y][2]).toFixed(2), K=(r?"<":"(")+v[Y][0]+(r?">":")"), Q=1), void 0!==L&&void 0!==L[Y]&&(Z=L[Y]+" Tw\n"), 0!==q.length&&0===Y?t.push(Z+q.join(" ")+" "+X+" "+J+" Tm\n"+K):1===Q||0===Q&&0===Y?t.push(Z+X+" "+J+" Td\n"+K):t.push(Z+K);t=0===Q?t.join(" Tj\nT* "):t.join(" Tj\n"), t+=" Tj\n";var $="BT\n/"+tt+" "+nt+" Tf\n"+(nt*o).toFixed(2)+" TL\n"+et+"\n";return $+=a, $+=t, ct($+="ET"), this}, O.lstext=function(t,e,n,r){console.warn("jsPDF.lstext is deprecated");for(var i=0,o=t.length;i<o;i++, e+=r)this.text(t[i],e,n);return this}, O.line=function(t,e,n,r){return this.lines([[n-t,r-e]],t,e)}, O.clip=function(){ct("W"), ct("S");}, O.clip_fixed=function(t){ct("evenodd"===t?"W*":"W"), ct("n");}, O.lines=function(t,e,n,r,i,o){var a,s,c,l,h,u,f,d,p,g,m;for("number"==typeof t&&(w=n, n=e, e=t, t=w), r=r||[1,1], ct(L(e*y)+" "+L((v-n)*y)+" m "), a=r[0], s=r[1], l=t.length, g=e, m=n, c=0;c<l;c++)2===(h=t[c]).length?(g=h[0]*a+g, m=h[1]*s+m, ct(L(g*y)+" "+L((v-m)*y)+" l")):(u=h[0]*a+g, f=h[1]*s+m, d=h[2]*a+g, p=h[3]*s+m, g=h[4]*a+g, m=h[5]*s+m, ct(L(u*y)+" "+L((v-f)*y)+" "+L(d*y)+" "+L((v-p)*y)+" "+L(g*y)+" "+L((v-m)*y)+" c"));return o&&ct(" h"), null!==i&&ct(Z(i)), this}, O.rect=function(t,e,n,r,i){Z(i);return ct([N(t*y),N((v-e)*y),N(n*y),N(-r*y),"re"].join(" ")), null!==i&&ct(Z(i)), this}, O.triangle=function(t,e,n,r,i,o,a){return this.lines([[n-t,r-e],[i-n,o-r],[t-i,e-o]],t,e,[1,1],a,!0), this}, O.roundedRect=function(t,e,n,r,i,o,a){var s=4/3*(Math.SQRT2-1);return this.lines([[n-2*i,0],[i*s,0,i,o-o*s,i,o],[0,r-2*o],[0,o*s,-i*s,o,-i,o],[2*i-n,0],[-i*s,0,-i,-o*s,-i,-o],[0,2*o-r],[0,-o*s,i*s,-o,i,-o]],t+i,e,[1,1],a), this}, O.ellipse=function(t,e,n,r,i){var o=4/3*(Math.SQRT2-1)*n,a=4/3*(Math.SQRT2-1)*r;return ct([N((t+n)*y),N((v-e)*y),"m",N((t+n)*y),N((v-(e-a))*y),N((t+o)*y),N((v-(e-r))*y),N(t*y),N((v-(e-r))*y),"c"].join(" ")), ct([N((t-o)*y),N((v-(e-r))*y),N((t-n)*y),N((v-(e-a))*y),N((t-n)*y),N((v-e)*y),"c"].join(" ")), ct([N((t-n)*y),N((v-(e+a))*y),N((t-o)*y),N((v-(e+r))*y),N(t*y),N((v-(e+r))*y),"c"].join(" ")), ct([N((t+o)*y),N((v-(e+r))*y),N((t+n)*y),N((v-(e+a))*y),N((t+n)*y),N((v-e)*y),"c"].join(" ")), null!==i&&ct(Z(i)), this}, O.circle=function(t,e,n,r){return this.ellipse(t,e,n,n,r)}, O.setProperties=function(t){for(var e in P)P.hasOwnProperty(e)&&t[e]&&(P[e]=t[e]);return this}, O.setFontSize=function(t){return nt=t, this}, O.setFont=function(t,e){return tt=K(t,e), this}, O.setFontStyle=O.setFontType=function(t){return tt=K(void 0,t), this}, O.getFontList=function(){var t,e,n,r={};for(t in S)if(S.hasOwnProperty(t))for(e in r[t]=n=[], S[t])S[t].hasOwnProperty(e)&&n.push(e);return r}, O.addFont=function(t,e,n,r){Y(t,e,n,r=r||"Identity-H");}, O.setLineWidth=function(t){return ct((t*y).toFixed(2)+" w"), this}, O.setDrawColor=function(t,e,n,r){return ct(j({ch1:t,ch2:e,ch3:n,ch4:r,pdfColorType:"draw",precision:2})), this}, O.setFillColor=function(t,e,n,r){return ct(j({ch1:t,ch2:e,ch3:n,ch4:r,pdfColorType:"fill",precision:2})), this}, O.setTextColor=function(t,e,n,r){return et=j({ch1:t,ch2:e,ch3:n,ch4:r,pdfColorType:"text",precision:3}), this}, O.setCharSpace=function(t){return rt=t, this}, O.setR2L=function(t){return it=t, this}, O.CapJoinStyles={0:0,butt:0,but:0,miter:0,1:1,round:1,rounded:1,circle:1,2:2,projecting:2,project:2,square:2,bevel:2}, O.setLineCap=function(t){var e=this.CapJoinStyles[t];if(void 0===e)throw new Error("Line cap style of '"+t+"' is not recognized. See or extend .CapJoinStyles property for valid styles");return ct((F=e)+" J"), this}, O.setLineJoin=function(t){var e=this.CapJoinStyles[t];if(void 0===e)throw new Error("Line join style of '"+t+"' is not recognized. See or extend .CapJoinStyles property for valid styles");return ct((q=e)+" j"), this}, O.output=ut, O.save=function(t){O.output("save",t);}, wt.API)wt.API.hasOwnProperty(dt)&&("events"===dt&&wt.API.events.length?function(t,e){var n,r,i;for(i=e.length-1;-1!==i;i--)n=e[i][0], r=e[i][1], t.subscribe.apply(t,[n].concat("function"==typeof r?[r]:r));}(st,wt.API.events):O[dt]=wt.API[dt]);return function(){for(var t="helvetica",e="times",n="courier",r="normal",i="bold",o="italic",a="bolditalic",s=[["Helvetica",t,r,"WinAnsiEncoding"],["Helvetica-Bold",t,i,"WinAnsiEncoding"],["Helvetica-Oblique",t,o,"WinAnsiEncoding"],["Helvetica-BoldOblique",t,a,"WinAnsiEncoding"],["Courier",n,r,"WinAnsiEncoding"],["Courier-Bold",n,i,"WinAnsiEncoding"],["Courier-Oblique",n,o,"WinAnsiEncoding"],["Courier-BoldOblique",n,a,"WinAnsiEncoding"],["Times-Roman",e,r,"WinAnsiEncoding"],["Times-Bold",e,i,"WinAnsiEncoding"],["Times-Italic",e,o,"WinAnsiEncoding"],["Times-BoldItalic",e,a,"WinAnsiEncoding"],["ZapfDingbats","zapfdingbats",r,null],["Symbol","symbol",r,null]],c=0,l=s.length;c<l;c++){var h=Y(s[c][0],s[c][1],s[c][2],s[c][3]),u=s[c][0].split("-");G(h,u[0],u[1]||"");}st.publish("addFonts",{fonts:at,dictionary:S});}(), tt="F1", X(n,t), st.publish("initialized"), O}return wt.API={events:[]}, wt.version="0.0.0", "function"==typeof undefined&&undefined.amd?undefined("jsPDF",function(){return wt}):"undefined"!='object'&&module.exports?(module.exports=wt, module.exports.jsPDF=wt):pt.jsPDF=wt, wt}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||"undefined"!=typeof commonjsGlobal&&commonjsGlobal||Function('return typeof this === "object" && this.content')()||Function("return this")());
/** @preserve
   * jsPDF - PDF Document creation from JavaScript
   * Version 1.4.0 Built on 2018-05-21T16:49:19.312Z
   *                           CommitID 48c1917315
   *
   * Copyright (c) 2010-2016 James Hall <james@parall.ax>, https://github.com/MrRio/jsPDF
   *               2010 Aaron Spike, https://github.com/acspike
   *               2012 Willow Systems Corporation, willow-systems.com
   *               2012 Pablo Hess, https://github.com/pablohess
   *               2012 Florian Jenett, https://github.com/fjenett
   *               2013 Warren Weckesser, https://github.com/warrenweckesser
   *               2013 Youssef Beddad, https://github.com/lifof
   *               2013 Lee Driscoll, https://github.com/lsdriscoll
   *               2013 Stefan Slonevskiy, https://github.com/stefslon
   *               2013 Jeremy Morel, https://github.com/jmorel
   *               2013 Christoph Hartmann, https://github.com/chris-rock
   *               2014 Juan Pablo Gaviria, https://github.com/juanpgaviria
   *               2014 James Makes, https://github.com/dollaruw
   *               2014 Diego Casorran, https://github.com/diegocr
   *               2014 Steven Spungin, https://github.com/Flamenco
   *               2014 Kenneth Glassey, https://github.com/Gavvers
   *
   * Licensed under the MIT License
   *
   * Contributor(s):
   *    siefkenj, ahwolf, rickygu, Midnith, saintclair, eaparango,
   *    kim3er, mfo, alnorth, Flamenco
   */
/**
   * jsPDF AcroForm Plugin
   * Copyright (c) 2016 Alexander Weidt, https://github.com/BiggA94
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */
!function(n,t){var h,a,e=1,r=function(t,e){t.prototype=Object.create(e.prototype), t.prototype.constructor=t;},s=function(t){return t*(e/1)},o=function(t,e){return"function"==typeof e.font.metadata.widthOfString?e.font.metadata.widthOfString(t,e.fontSize,e.charSpace):i(function(t,e){var n,r,i,o=(e=e||{}).widths?e.widths:e.font.metadata.Unicode.widths,a=o.fof?o.fof:1,s=e.kerning?e.kerning:e.font.metadata.Unicode.kerning,c=s.fof?s.fof:1,l=0,h=o[0]||a,u=[];for(n=0, r=t.length;n<r;n++)i=t.charCodeAt(n), u.push((o[i]||h)/a+(s[i]&&s[i][l]||0)/c), l=i;return u}(t,e))*e.fontSize};var i=function(t){for(var e=t.length,n=0;e;)n+=t[--e];return n},c=function(t){var e=new T,n=U.internal.getHeight(t)||0,r=U.internal.getWidth(t)||0;return e.BBox=[0,0,r.toFixed(2),n.toFixed(2)], e},l=function(t,e,n){t=t||0;var r=1;if(r<<=e-1, 1==(n=n||1))t=t|r;else t=t&~r;return t},u=function(t,e,n){n=n||1.3, t=t||0;return 1==e.readOnly&&(t=l(t,1)), 1==e.required&&(t=l(t,2)), 1==e.noExport&&(t=l(t,3)), 1==e.multiline&&(t=l(t,13)), e.password&&(t=l(t,14)), e.noToggleToOff&&(t=l(t,15)), e.radio&&(t=l(t,16)), e.pushbutton&&(t=l(t,17)), e.combo&&(t=l(t,18)), e.edit&&(t=l(t,19)), e.sort&&(t=l(t,20)), e.fileSelect&&1.4<=n&&(t=l(t,21)), e.multiSelect&&1.4<=n&&(t=l(t,22)), e.doNotSpellCheck&&1.4<=n&&(t=l(t,23)), 1==e.doNotScroll&&1.4<=n&&(t=l(t,24)), e.richText&&1.4<=n&&(t=l(t,25)), t},f=function(t){var e=t[0],n=t[1],r=t[2],i=t[3],o={};return Array.isArray(e)?(e[0]=s(e[0]), e[1]=s(e[1]), e[2]=s(e[2]), e[3]=s(e[3])):(e=s(e), n=s(n), r=s(r), i=s(i)), o.lowerLeft_X=e||0, o.lowerLeft_Y=s(a)-n-i||0, o.upperRight_X=e+r||0, o.upperRight_Y=s(a)-n||0, [o.lowerLeft_X.toFixed(2),o.lowerLeft_Y.toFixed(2),o.upperRight_X.toFixed(2),o.upperRight_Y.toFixed(2)]},d=function(t){if(t.appearanceStreamContent)return t.appearanceStreamContent;if(t.V||t.DV){var e=[],n=t.V||t.DV,r=p(t,n);e.push("/Tx BMC"), e.push("q"), e.push("/F1 "+r.fontSize.toFixed(2)+" Tf"), e.push("1 0 0 1 0 0 Tm"), e.push("BT"), e.push(r.text), e.push("ET"), e.push("Q"), e.push("EMC");var i=new c(t);return i.stream=e.join("\n"), i}},p=function(t,e,i,n){n=n||12, i=i||"helvetica";var r={text:"",fontSize:""},o=(e=")"==(e="("==e.substr(0,1)?e.substr(1):e).substr(e.length-1)?e.substr(0,e.length-1):e).split(" "),a=n,s=U.internal.getHeight(t)||0;s=s<0?-s:s;var c=U.internal.getWidth(t)||0;c=c<0?-c:c;var l=function(t,e,n){if(t+1<o.length){var r=e+" "+o[t+1];return C(r,n+"px",i).width<=c-4}return!1};a++;t:for(;;){e="";var h=C("3",--a+"px",i).height,u=t.multiline?s-a:(s-h)/2,f=-2,d=u+=2,p=0,g=0,m=0;if(a<=0){a=12, e="(...) Tj\n", e+="% Width of Text: "+C(e,"1px").width+", FieldWidth:"+c+"\n";break}m=C(o[0]+" ",a+"px",i).width;var y="",w=0;for(var v in o){y=" "==(y+=o[v]+" ").substr(y.length-1)?y.substr(0,y.length-1):y;var b=parseInt(v);m=C(y+" ",a+"px",i).width;var x=l(b,y,a),S=v>=o.length-1;if(!x||S){if(x||S){if(S)g=b;else if(t.multiline&&s<(h+2)*(w+2)+2)continue t}else{if(!t.multiline)continue t;if(s<(h+2)*(w+2)+2)continue t;g=b;}for(var k="",_=p;_<=g;_++)k+=o[_]+" ";switch(k=" "==k.substr(k.length-1)?k.substr(0,k.length-1):k, m=C(k,a+"px",i).width, t.Q){case 2:f=c-m-2;break;case 1:f=(c-m)/2;break;case 0:default:f=2;}e+=f.toFixed(2)+" "+d.toFixed(2)+" Td\n", e+="("+k+") Tj\n", e+=-f.toFixed(2)+" 0 Td\n", d=-(a+2), m=0, p=g+1, w++, y="";}else y+=" ";}break}return r.text=e, r.fontSize=a, r},C=function(t,e,n){n=n||"helvetica";var r=h.internal.getFont(n),i=o(t,{font:r,fontSize:parseFloat(e),charSpace:0});return{height:1.5*o("3",{font:r,fontSize:parseFloat(e),charSpace:0}),width:i}},g={fields:[],xForms:[],acroFormDictionaryRoot:null,printedOut:!1,internal:null,isInitialized:!1},m=function(){for(var t in h.internal.acroformPlugin.acroFormDictionaryRoot.Fields){var e=h.internal.acroformPlugin.acroFormDictionaryRoot.Fields[t];e.hasAnnotation&&w.call(h,e);}},y=function(t){h.internal.acroformPlugin.printedOut&&(h.internal.acroformPlugin.printedOut=!1, h.internal.acroformPlugin.acroFormDictionaryRoot=null), h.internal.acroformPlugin.acroFormDictionaryRoot||k.call(h), h.internal.acroformPlugin.acroFormDictionaryRoot.Fields.push(t);},w=function(t){var e={type:"reference",object:t};h.annotationPlugin.annotations[h.internal.getPageInfo(t.page).pageNumber].push(e);},v=function(){void 0!==h.internal.acroformPlugin.acroFormDictionaryRoot?h.internal.write("/AcroForm "+h.internal.acroformPlugin.acroFormDictionaryRoot.objId+" 0 R"):console.log("Root missing...");},b=function(){h.internal.events.unsubscribe(h.internal.acroformPlugin.acroFormDictionaryRoot._eventID), delete h.internal.acroformPlugin.acroFormDictionaryRoot._eventID, h.internal.acroformPlugin.printedOut=!0;},x=function(t){var e=!t;t||(h.internal.newObjectDeferredBegin(h.internal.acroformPlugin.acroFormDictionaryRoot.objId), h.internal.out(h.internal.acroformPlugin.acroFormDictionaryRoot.getString()));t=t||h.internal.acroformPlugin.acroFormDictionaryRoot.Kids;for(var n in t){var r=t[n],i=r.Rect;r.Rect&&(r.Rect=f.call(this,r.Rect)), h.internal.newObjectDeferredBegin(r.objId);var o=r.objId+" 0 obj\n<<\n";if("object"===(void 0===r?"undefined":vt(r))&&"function"==typeof r.getContent&&(o+=r.getContent()), r.Rect=i, r.hasAppearanceStream&&!r.appearanceStreamContent){var a=d.call(this,r);o+="/AP << /N "+a+" >>\n", h.internal.acroformPlugin.xForms.push(a);}if(r.appearanceStreamContent){for(var s in o+="/AP << ", r.appearanceStreamContent){var c=r.appearanceStreamContent[s];if(o+="/"+s+" ", o+="<< ", 1<=Object.keys(c).length||Array.isArray(c))for(var n in c){var l;"function"==typeof(l=c[n])&&(l=l.call(this,r)), o+="/"+n+" "+l+" ", 0<=h.internal.acroformPlugin.xForms.indexOf(l)||h.internal.acroformPlugin.xForms.push(l);}else"function"==typeof(l=c)&&(l=l.call(this,r)), o+="/"+n+" "+l+" \n", 0<=h.internal.acroformPlugin.xForms.indexOf(l)||h.internal.acroformPlugin.xForms.push(l);o+=" >>\n";}o+=">>\n";}o+=">>\nendobj\n", h.internal.out(o);}e&&S.call(this,h.internal.acroformPlugin.xForms);},S=function(t){for(var e in t){var n=e,r=t[e];h.internal.newObjectDeferredBegin(r&&r.objId);var i="";"object"===(void 0===r?"undefined":vt(r))&&"function"==typeof r.getString&&(i=r.getString()), h.internal.out(i), delete t[n];}},k=function(){if(void 0!==this.internal&&(void 0===this.internal.acroformPlugin||!1===this.internal.acroformPlugin.isInitialized)){if(h=this, q.FieldNum=0, this.internal.acroformPlugin=JSON.parse(JSON.stringify(g)), this.internal.acroformPlugin.acroFormDictionaryRoot)throw new Error("Exception while creating AcroformDictionary");e=h.internal.scaleFactor, a=h.internal.pageSize.getHeight(), h.internal.acroformPlugin.acroFormDictionaryRoot=new F, h.internal.acroformPlugin.acroFormDictionaryRoot._eventID=h.internal.events.subscribe("postPutResources",b), h.internal.events.subscribe("buildDocument",m), h.internal.events.subscribe("putCatalog",v), h.internal.events.subscribe("postPutPages",x), h.internal.acroformPlugin.isInitialized=!0;}},_=function(t){if(Array.isArray(t)){var e=" [";for(var n in t){e+=t[n].toString(), e+=n<t.length-1?" ":"";}return e+="]"}},I=function(t){return 0!==(t=t||"").indexOf("(")&&(t="("+t), ")"!=t.substring(t.length-1)&&(t+=")"), t},A=function(){var t;Object.defineProperty(this,"objId",{get:function(){return t||(t=h.internal.newObjectDeferred()), t||console.log("Couldn't create Object ID"), t},configurable:!1});};A.prototype.toString=function(){return this.objId+" 0 R"}, A.prototype.getString=function(){var t=this.objId+" 0 obj\n<<";return t+=this.getContent()+">>\n", this.stream&&(t+="stream\n", t+=this.stream, t+="\nendstream\n"), t+="endobj\n"}, A.prototype.getContent=function(){var t="";return t+=function(t){var e="",n=Object.keys(t).filter(function(t){return"content"!=t&&"appearanceStreamContent"!=t&&"_"!=t.substring(0,1)});for(var r in n){var i=n[r],o=t[i];o&&(Array.isArray(o)?e+="/"+i+" "+_(o)+"\n":e+=o instanceof A?"/"+i+" "+o.objId+" 0 R\n":"/"+i+" "+o+"\n");}return e}(this)};var T=function(){var e;A.call(this), this.Type="/XObject", this.Subtype="/Form", this.FormType=1, this.BBox, this.Matrix, this.Resources="2 0 R", this.PieceInfo, Object.defineProperty(this,"Length",{enumerable:!0,get:function(){return void 0!==e?e.length:0}}), Object.defineProperty(this,"stream",{enumerable:!1,set:function(t){e=t.trim();},get:function(){return e||null}});};r(T,A);var F=function(){A.call(this);var t=[];Object.defineProperty(this,"Kids",{enumerable:!1,configurable:!0,get:function(){return 0<t.length?t:void 0}}), Object.defineProperty(this,"Fields",{enumerable:!0,configurable:!0,get:function(){return t}}), this.DA;};r(F,A);var q=function t(){var e;A.call(this), Object.defineProperty(this,"Rect",{enumerable:!0,configurable:!1,get:function(){if(e)return e},set:function(t){e=t;}});var n,r,i,o,a="";Object.defineProperty(this,"FT",{enumerable:!0,set:function(t){a=t;},get:function(){return a}}), Object.defineProperty(this,"T",{enumerable:!0,configurable:!1,set:function(t){n=t;},get:function(){if(!n||n.length<1){if(this instanceof M)return;return"(FieldObject"+t.FieldNum+++")"}return"("==n.substring(0,1)&&n.substring(n.length-1)?n:"("+n+")"}}), Object.defineProperty(this,"DA",{enumerable:!0,get:function(){if(r)return"("+r+")"},set:function(t){r=t;}}), Object.defineProperty(this,"DV",{enumerable:!0,configurable:!0,get:function(){if(i)return i},set:function(t){i=t;}}), Object.defineProperty(this,"V",{enumerable:!0,configurable:!0,get:function(){if(o)return o},set:function(t){o=t;}}), Object.defineProperty(this,"Type",{enumerable:!0,get:function(){return this.hasAnnotation?"/Annot":null}}), Object.defineProperty(this,"Subtype",{enumerable:!0,get:function(){return this.hasAnnotation?"/Widget":null}}), this.BG, Object.defineProperty(this,"hasAnnotation",{enumerable:!1,get:function(){return!!(this.Rect||this.BC||this.BG)}}), Object.defineProperty(this,"hasAppearanceStream",{enumerable:!1,configurable:!0,writable:!0}), Object.defineProperty(this,"page",{enumerable:!1,configurable:!0,writable:!0});};r(q,A);var E=function(){q.call(this), this.FT="/Ch", this.Opt=[], this.V="()", this.TI=0;var e=!1;Object.defineProperty(this,"combo",{enumerable:!1,get:function(){return e},set:function(t){e=t;}}), Object.defineProperty(this,"edit",{enumerable:!0,set:function(t){1==t?(this._edit=!0, this.combo=!0):this._edit=!1;},get:function(){return!!this._edit&&this._edit},configurable:!1}), this.hasAppearanceStream=!0;};r(E,q);var P=function(){E.call(this), this.combo=!1;};r(P,E);var O=function(){P.call(this), this.combo=!0;};r(O,P);var B=function(){O.call(this), this.edit=!0;};r(B,O);var j=function(){q.call(this), this.FT="/Btn";};r(j,q);var R=function(){j.call(this);var e=!0;Object.defineProperty(this,"pushbutton",{enumerable:!1,get:function(){return e},set:function(t){e=t;}});};r(R,j);var D=function(){j.call(this);var e=!0;Object.defineProperty(this,"radio",{enumerable:!1,get:function(){return e},set:function(t){e=t;}});var n,t=[];Object.defineProperty(this,"Kids",{enumerable:!0,get:function(){if(0<t.length)return t}}), Object.defineProperty(this,"__Kids",{get:function(){return t}}), Object.defineProperty(this,"noToggleToOff",{enumerable:!1,get:function(){return n},set:function(t){n=t;}});};r(D,j);var M=function(t,e){q.call(this), this.Parent=t, this._AppearanceType=U.RadioButton.Circle, this.appearanceStreamContent=this._AppearanceType.createAppearanceStream(e), this.F=l(this.F,3,1), this.MK=this._AppearanceType.createMK(), this.AS="/Off", this._Name=e;};r(M,q), D.prototype.setAppearance=function(t){if("createAppearanceStream"in t&&"createMK"in t)for(var e in this.__Kids){var n=this.__Kids[e];n.appearanceStreamContent=t.createAppearanceStream(n._Name), n.MK=t.createMK();}else console.log("Couldn't assign Appearance to RadioButton. Appearance was Invalid!");}, D.prototype.createOption=function(t){this.__Kids.length;var e=new M(this,t);return this.__Kids.push(e), n.addField(e), e};var z=function(){j.call(this), this.appearanceStreamContent=U.CheckBox.createAppearanceStream(), this.MK=U.CheckBox.createMK(), this.AS="/On", this.V="/On";};r(z,j);var N=function(){var e,n;q.call(this), this.DA=U.createDefaultAppearanceStream(), this.F=4, Object.defineProperty(this,"V",{get:function(){return e?I(e):e},enumerable:!0,set:function(t){e=t;}}), Object.defineProperty(this,"DV",{get:function(){return n?I(n):n},enumerable:!0,set:function(t){n=t;}});var r=!1;Object.defineProperty(this,"multiline",{enumerable:!1,get:function(){return r},set:function(t){r=t;}});var i=!1;Object.defineProperty(this,"fileSelect",{enumerable:!1,get:function(){return i},set:function(t){i=t;}});var o=!1;Object.defineProperty(this,"doNotSpellCheck",{enumerable:!1,get:function(){return o},set:function(t){o=t;}});var a=!1;Object.defineProperty(this,"doNotScroll",{enumerable:!1,get:function(){return a},set:function(t){a=t;}});var s=!1;Object.defineProperty(this,"MaxLen",{enumerable:!0,get:function(){return s},set:function(t){s=t;}}), Object.defineProperty(this,"hasAppearanceStream",{enumerable:!1,get:function(){return this.V||this.DV}});};r(N,q);var L=function(){N.call(this);var e=!0;Object.defineProperty(this,"password",{enumerable:!1,get:function(){return e},set:function(t){e=t;}});};r(L,N);var U={CheckBox:{createAppearanceStream:function(){return{N:{On:U.CheckBox.YesNormal},D:{On:U.CheckBox.YesPushDown,Off:U.CheckBox.OffPushDown}}},createMK:function(){return"<< /CA (3)>>"},YesPushDown:function(t){var e=c(t),n=[],r=h.internal.getFont("zapfdingbats","normal").id;t.Q=1;var i=p(t,"3","ZapfDingbats",50);return n.push("0.749023 g"), n.push("0 0 "+U.internal.getWidth(t).toFixed(2)+" "+U.internal.getHeight(t).toFixed(2)+" re"), n.push("f"), n.push("BMC"), n.push("q"), n.push("0 0 1 rg"), n.push("/"+r+" "+i.fontSize.toFixed(2)+" Tf 0 g"), n.push("BT"), n.push(i.text), n.push("ET"), n.push("Q"), n.push("EMC"), e.stream=n.join("\n"), e},YesNormal:function(t){var e=c(t),n=h.internal.getFont("zapfdingbats","normal").id,r=[];t.Q=1;var i=U.internal.getHeight(t),o=U.internal.getWidth(t),a=p(t,"3","ZapfDingbats",.9*i);return r.push("1 g"), r.push("0 0 "+o.toFixed(2)+" "+i.toFixed(2)+" re"), r.push("f"), r.push("q"), r.push("0 0 1 rg"), r.push("0 0 "+(o-1).toFixed(2)+" "+(i-1).toFixed(2)+" re"), r.push("W"), r.push("n"), r.push("0 g"), r.push("BT"), r.push("/"+n+" "+a.fontSize.toFixed(2)+" Tf 0 g"), r.push(a.text), r.push("ET"), r.push("Q"), e.stream=r.join("\n"), e},OffPushDown:function(t){var e=c(t),n=[];return n.push("0.749023 g"), n.push("0 0 "+U.internal.getWidth(t).toFixed(2)+" "+U.internal.getHeight(t).toFixed(2)+" re"), n.push("f"), e.stream=n.join("\n"), e}},RadioButton:{Circle:{createAppearanceStream:function(t){var e={D:{Off:U.RadioButton.Circle.OffPushDown},N:{}};return e.N[t]=U.RadioButton.Circle.YesNormal, e.D[t]=U.RadioButton.Circle.YesPushDown, e},createMK:function(){return"<< /CA (l)>>"},YesNormal:function(t){var e=c(t),n=[],r=U.internal.getWidth(t)<=U.internal.getHeight(t)?U.internal.getWidth(t)/4:U.internal.getHeight(t)/4;r*=.9;var i=U.internal.Bezier_C;return n.push("q"), n.push("1 0 0 1 "+U.internal.getWidth(t)/2+" "+U.internal.getHeight(t)/2+" cm"), n.push(r+" 0 m"), n.push(r+" "+r*i+" "+r*i+" "+r+" 0 "+r+" c"), n.push("-"+r*i+" "+r+" -"+r+" "+r*i+" -"+r+" 0 c"), n.push("-"+r+" -"+r*i+" -"+r*i+" -"+r+" 0 -"+r+" c"), n.push(r*i+" -"+r+" "+r+" -"+r*i+" "+r+" 0 c"), n.push("f"), n.push("Q"), e.stream=n.join("\n"), e},YesPushDown:function(t){var e=c(t),n=[],r=U.internal.getWidth(t)<=U.internal.getHeight(t)?U.internal.getWidth(t)/4:U.internal.getHeight(t)/4,i=2*(r*=.9),o=i*U.internal.Bezier_C,a=r*U.internal.Bezier_C;return n.push("0.749023 g"), n.push("q"), n.push("1 0 0 1 "+(U.internal.getWidth(t)/2).toFixed(2)+" "+(U.internal.getHeight(t)/2).toFixed(2)+" cm"), n.push(i+" 0 m"), n.push(i+" "+o+" "+o+" "+i+" 0 "+i+" c"), n.push("-"+o+" "+i+" -"+i+" "+o+" -"+i+" 0 c"), n.push("-"+i+" -"+o+" -"+o+" -"+i+" 0 -"+i+" c"), n.push(o+" -"+i+" "+i+" -"+o+" "+i+" 0 c"), n.push("f"), n.push("Q"), n.push("0 g"), n.push("q"), n.push("1 0 0 1 "+(U.internal.getWidth(t)/2).toFixed(2)+" "+(U.internal.getHeight(t)/2).toFixed(2)+" cm"), n.push(r+" 0 m"), n.push(r+" "+a+" "+a+" "+r+" 0 "+r+" c"), n.push("-"+a+" "+r+" -"+r+" "+a+" -"+r+" 0 c"), n.push("-"+r+" -"+a+" -"+a+" -"+r+" 0 -"+r+" c"), n.push(a+" -"+r+" "+r+" -"+a+" "+r+" 0 c"), n.push("f"), n.push("Q"), e.stream=n.join("\n"), e},OffPushDown:function(t){var e=c(t),n=[],r=U.internal.getWidth(t)<=U.internal.getHeight(t)?U.internal.getWidth(t)/4:U.internal.getHeight(t)/4,i=2*(r*=.9),o=i*U.internal.Bezier_C;return n.push("0.749023 g"), n.push("q"), n.push("1 0 0 1 "+(U.internal.getWidth(t)/2).toFixed(2)+" "+(U.internal.getHeight(t)/2).toFixed(2)+" cm"), n.push(i+" 0 m"), n.push(i+" "+o+" "+o+" "+i+" 0 "+i+" c"), n.push("-"+o+" "+i+" -"+i+" "+o+" -"+i+" 0 c"), n.push("-"+i+" -"+o+" -"+o+" -"+i+" 0 -"+i+" c"), n.push(o+" -"+i+" "+i+" -"+o+" "+i+" 0 c"), n.push("f"), n.push("Q"), e.stream=n.join("\n"), e}},Cross:{createAppearanceStream:function(t){var e={D:{Off:U.RadioButton.Cross.OffPushDown},N:{}};return e.N[t]=U.RadioButton.Cross.YesNormal, e.D[t]=U.RadioButton.Cross.YesPushDown, e},createMK:function(){return"<< /CA (8)>>"},YesNormal:function(t){var e=c(t),n=[],r=U.internal.calculateCross(t);return n.push("q"), n.push("1 1 "+(U.internal.getWidth(t)-2).toFixed(2)+" "+(U.internal.getHeight(t)-2).toFixed(2)+" re"), n.push("W"), n.push("n"), n.push(r.x1.x.toFixed(2)+" "+r.x1.y.toFixed(2)+" m"), n.push(r.x2.x.toFixed(2)+" "+r.x2.y.toFixed(2)+" l"), n.push(r.x4.x.toFixed(2)+" "+r.x4.y.toFixed(2)+" m"), n.push(r.x3.x.toFixed(2)+" "+r.x3.y.toFixed(2)+" l"), n.push("s"), n.push("Q"), e.stream=n.join("\n"), e},YesPushDown:function(t){var e=c(t),n=U.internal.calculateCross(t),r=[];return r.push("0.749023 g"), r.push("0 0 "+U.internal.getWidth(t).toFixed(2)+" "+U.internal.getHeight(t).toFixed(2)+" re"), r.push("f"), r.push("q"), r.push("1 1 "+(U.internal.getWidth(t)-2).toFixed(2)+" "+(U.internal.getHeight(t)-2).toFixed(2)+" re"), r.push("W"), r.push("n"), r.push(n.x1.x.toFixed(2)+" "+n.x1.y.toFixed(2)+" m"), r.push(n.x2.x.toFixed(2)+" "+n.x2.y.toFixed(2)+" l"), r.push(n.x4.x.toFixed(2)+" "+n.x4.y.toFixed(2)+" m"), r.push(n.x3.x.toFixed(2)+" "+n.x3.y.toFixed(2)+" l"), r.push("s"), r.push("Q"), e.stream=r.join("\n"), e},OffPushDown:function(t){var e=c(t),n=[];return n.push("0.749023 g"), n.push("0 0 "+U.internal.getWidth(t).toFixed(2)+" "+U.internal.getHeight(t).toFixed(2)+" re"), n.push("f"), e.stream=n.join("\n"), e}}},createDefaultAppearanceStream:function(t){return"/F1 0 Tf 0 g"}};U.internal={Bezier_C:.551915024494,calculateCross:function(t){var e,n,r=U.internal.getWidth(t),i=U.internal.getHeight(t),o=(n=i)<(e=r)?n:e;return{x1:{x:(r-o)/2,y:(i-o)/2+o},x2:{x:(r-o)/2+o,y:(i-o)/2},x3:{x:(r-o)/2,y:(i-o)/2},x4:{x:(r-o)/2+o,y:(i-o)/2+o}}}}, U.internal.getWidth=function(t){var e=0;return"object"===(void 0===t?"undefined":vt(t))&&(e=s(t.Rect[2])), e}, U.internal.getHeight=function(t){var e=0;return"object"===(void 0===t?"undefined":vt(t))&&(e=s(t.Rect[3])), e}, n.addField=function(t){return k.call(this), t instanceof N?this.addTextField.call(this,t):t instanceof E?this.addChoiceField.call(this,t):t instanceof j?this.addButton.call(this,t):t instanceof M?y.call(this,t):t&&y.call(this,t), t.page=h.internal.getCurrentPageInfo().pageNumber, this}, n.addButton=function(t){k.call(this);var e=t||new q;e.FT="/Btn", e.Ff=u(e.Ff,t,h.internal.getPDFVersion()), y.call(this,e);}, n.addTextField=function(t){k.call(this);var e=t||new q;e.FT="/Tx", e.Ff=u(e.Ff,t,h.internal.getPDFVersion()), y.call(this,e);}, n.addChoiceField=function(t){k.call(this);var e=t||new q;e.FT="/Ch", e.Ff=u(e.Ff,t,h.internal.getPDFVersion()), y.call(this,e);}, "object"==(void 0===t?"undefined":vt(t))&&(t.ChoiceField=E, t.ListBox=P, t.ComboBox=O, t.EditBox=B, t.Button=j, t.PushButton=R, t.RadioButton=D, t.CheckBox=z, t.TextField=N, t.PasswordField=L, t.AcroForm={Appearance:U});}(K.API,"undefined"!=typeof window&&window||"undefined"!=typeof commonjsGlobal&&commonjsGlobal), K.API.addHTML=function(t,p,g,s,m){if("undefined"==typeof html2canvas&&"undefined"==typeof rasterizeHTML)throw new Error("You need either https://github.com/niklasvh/html2canvas or https://github.com/cburgmer/rasterizeHTML.js");"number"!=typeof p&&(s=p, m=g), "function"==typeof s&&(m=s, s=null), "function"!=typeof m&&(m=function(){});var e=this.internal,y=e.scaleFactor,w=e.pageSize.getWidth(),v=e.pageSize.getHeight();if((s=s||{}).onrendered=function(c){p=parseInt(p)||0, g=parseInt(g)||0;var t=s.dim||{},l=Object.assign({top:0,right:0,bottom:0,left:0,useFor:"content"},s.margin),e=t.h||Math.min(v,c.height/y),h=t.w||Math.min(w,c.width/y)-p,u=s.format||"JPEG",f=s.imageCompression||"SLOW";if(c.height>v-l.top-l.bottom&&s.pagesplit){var d=function(t,e,n,r,i){var o=document.createElement("canvas");o.height=i, o.width=r;var a=o.getContext("2d");return a.mozImageSmoothingEnabled=!1, a.webkitImageSmoothingEnabled=!1, a.msImageSmoothingEnabled=!1, a.imageSmoothingEnabled=!1, a.fillStyle=s.backgroundColor||"#ffffff", a.fillRect(0,0,r,i), a.drawImage(t,e,n,r,i,0,0,r,i), o},n=function(){for(var t,e,n=0,r=0,i={},o=!1;;){var a;if(r=0, i.top=0!==n?l.top:g, i.left=0!==n?l.left:p, o=(w-l.left-l.right)*y<c.width, "content"===l.useFor?0===n?(t=Math.min((w-l.left)*y,c.width), e=Math.min((v-l.top)*y,c.height-n)):(t=Math.min(w*y,c.width), e=Math.min(v*y,c.height-n), i.top=0):(t=Math.min((w-l.left-l.right)*y,c.width), e=Math.min((v-l.bottom-l.top)*y,c.height-n)), o)for(;;){"content"===l.useFor&&(0===r?t=Math.min((w-l.left)*y,c.width):(t=Math.min(w*y,c.width-r), i.left=0));var s=[a=d(c,r,n,t,e),i.left,i.top,a.width/y,a.height/y,u,null,f];if(this.addImage.apply(this,s), (r+=t)>=c.width)break;this.addPage();}else s=[a=d(c,0,n,t,e),i.left,i.top,a.width/y,a.height/y,u,null,f], this.addImage.apply(this,s);if((n+=e)>=c.height)break;this.addPage();}m(h,n,null,s);}.bind(this);if("CANVAS"===c.nodeName){var r=new Image;r.onload=n, r.src=c.toDataURL("image/png"), c=r;}else n();}else{var i=Math.random().toString(35),o=[c,p,g,h,e,u,i,f];this.addImage.apply(this,o), m(h,e,i,o);}}.bind(this), "undefined"!=typeof html2canvas&&!s.rstz)return html2canvas(t,s);if("undefined"!=typeof rasterizeHTML){var n="drawDocument";return"string"==typeof t&&(n=/^http/.test(t)?"drawURL":"drawHTML"), s.width=s.width||w*y, rasterizeHTML[n](t,void 0,s).then(function(t){s.onrendered(t.image);},function(t){m(null,t);})}return null}, function(b){var x="addImage_",s={PNG:[[137,80,78,71]],TIFF:[[77,77,0,42],[73,73,42,0]],JPEG:[[255,216,255,224,void 0,void 0,74,70,73,70,0],[255,216,255,225,void 0,void 0,69,120,105,102,0,0]],JPEG2000:[[0,0,0,12,106,80,32,32]],GIF87a:[[71,73,70,56,55,97]],GIF89a:[[71,73,70,56,57,97]],BMP:[[66,77],[66,65],[67,73],[67,80],[73,67],[80,84]]};b.getImageFileTypeByImageData=function(t){var e,n,r,i,o,a="UNKNOWN";for(o in s)for(r=s[o], e=0;e<r.length;e+=1){for(i=!0, n=0;n<r[e].length;n+=1)if(void 0!==r[e][n]&&r[e][n]!==t.charCodeAt(n)){i=!1;break}if(!0===i){a=o;break}}return a};var n=function t(e){var n=this.internal.newObject(),r=this.internal.write,i=this.internal.putStream;if(e.n=n, r("<</Type /XObject"), r("/Subtype /Image"), r("/Width "+e.w), r("/Height "+e.h), e.cs===this.color_spaces.INDEXED?r("/ColorSpace [/Indexed /DeviceRGB "+(e.pal.length/3-1)+" "+("smask"in e?n+2:n+1)+" 0 R]"):(r("/ColorSpace /"+e.cs), e.cs===this.color_spaces.DEVICE_CMYK&&r("/Decode [1 0 1 0 1 0 1 0]")), r("/BitsPerComponent "+e.bpc), "f"in e&&r("/Filter /"+e.f), "dp"in e&&r("/DecodeParms <<"+e.dp+">>"), "trns"in e&&e.trns.constructor==Array){for(var o="",a=0,s=e.trns.length;a<s;a++)o+=e.trns[a]+" "+e.trns[a]+" ";r("/Mask ["+o+"]");}if("smask"in e&&r("/SMask "+(n+1)+" 0 R"), r("/Length "+e.data.length+">>"), i(e.data), r("endobj"), "smask"in e){var c="/Predictor "+e.p+" /Colors 1 /BitsPerComponent "+e.bpc+" /Columns "+e.w,l={w:e.w,h:e.h,cs:"DeviceGray",bpc:e.bpc,dp:c,data:e.smask};"f"in e&&(l.f=e.f), t.call(this,l);}e.cs===this.color_spaces.INDEXED&&(this.internal.newObject(), r("<< /Length "+e.pal.length+">>"), i(this.arrayBufferToBinaryString(new Uint8Array(e.pal))), r("endobj"));},S=function(){var t=this.internal.collections[x+"images"];for(var e in t)n.call(this,t[e]);},k=function(){var t,e=this.internal.collections[x+"images"],n=this.internal.write;for(var r in e)n("/I"+(t=e[r]).i,t.n,"0","R");},_=function(t){return"function"==typeof b["process"+t.toUpperCase()]},C=function(t){return"object"===(void 0===t?"undefined":vt(t))&&1===t.nodeType},I=function(t,e){if("IMG"===t.nodeName&&t.hasAttribute("src")){var n=""+t.getAttribute("src");if(0===n.indexOf("data:image/"))return n;!e&&/\.png(?:[?#].*)?$/i.test(n)&&(e="png");}if("CANVAS"===t.nodeName)var r=t;else{(r=document.createElement("canvas")).width=t.clientWidth||t.width, r.height=t.clientHeight||t.height;var i=r.getContext("2d");if(!i)throw"addImage requires canvas to be supported by browser.";i.drawImage(t,0,0,r.width,r.height);}return r.toDataURL("png"==(""+e).toLowerCase()?"image/png":"image/jpeg")},A=function(t,e){var n;if(e)for(var r in e)if(t===e[r].alias){n=e[r];break}return n};b.color_spaces={DEVICE_RGB:"DeviceRGB",DEVICE_GRAY:"DeviceGray",DEVICE_CMYK:"DeviceCMYK",CAL_GREY:"CalGray",CAL_RGB:"CalRGB",LAB:"Lab",ICC_BASED:"ICCBased",INDEXED:"Indexed",PATTERN:"Pattern",SEPARATION:"Separation",DEVICE_N:"DeviceN"}, b.decode={DCT_DECODE:"DCTDecode",FLATE_DECODE:"FlateDecode",LZW_DECODE:"LZWDecode",JPX_DECODE:"JPXDecode",JBIG2_DECODE:"JBIG2Decode",ASCII85_DECODE:"ASCII85Decode",ASCII_HEX_DECODE:"ASCIIHexDecode",RUN_LENGTH_DECODE:"RunLengthDecode",CCITT_FAX_DECODE:"CCITTFaxDecode"}, b.image_compression={NONE:"NONE",FAST:"FAST",MEDIUM:"MEDIUM",SLOW:"SLOW"}, b.sHashCode=function(t){return t=t||"", Array.prototype.reduce&&t.split("").reduce(function(t,e){return(t=(t<<5)-t+e.charCodeAt(0))&t},0)}, b.isString=function(t){return"string"==typeof t}, b.validateStringAsBase64=function(t){return t=t||"", new RegExp("(?:^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$)").test(t)}, b.extractInfoFromBase64DataURI=function(t){return/^data:([\w]+?\/([\w]+?));base64,(.+?)$/g.exec(t)}, b.supportsArrayBuffer=function(){return"undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array}, b.isArrayBuffer=function(t){return!!this.supportsArrayBuffer()&&t instanceof ArrayBuffer}, b.isArrayBufferView=function(t){return!!this.supportsArrayBuffer()&&("undefined"!=typeof Uint32Array&&(t instanceof Int8Array||t instanceof Uint8Array||"undefined"!=typeof Uint8ClampedArray&&t instanceof Uint8ClampedArray||t instanceof Int16Array||t instanceof Uint16Array||t instanceof Int32Array||t instanceof Uint32Array||t instanceof Float32Array||t instanceof Float64Array))}, b.binaryStringToUint8Array=function(t){for(var e=t.length,n=new Uint8Array(e),r=0;r<e;r++)n[r]=t.charCodeAt(r);return n}, b.arrayBufferToBinaryString=function(t){if("function"==typeof atob)return atob(this.arrayBufferToBase64(t));if("function"==typeof TextDecoder){var e=new TextDecoder("ascii");if("ascii"===e.encoding)return e.decode(t)}for(var n=this.isArrayBuffer(t)?t:new Uint8Array(t),r=20480,i="",o=Math.ceil(n.byteLength/r),a=0;a<o;a++)i+=String.fromCharCode.apply(null,n.slice(a*r,a*r+r));return i}, b.arrayBufferToBase64=function(t){for(var e,n="",r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",i=new Uint8Array(t),o=i.byteLength,a=o%3,s=o-a,c=0;c<s;c+=3)n+=r[(16515072&(e=i[c]<<16|i[c+1]<<8|i[c+2]))>>18]+r[(258048&e)>>12]+r[(4032&e)>>6]+r[63&e];return 1==a?n+=r[(252&(e=i[s]))>>2]+r[(3&e)<<4]+"==":2==a&&(n+=r[(64512&(e=i[s]<<8|i[s+1]))>>10]+r[(1008&e)>>4]+r[(15&e)<<2]+"="), n}, b.createImageInfo=function(t,e,n,r,i,o,a,s,c,l,h,u,f){var d={alias:s,w:e,h:n,cs:r,bpc:i,i:a,data:t};return o&&(d.f=o), c&&(d.dp=c), l&&(d.trns=l), h&&(d.pal=h), u&&(d.smask=u), f&&(d.p=f), d}, b.addImage=function(t,e,n,r,i,o,a,s,c){var l="";if("string"!=typeof e){var h=o;o=i, i=r, r=n, n=e, e=h;}if("object"===(void 0===t?"undefined":vt(t))&&!C(t)&&"imageData"in t){var u=t;t=u.imageData, e=u.format||e, n=u.x||n||0, r=u.y||r||0, i=u.w||i, o=u.h||o, a=u.alias||a, s=u.compression||s, c=u.rotation||u.angle||c;}if(isNaN(n)||isNaN(r))throw console.error("jsPDF.addImage: Invalid coordinates",arguments), new Error("Invalid coordinates passed to jsPDF.addImage");var f,d,p,g,m,y,w,v=function(){var t=this.internal.collections[x+"images"];return t||(this.internal.collections[x+"images"]=t={}, this.internal.events.subscribe("putResources",S), this.internal.events.subscribe("putXobjectDict",k)), t}.call(this);if(!(f=A(t,v))&&(C(t)&&(t=I(t,e)), (null==(w=a)||0===w.length)&&(a="string"==typeof(y=t)&&b.sHashCode(y)), !(f=A(a,v)))){if(this.isString(t)&&(""!==(l=this.convertStringToImageData(t))?t=l:void 0!==(l=this.loadImageFile(t))&&(t=l)), e=this.getImageFileTypeByImageData(t), !_(e))throw new Error("addImage does not support files of type '"+e+"', please ensure that a plugin for '"+e+"' support is added.");if(this.supportsArrayBuffer()&&(t instanceof Uint8Array||(d=t, t=this.binaryStringToUint8Array(t))), !(f=this["process"+e.toUpperCase()](t,(m=0, (g=v)&&(m=Object.keys?Object.keys(g).length:function(t){var e=0;for(var n in t)t.hasOwnProperty(n)&&e++;return e}(g)), m),a,((p=s)&&"string"==typeof p&&(p=p.toUpperCase()), p in b.image_compression?p:b.image_compression.NONE),d)))throw new Error("An unkwown error occurred whilst processing the image")}return function(t,e,n,r,i,o,a,s){var c=function(t,e,n){return t||e||(e=t=-96), t<0&&(t=-1*n.w*72/t/this.internal.scaleFactor), e<0&&(e=-1*n.h*72/e/this.internal.scaleFactor), 0===t&&(t=e*n.w/n.h), 0===e&&(e=t*n.h/n.w), [t,e]}.call(this,n,r,i),l=this.internal.getCoordinateString,h=this.internal.getVerticalCoordinateString;if(n=c[0], r=c[1], a[o]=i, s){s*=Math.PI/180;var u=Math.cos(s),f=Math.sin(s),d=function(t){return t.toFixed(4)},p=[d(u),d(f),d(-1*f),d(u),0,0,"cm"];}this.internal.write("q"), s?(this.internal.write([1,"0","0",1,l(t),h(e+r),"cm"].join(" ")), this.internal.write(p.join(" ")), this.internal.write([l(n),"0","0",l(r),"0","0","cm"].join(" "))):this.internal.write([l(n),"0","0",l(r),l(t),h(e+r),"cm"].join(" ")), this.internal.write("/I"+i.i+" Do"), this.internal.write("Q");}.call(this,n,r,i,o,f,f.i,v,c), this}, b.convertStringToImageData=function(t){var e,n="";this.isString(t)&&(null!==(e=this.extractInfoFromBase64DataURI(t))?b.validateStringAsBase64(e[3])&&(n=atob(e[3])):b.validateStringAsBase64(t)&&(n=atob(t)));return n};var c=function(t,e){return t.subarray(e,e+5)};b.processJPEG=function(t,e,n,r,i,o){var a,s=this.decode.DCT_DECODE;if(!this.isString(t)&&!this.isArrayBuffer(t)&&!this.isArrayBufferView(t))return null;if(this.isString(t)&&(a=function(t){var e;if(255===!t.charCodeAt(0)||216===!t.charCodeAt(1)||255===!t.charCodeAt(2)||224===!t.charCodeAt(3)||!t.charCodeAt(6)==="J".charCodeAt(0)||!t.charCodeAt(7)==="F".charCodeAt(0)||!t.charCodeAt(8)==="I".charCodeAt(0)||!t.charCodeAt(9)==="F".charCodeAt(0)||0===!t.charCodeAt(10))throw new Error("getJpegSize requires a binary string jpeg file");for(var n=256*t.charCodeAt(4)+t.charCodeAt(5),r=4,i=t.length;r<i;){if(r+=n, 255!==t.charCodeAt(r))throw new Error("getJpegSize could not find the size of the image");if(192===t.charCodeAt(r+1)||193===t.charCodeAt(r+1)||194===t.charCodeAt(r+1)||195===t.charCodeAt(r+1)||196===t.charCodeAt(r+1)||197===t.charCodeAt(r+1)||198===t.charCodeAt(r+1)||199===t.charCodeAt(r+1))return e=256*t.charCodeAt(r+5)+t.charCodeAt(r+6), [256*t.charCodeAt(r+7)+t.charCodeAt(r+8),e,t.charCodeAt(r+9)];r+=2, n=256*t.charCodeAt(r)+t.charCodeAt(r+1);}}(t)), this.isArrayBuffer(t)&&(t=new Uint8Array(t)), this.isArrayBufferView(t)&&(a=function(t){if(65496!=(t[0]<<8|t[1]))throw new Error("Supplied data is not a JPEG");for(var e,n=t.length,r=(t[4]<<8)+t[5],i=4;i<n;){if(r=((e=c(t,i+=r))[2]<<8)+e[3], (192===e[1]||194===e[1])&&255===e[0]&&7<r)return{width:((e=c(t,i+5))[2]<<8)+e[3],height:(e[0]<<8)+e[1],numcomponents:e[4]};i+=2;}throw new Error("getJpegSizeFromBytes could not find the size of the image")}(t), t=i||this.arrayBufferToBinaryString(t)), void 0===o)switch(a.numcomponents){case 1:o=this.color_spaces.DEVICE_GRAY;break;case 4:o=this.color_spaces.DEVICE_CMYK;break;default:case 3:o=this.color_spaces.DEVICE_RGB;}return this.createImageInfo(t,a.width,a.height,o,8,s,e,n)}, b.processJPG=function(){return this.processJPEG.apply(this,arguments)}, b.loadImageFile=function(t,e,n){e=e||!0, n=n||function(){};var r="[object process]"===Object.prototype.toString.call("undefined"!=typeof process?process:0);return void 0!==("undefined"==typeof window?"undefined":vt(window))&&"object"===("undefined"==typeof location?"undefined":vt(location))&&"http"===location.protocol.substr(0,4)?function(t,e,n){var r=new XMLHttpRequest,i=[],o=0,a=function(t){var e=t.length,n=String.fromCharCode;for(o=0;o<e;o+=1)i.push(n(255&t.charCodeAt(o)));return i.join("")};if(r.open("GET",t,!e), r.overrideMimeType("text/plain; charset=x-user-defined"), !1===e&&(r.onload=function(){return a(this.responseText)}), r.send(null), 200===r.status)return e?a(r.responseText):void 0;console.warn('Unable to load file "'+t+'"');}(t,e):r?function(t,e,n){e=e||!0;var r=fs;if(!0===e)return r.readFileSync(t).toString();r.readFile("image.jpg",function(t,e){n(e);});}(t,e,n):void 0}, b.getImageProperties=function(t){var e,n,r="";if(C(t)&&(t=I(t)), this.isString(t)&&(""!==(r=this.convertStringToImageData(t))?t=r:void 0!==(r=this.loadImageFile(t))&&(t=r)), n=this.getImageFileTypeByImageData(t), !_(n))throw new Error("addImage does not support files of type '"+n+"', please ensure that a plugin for '"+n+"' support is added.");if(this.supportsArrayBuffer()&&(t instanceof Uint8Array||(t=this.binaryStringToUint8Array(t))), !(e=this["process"+n.toUpperCase()](t)))throw new Error("An unkwown error occurred whilst processing the image");return{fileType:n,width:e.w,height:e.h,colorSpace:e.cs,compressionMode:e.f,bitsPerComponent:e.bpc}};}(K.API), t=K.API, w={annotations:[],f2:function(t){return t.toFixed(2)},notEmpty:function(t){if(void 0!==t&&""!=t)return!0}}, K.API.annotationPlugin=w, K.API.events.push(["addPage",function(t){this.annotationPlugin.annotations[t.pageNumber]=[];}]), t.events.push(["putPage",function(t){for(var e=this.annotationPlugin.annotations[t.pageNumber],n=!1,r=0;r<e.length&&!n;r++)switch((c=e[r]).type){case"link":if(w.notEmpty(c.options.url)||w.notEmpty(c.options.pageNumber)){n=!0;break}case"reference":case"text":case"freetext":n=!0;}if(0!=n){this.internal.write("/Annots [");var i=this.annotationPlugin.f2,o=this.internal.scaleFactor,a=this.internal.pageSize.getHeight(),s=this.internal.getPageInfo(t.pageNumber);for(r=0;r<e.length;r++){var c;switch((c=e[r]).type){case"reference":this.internal.write(" "+c.object.objId+" 0 R ");break;case"text":var l=this.internal.newAdditionalObject(),h=this.internal.newAdditionalObject(),u=c.title||"Note";m="<</Type /Annot /Subtype /Text "+(d="/Rect ["+i(c.bounds.x*o)+" "+i(a-(c.bounds.y+c.bounds.h)*o)+" "+i((c.bounds.x+c.bounds.w)*o)+" "+i((a-c.bounds.y)*o)+"] ")+"/Contents ("+c.contents+")", m+=" /Popup "+h.objId+" 0 R", m+=" /P "+s.objId+" 0 R", m+=" /T ("+u+") >>", l.content=m;var f=l.objId+" 0 R";m="<</Type /Annot /Subtype /Popup "+(d="/Rect ["+i((c.bounds.x+30)*o)+" "+i(a-(c.bounds.y+c.bounds.h)*o)+" "+i((c.bounds.x+c.bounds.w+30)*o)+" "+i((a-c.bounds.y)*o)+"] ")+" /Parent "+f, c.open&&(m+=" /Open true"), m+=" >>", h.content=m, this.internal.write(l.objId,"0 R",h.objId,"0 R");break;case"freetext":var d="/Rect ["+i(c.bounds.x*o)+" "+i((a-c.bounds.y)*o)+" "+i(c.bounds.x+c.bounds.w*o)+" "+i(a-(c.bounds.y+c.bounds.h)*o)+"] ",p=c.color||"#000000";m="<</Type /Annot /Subtype /FreeText "+d+"/Contents ("+c.contents+")", m+=" /DS(font: Helvetica,sans-serif 12.0pt; text-align:left; color:#"+p+")", m+=" /Border [0 0 0]", m+=" >>", this.internal.write(m);break;case"link":if(c.options.name){var g=this.annotations._nameMap[c.options.name];c.options.pageNumber=g.page, c.options.top=g.y;}else c.options.top||(c.options.top=0);d="/Rect ["+i(c.x*o)+" "+i((a-c.y)*o)+" "+i((c.x+c.w)*o)+" "+i((a-(c.y+c.h))*o)+"] ";var m="";if(c.options.url)m="<</Type /Annot /Subtype /Link "+d+"/Border [0 0 0] /A <</S /URI /URI ("+c.options.url+") >>";else if(c.options.pageNumber)switch(m="<</Type /Annot /Subtype /Link "+d+"/Border [0 0 0] /Dest ["+(t=this.internal.getPageInfo(c.options.pageNumber)).objId+" 0 R", c.options.magFactor=c.options.magFactor||"XYZ", c.options.magFactor){case"Fit":m+=" /Fit]";break;case"FitH":m+=" /FitH "+c.options.top+"]";break;case"FitV":c.options.left=c.options.left||0, m+=" /FitV "+c.options.left+"]";break;case"XYZ":default:var y=i((a-c.options.top)*o);c.options.left=c.options.left||0, void 0===c.options.zoom&&(c.options.zoom=0), m+=" /XYZ "+c.options.left+" "+y+" "+c.options.zoom+"]";}""!=m&&(m+=" >>", this.internal.write(m));}}this.internal.write("]");}}]), t.createAnnotation=function(t){switch(t.type){case"link":this.link(t.bounds.x,t.bounds.y,t.bounds.w,t.bounds.h,t);break;case"text":case"freetext":this.annotationPlugin.annotations[this.internal.getCurrentPageInfo().pageNumber].push(t);}}, t.link=function(t,e,n,r,i){this.annotationPlugin.annotations[this.internal.getCurrentPageInfo().pageNumber].push({x:t,y:e,w:n,h:r,options:i,type:"link"});}, t.textWithLink=function(t,e,n,r){var i=this.getTextWidth(t),o=this.internal.getLineHeight()/this.internal.scaleFactor;return this.text(t,e,n), n+=.2*o, this.link(e,n-o,i,o,r), i}, t.getTextWidth=function(t){var e=this.internal.getFontSize();return this.getStringUnitWidth(t)*e/this.internal.scaleFactor}, t.getLineHeight=function(){return this.internal.getLineHeight()}, function(t){var a=Object.keys({ar:"Arabic (Standard)","ar-DZ":"Arabic (Algeria)","ar-BH":"Arabic (Bahrain)","ar-EG":"Arabic (Egypt)","ar-IQ":"Arabic (Iraq)","ar-JO":"Arabic (Jordan)","ar-KW":"Arabic (Kuwait)","ar-LB":"Arabic (Lebanon)","ar-LY":"Arabic (Libya)","ar-MA":"Arabic (Morocco)","ar-OM":"Arabic (Oman)","ar-QA":"Arabic (Qatar)","ar-SA":"Arabic (Saudi Arabia)","ar-SY":"Arabic (Syria)","ar-TN":"Arabic (Tunisia)","ar-AE":"Arabic (U.A.E.)","ar-YE":"Arabic (Yemen)",fa:"Persian","fa-IR":"Persian/Iran",ur:"Urdu"}),l={1569:[65152],1570:[65153,65154,65153,65154],1571:[65155,65156,65155,65156],1572:[65157,65158],1573:[65159,65160,65159,65160],1574:[65161,65162,65163,65164],1575:[65165,65166,65165,65166],1576:[65167,65168,65169,65170],1577:[65171,65172],1578:[65173,65174,65175,65176],1579:[65177,65178,65179,65180],1580:[65181,65182,65183,65184],1581:[65185,65186,65187,65188],1582:[65189,65190,65191,65192],1583:[65193,65194,65193,65194],1584:[65195,65196,65195,65196],1585:[65197,65198,65197,65198],1586:[65199,65200,65199,65200],1587:[65201,65202,65203,65204],1588:[65205,65206,65207,65208],1589:[65209,65210,65211,65212],1590:[65213,65214,65215,65216],1591:[65217,65218,65219,65220],1592:[65221,65222,65223,65224],1593:[65225,65226,65227,65228],1594:[65229,65230,65231,65232],1601:[65233,65234,65235,65236],1602:[65237,65238,65239,65240],1603:[65241,65242,65243,65244],1604:[65245,65246,65247,65248],1605:[65249,65250,65251,65252],1606:[65253,65254,65255,65256],1607:[65257,65258,65259,65260],1608:[65261,65262,65261,65262],1609:[65263,65264,64488,64489],1610:[65265,65266,65267,65268],1649:[64336,64337],1655:[64477],1657:[64358,64359,64360,64361],1658:[64350,64351,64352,64353],1659:[64338,64339,64340,64341],1662:[64342,64343,64344,64345],1663:[64354,64355,64356,64357],1664:[64346,64347,64348,64349],1667:[64374,64375,64376,64377],1668:[64370,64371,64372,64373],1670:[64378,64379,64380,64381],1671:[64382,64383,64384,64385],1672:[64392,64393],1676:[64388,64389],1677:[64386,64387],1678:[64390,64391],1681:[64396,64397],1688:[64394,64395,64394,64395],1700:[64362,64363,64364,64365],1702:[64366,64367,64368,64369],1705:[64398,64399,64400,64401],1709:[64467,64468,64469,64470],1711:[64402,64403,64404,64405],1713:[64410,64411,64412,64413],1715:[64406,64407,64408,64409],1722:[64414,64415],1723:[64416,64417,64418,64419],1726:[64426,64427,64428,64429],1728:[64420,64421],1729:[64422,64423,64424,64425],1733:[64480,64481],1734:[64473,64474],1735:[64471,64472],1736:[64475,64476],1737:[64482,64483],1739:[64478,64479],1740:[64508,64509,64510,64511],1744:[64484,64485,64486,64487],1746:[64430,64431],1747:[64432,64433]},h={1570:[65269,65270,65269,65270],1571:[65271,65272,65271,65272],1573:[65273,65274,65273,65274],1575:[65275,65276,65275,65276]},u={1570:[65153,65154,65153,65154],1571:[65155,65156,65155,65156],1573:[65159,65160,65159,65160],1575:[65165,65166,65165,65166]},f={1612:64606,1613:64607,1614:64608,1615:64609,1616:64610},e=[1570,1571,1573,1575],n=[1569,1570,1571,1572,1573,1575,1577,1583,1584,1585,1586,1608,1688],o=0,s=1,c=2,d=3;function p(t){return void 0!==t&&void 0!==l[t.charCodeAt(0)]}function g(t){return void 0!==t&&0<=n.indexOf(t.charCodeAt(0))}function m(t){return void 0!==t&&0<=e.indexOf(t.charCodeAt(0))}function y(t){return p(t)&&2<=l[t.charCodeAt(0)].length}function w(t,e,n,r){return p(t)?(r=r||{}, l=Object.assign(l,r), !y(t)||!p(e)&&!p(n)||!p(n)&&g(e)||g(t)&&!p(e)||g(t)&&m(e)?(l=Object.assign(l,u), o):p(i=t)&&4==l[i.charCodeAt(0)].length&&p(e)&&!g(e)&&p(n)&&y(n)?(l=Object.assign(l,u), d):g(t)||!p(n)?(l=Object.assign(l,u), s):(l=Object.assign(l,u), c)):-1;var i;}function v(t){t=t||"";var e,n,r="",i=0,o=0,a="",s="",c="";for(i=0;i<t.length;i+=1)a=t[i], s=t[i-1], c=t[i+1], p(a)?void 0!==s&&1604===s.charCodeAt(0)&&m(a)?(o=w(a,t[i-2],t[i+1],h), e=String.fromCharCode(h[a.charCodeAt(0)][o]), r=r.substr(0,r.length-1)+e):void 0!==s&&1617===s.charCodeAt(0)&&(void 0!==(n=a)&&void 0!==f[n.charCodeAt(0)])?(o=w(a,t[i-2],t[i+1],u), e=String.fromCharCode(f[a.charCodeAt(0)][o]), r=r.substr(0,r.length-1)+e):(o=w(a,s,c,u), r+=String.fromCharCode(l[a.charCodeAt(0)][o])):r+=a;return r.split("").reverse().join("")}t.events.push(["preProcessText",function(t){var e=t.text,n=(t.x, t.y, t.options||{}),r=(t.mutex, n.lang),i=[];if(0<=a.indexOf(r)){if("[object Array]"===Object.prototype.toString.call(e)){var o=0;for(i=[], o=0;o<e.length;o+=1)"[object Array]"===Object.prototype.toString.call(e[o])?i.push([v(e[o][0]),e[o][1],e[o][2]]):i.push([v(e[o])]);t.text=i;}else t.text=v(e);void 0===n.charSpace&&(t.options.charSpace=0), !0===n.R2L&&(t.options.R2L=!1);}}]);}(K.API), K.API.autoPrint=function(t){var e;switch((t=t||{}).variant=t.variant||"non-conform", t.variant){case"javascript":this.addJS("print({});");break;case"non-conform":default:this.internal.events.subscribe("postPutResources",function(){e=this.internal.newObject(), this.internal.out("<<"), this.internal.out("/S /Named"), this.internal.out("/Type /Action"), this.internal.out("/N /Print"), this.internal.out(">>"), this.internal.out("endobj");}), this.internal.events.subscribe("putCatalog",function(){this.internal.out("/OpenAction "+e+" 0 R");});}return this}, (
/**
   * jsPDF Canvas PlugIn
   * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */
e=K.API).events.push(["initialized",function(){this.canvas.pdf=this;}]), e.canvas={getContext:function(t){return(this.pdf.context2d._canvas=this).pdf.context2d},style:{}}, Object.defineProperty(e.canvas,"width",{get:function(){return this._width},set:function(t){this._width=t, this.getContext("2d").pageWrapX=t+1;}}), Object.defineProperty(e.canvas,"height",{get:function(){return this._height},set:function(t){this._height=t, this.getContext("2d").pageWrapY=t+1;}}), I=K.API, A={x:void 0,y:void 0,w:void 0,h:void 0,ln:void 0}, T=1, d=function(t,e,n,r,i){A={x:t,y:e,w:n,h:r,ln:i};}, p=function(){return A}, F={left:0,top:0,bottom:0}, I.setHeaderFunction=function(t){c=t;}, I.getTextDimensions=function(e){i=this.internal.getFont().fontName, o=this.table_font_size||this.internal.getFontSize(), a=this.internal.getFont().fontStyle;var t,n,r=19.049976/25.4;(n=document.createElement("font")).id="jsPDFCell";try{n.style.fontStyle=a;}catch(t){n.style.fontWeight=a;}n.style.fontSize=o+"pt", n.style.fontFamily=i;try{n.textContent=e;}catch(t){n.innerText=e;}return document.body.appendChild(n), t={w:(n.offsetWidth+1)*r,h:(n.offsetHeight+1)*r}, document.body.removeChild(n), t}, I.cellAddPage=function(){var t=this.margins||F;this.addPage(), d(t.left,t.top,void 0,void 0), T+=1;}, I.cellInitialize=function(){A={x:void 0,y:void 0,w:void 0,h:void 0,ln:void 0}, T=1;}, I.cell=function(t,e,n,r,i,o,a){var s=p(),c=!1;if(void 0!==s.ln)if(s.ln===o)t=s.x+s.w, e=s.y;else{var l=this.margins||F;s.y+s.h+r+13>=this.internal.pageSize.getHeight()-l.bottom&&(this.cellAddPage(), c=!0, this.printHeaders&&this.tableHeaderRow&&this.printHeaderRow(o,!0)), e=p().y+p().h, c&&(e=23);}if(void 0!==i[0])if(this.printingHeaderRow?this.rect(t,e,n,r,"FD"):this.rect(t,e,n,r), "right"===a){i instanceof Array||(i=[i]);for(var h=0;h<i.length;h++){var u=i[h],f=this.getStringUnitWidth(u)*this.internal.getFontSize();this.text(u,t+n-f-3,e+this.internal.getLineHeight()*(h+1));}}else this.text(i,t+3,e+this.internal.getLineHeight());return d(t,e,n,r,o), this}, I.arrayMax=function(t,e){var n,r,i,o=t[0];for(n=0, r=t.length;n<r;n+=1)i=t[n], e?-1===e(o,i)&&(o=i):o<i&&(o=i);return o}, I.table=function(t,e,n,r,i){if(!n)throw"No data for PDF table";var o,a,s,c,l,h,u,f,d,p,g=[],m=[],y={},w={},v=[],b=[],x=!1,S=!0,k=12,_=F;if(_.width=this.internal.pageSize.getWidth(), i&&(!0===i.autoSize&&(x=!0), !1===i.printHeaders&&(S=!1), i.fontSize&&(k=i.fontSize), i.css&&void 0!==i.css["font-size"]&&(k=16*i.css["font-size"]), i.margins&&(_=i.margins)), this.lnMod=0, A={x:void 0,y:void 0,w:void 0,h:void 0,ln:void 0}, T=1, this.printHeaders=S, this.margins=_, this.setFontSize(k), this.table_font_size=k, null==r)g=Object.keys(n[0]);else if(r[0]&&"string"!=typeof r[0])for(a=0, s=r.length;a<s;a+=1)o=r[a], g.push(o.name), m.push(o.prompt), w[o.name]=o.width*(19.049976/25.4);else g=r;if(x)for(p=function(t){return t[o]}, a=0, s=g.length;a<s;a+=1){for(y[o=g[a]]=n.map(p), v.push(this.getTextDimensions(m[a]||o).w), u=0, c=(h=y[o]).length;u<c;u+=1)l=h[u], v.push(this.getTextDimensions(l).w);w[o]=I.arrayMax(v), v=[];}if(S){var C=this.calculateLineHeight(g,w,m.length?m:g);for(a=0, s=g.length;a<s;a+=1)o=g[a], b.push([t,e,w[o],C,String(m.length?m[a]:o)]);this.setTableHeaderRow(b), this.printHeaderRow(1,!1);}for(a=0, s=n.length;a<s;a+=1)for(f=n[a], C=this.calculateLineHeight(g,w,f), u=0, d=g.length;u<d;u+=1)o=g[u], this.cell(t,e,w[o],C,f[o],a+2,o.align);return this.lastCellPos=A, this.table_x=t, this.table_y=e, this}, I.calculateLineHeight=function(t,e,n){for(var r,i=0,o=0;o<t.length;o++){n[r=t[o]]=this.splitTextToSize(String(n[r]),e[r]-3);var a=this.internal.getLineHeight()*n[r].length+3;i<a&&(i=a);}return i}, I.setTableHeaderRow=function(t){this.tableHeaderRow=t;}, I.printHeaderRow=function(t,e){if(!this.tableHeaderRow)throw"Property tableHeaderRow does not exist.";var n,r,i,o;if(this.printingHeaderRow=!0, void 0!==c){var a=c(this,T);d(a[0],a[1],a[2],a[3],-1);}this.setFontStyle("bold");var s=[];for(i=0, o=this.tableHeaderRow.length;i<o;i+=1)this.setFillColor(200,200,200), n=this.tableHeaderRow[i], e&&(this.margins.top=13, n[1]=this.margins&&this.margins.top||0, s.push(n)), r=[].concat(n), this.cell.apply(this,r.concat(t));0<s.length&&this.setTableHeaderRow(s), this.setFontStyle("normal"), this.printingHeaderRow=!1;}, function(t){t.events.push(["initialized",function(){((this.context2d.pdf=this).context2d.internal.pdf=this).context2d.ctx=new e, this.context2d.ctxStack=[], this.context2d.path=[];}]), t.context2d={pageWrapXEnabled:!1,pageWrapYEnabled:!1,pageWrapX:9999999,pageWrapY:9999999,ctx:new e,f2:function(t){return t.toFixed(2)},fillRect:function(t,e,n,r){if(!this._isFillTransparent()){t=this._wrapX(t), e=this._wrapY(e);var i=this._matrix_map_rect(this.ctx._transform,{x:t,y:e,w:n,h:r});this.pdf.rect(i.x,i.y,i.w,i.h,"f");}},strokeRect:function(t,e,n,r){if(!this._isStrokeTransparent()){t=this._wrapX(t), e=this._wrapY(e);var i=this._matrix_map_rect(this.ctx._transform,{x:t,y:e,w:n,h:r});this.pdf.rect(i.x,i.y,i.w,i.h,"s");}},clearRect:function(t,e,n,r){if(!this.ctx.ignoreClearRect){t=this._wrapX(t), e=this._wrapY(e);var i=this._matrix_map_rect(this.ctx._transform,{x:t,y:e,w:n,h:r});this.save(), this.setFillStyle("#ffffff"), this.pdf.rect(i.x,i.y,i.w,i.h,"f"), this.restore();}},save:function(){this.ctx._fontSize=this.pdf.internal.getFontSize();var t=new e;t.copy(this.ctx), this.ctxStack.push(this.ctx), this.ctx=t;},restore:function(){this.ctx=this.ctxStack.pop(), this.setFillStyle(this.ctx.fillStyle), this.setStrokeStyle(this.ctx.strokeStyle), this.setFont(this.ctx.font), this.pdf.setFontSize(this.ctx._fontSize), this.setLineCap(this.ctx.lineCap), this.setLineWidth(this.ctx.lineWidth), this.setLineJoin(this.ctx.lineJoin);},rect:function(t,e,n,r){this.moveTo(t,e), this.lineTo(t+n,e), this.lineTo(t+n,e+r), this.lineTo(t,e+r), this.lineTo(t,e), this.closePath();},beginPath:function(){this.path=[];},closePath:function(){this.path.push({type:"close"});},_getRGBA:function(t){var e,n,r,i;if(!t)return{r:0,g:0,b:0,a:0,style:t};if(this.internal.rxTransparent.test(t))i=r=n=e=0;else{var o=this.internal.rxRgb.exec(t);null!=o?(e=parseInt(o[1]), n=parseInt(o[2]), r=parseInt(o[3]), i=1):null!=(o=this.internal.rxRgba.exec(t))?(e=parseInt(o[1]), n=parseInt(o[2]), r=parseInt(o[3]), i=parseFloat(o[4])):(i=1, "#"!=t.charAt(0)&&((t=dt.colorNameToHex(t))||(t="#000000")), 4===t.length?(e=t.substring(1,2), e+=e, n=t.substring(2,3), n+=n, r=t.substring(3,4), r+=r):(e=t.substring(1,3), n=t.substring(3,5), r=t.substring(5,7)), e=parseInt(e,16), n=parseInt(n,16), r=parseInt(r,16));}return{r:e,g:n,b:r,a:i,style:t}},setFillStyle:function(t){var e=this._getRGBA(t);this.ctx.fillStyle=t, this.ctx._isFillTransparent=0===e.a, this.ctx._fillOpacity=e.a, this.pdf.setFillColor(e.r,e.g,e.b,{a:e.a}), this.pdf.setTextColor(e.r,e.g,e.b,{a:e.a});},setStrokeStyle:function(t){var e=this._getRGBA(t);this.ctx.strokeStyle=e.style, this.ctx._isStrokeTransparent=0===e.a, this.ctx._strokeOpacity=e.a, 0===e.a?this.pdf.setDrawColor(255,255,255):(e.a, this.pdf.setDrawColor(e.r,e.g,e.b));},fillText:function(t,e,n,r){if(!this._isFillTransparent()){e=this._wrapX(e), n=this._wrapY(n);var i=this._matrix_map_point(this.ctx._transform,[e,n]);e=i[0], n=i[1];var o=57.2958*this._matrix_rotation(this.ctx._transform);if(0<this.ctx._clip_path.length){var a;(a=window.outIntercept?"group"===window.outIntercept.type?window.outIntercept.stream:window.outIntercept:this.internal.getCurrentPage()).push("q");var s=this.path;this.path=this.ctx._clip_path, this.ctx._clip_path=[], this._fill(null,!0), this.ctx._clip_path=this.path, this.path=s;}var c=1;try{c=this._matrix_decompose(this._getTransform()).scale[0];}catch(t){console.warn(t);}if(c<.01)this.pdf.text(t,e,this._getBaseline(n),null,o);else{var l=this.pdf.internal.getFontSize();this.pdf.setFontSize(l*c), this.pdf.text(t,e,this._getBaseline(n),null,o), this.pdf.setFontSize(l);}0<this.ctx._clip_path.length&&a.push("Q");}},strokeText:function(t,e,n,r){if(!this._isStrokeTransparent()){e=this._wrapX(e), n=this._wrapY(n);var i=this._matrix_map_point(this.ctx._transform,[e,n]);e=i[0], n=i[1];var o=57.2958*this._matrix_rotation(this.ctx._transform);if(0<this.ctx._clip_path.length){var a;(a=window.outIntercept?"group"===window.outIntercept.type?window.outIntercept.stream:window.outIntercept:this.internal.getCurrentPage()).push("q");var s=this.path;this.path=this.ctx._clip_path, this.ctx._clip_path=[], this._fill(null,!0), this.ctx._clip_path=this.path, this.path=s;}var c=1;try{c=this._matrix_decompose(this._getTransform()).scale[0];}catch(t){console.warn(t);}if(1===c)this.pdf.text(t,e,this._getBaseline(n),{stroke:!0},o);else{var l=this.pdf.internal.getFontSize();this.pdf.setFontSize(l*c), this.pdf.text(t,e,this._getBaseline(n),{stroke:!0},o), this.pdf.setFontSize(l);}0<this.ctx._clip_path.length&&a.push("Q");}},setFont:function(t){if(this.ctx.font=t, null!=(c=/\s*(\w+)\s+(\w+)\s+(\w+)\s+([\d\.]+)(px|pt|em)\s+(.*)?/.exec(t))){var e=c[1],n=(c[2], c[3]),r=c[4],i=c[5],o=c[6];r="px"===i?Math.floor(parseFloat(r)):"em"===i?Math.floor(parseFloat(r)*this.pdf.getFontSize()):Math.floor(parseFloat(r)), this.pdf.setFontSize(r), "bold"===n||"700"===n?this.pdf.setFontStyle("bold"):"italic"===e?this.pdf.setFontStyle("italic"):this.pdf.setFontStyle("normal");var a,s=(u=o).toLowerCase().split(/\s*,\s*/);a=-1!=s.indexOf("arial")?"Arial":-1!=s.indexOf("verdana")?"Verdana":-1!=s.indexOf("helvetica")?"Helvetica":-1!=s.indexOf("sans-serif")?"sans-serif":-1!=s.indexOf("fixed")?"Fixed":-1!=s.indexOf("monospace")?"Monospace":-1!=s.indexOf("terminal")?"Terminal":-1!=s.indexOf("courier")?"Courier":-1!=s.indexOf("times")?"Times":-1!=s.indexOf("cursive")?"Cursive":-1!=s.indexOf("fantasy")?"Fantasy":(s.indexOf("serif"), "Serif"), l="bold"===n?"bold":"normal", this.pdf.setFont(a,l);}else{var c=/\s*(\d+)(pt|px|em)\s+([\w "]+)\s*([\w "]+)?/.exec(t);if(null!=c){var l,h=c[1],u=(c[2], c[3]);(l=c[4])||(l="normal"), h="em"===i?Math.floor(parseFloat(r)*this.pdf.getFontSize()):Math.floor(parseFloat(h)), this.pdf.setFontSize(h), this.pdf.setFont(u,l);}}},setTextBaseline:function(t){this.ctx.textBaseline=t;},getTextBaseline:function(){return this.ctx.textBaseline},setTextAlign:function(t){this.ctx.textAlign=t;},getTextAlign:function(){return this.ctx.textAlign},setLineWidth:function(t){this.ctx.lineWidth=t, this.pdf.setLineWidth(t);},setLineCap:function(t){this.ctx.lineCap=t, this.pdf.setLineCap(t);},setLineJoin:function(t){this.ctx.lineJoin=t, this.pdf.setLineJoin(t);},moveTo:function(t,e){t=this._wrapX(t), e=this._wrapY(e);var n=this._matrix_map_point(this.ctx._transform,[t,e]),r={type:"mt",x:t=n[0],y:e=n[1]};this.path.push(r);},_wrapX:function(t){return this.pageWrapXEnabled?t%this.pageWrapX:t},_wrapY:function(t){return this.pageWrapYEnabled?(this._gotoPage(this._page(t)), (t-this.lastBreak)%this.pageWrapY):t},transform:function(t,e,n,r,i,o){this.ctx._transform=[t,e,n,r,i,o];},setTransform:function(t,e,n,r,i,o){this.ctx._transform=[t,e,n,r,i,o];},_getTransform:function(){return this.ctx._transform},lastBreak:0,pageBreaks:[],_page:function(t){if(this.pageWrapYEnabled){for(var e=this.lastBreak=0,n=0,r=0;r<this.pageBreaks.length;r++)if(t>=this.pageBreaks[r]){e++, 0===this.lastBreak&&n++;var i=this.pageBreaks[r]-this.lastBreak;this.lastBreak=this.pageBreaks[r], n+=Math.floor(i/this.pageWrapY);}if(0===this.lastBreak)n+=Math.floor(t/this.pageWrapY)+1;return n+e}return this.pdf.internal.getCurrentPageInfo().pageNumber},_gotoPage:function(t){},lineTo:function(t,e){t=this._wrapX(t), e=this._wrapY(e);var n=this._matrix_map_point(this.ctx._transform,[t,e]),r={type:"lt",x:t=n[0],y:e=n[1]};this.path.push(r);},bezierCurveTo:function(t,e,n,r,i,o){var a;t=this._wrapX(t), e=this._wrapY(e), n=this._wrapX(n), r=this._wrapY(r), i=this._wrapX(i), o=this._wrapY(o), i=(a=this._matrix_map_point(this.ctx._transform,[i,o]))[0], o=a[1];var s={type:"bct",x1:t=(a=this._matrix_map_point(this.ctx._transform,[t,e]))[0],y1:e=a[1],x2:n=(a=this._matrix_map_point(this.ctx._transform,[n,r]))[0],y2:r=a[1],x:i,y:o};this.path.push(s);},quadraticCurveTo:function(t,e,n,r){var i;t=this._wrapX(t), e=this._wrapY(e), n=this._wrapX(n), r=this._wrapY(r), n=(i=this._matrix_map_point(this.ctx._transform,[n,r]))[0], r=i[1];var o={type:"qct",x1:t=(i=this._matrix_map_point(this.ctx._transform,[t,e]))[0],y1:e=i[1],x:n,y:r};this.path.push(o);},arc:function(t,e,n,r,i,o){if(t=this._wrapX(t), e=this._wrapY(e), !this._matrix_is_identity(this.ctx._transform)){var a=this._matrix_map_point(this.ctx._transform,[t,e]);t=a[0], e=a[1];var s=this._matrix_map_point(this.ctx._transform,[0,0]),c=this._matrix_map_point(this.ctx._transform,[0,n]);n=Math.sqrt(Math.pow(c[0]-s[0],2)+Math.pow(c[1]-s[1],2));}var l={type:"arc",x:t,y:e,radius:n,startAngle:r,endAngle:i,anticlockwise:o};this.path.push(l);},drawImage:function(t,e,n,r,i,o,a,s,c){void 0!==o&&(e=o, n=a, r=s, i=c), e=this._wrapX(e), n=this._wrapY(n);var l,h=this._matrix_map_rect(this.ctx._transform,{x:e,y:n,w:r,h:i}),u=(this._matrix_map_rect(this.ctx._transform,{x:o,y:a,w:s,h:c}), /data:image\/(\w+).*/i.exec(t));l=null!=u?u[1]:"png", this.pdf.addImage(t,l,h.x,h.y,h.w,h.h);},_matrix_multiply:function(t,e){var n=e[0],r=e[1],i=e[2],o=e[3],a=e[4],s=e[5],c=n*t[0]+r*t[2],l=i*t[0]+o*t[2],h=a*t[0]+s*t[2]+t[4];return r=n*t[1]+r*t[3], o=i*t[1]+o*t[3], s=a*t[1]+s*t[3]+t[5], [n=c,r,i=l,o,a=h,s]},_matrix_rotation:function(t){return Math.atan2(t[2],t[0])},_matrix_decompose:function(t){var e=t[0],n=t[1],r=t[2],i=t[3],o=Math.sqrt(e*e+n*n),a=(e/=o)*r+(n/=o)*i;r-=e*a, i-=n*a;var s=Math.sqrt(r*r+i*i);return a/=s, e*(i/=s)<n*(r/=s)&&(e=-e, n=-n, a=-a, o=-o), {scale:[o,0,0,s,0,0],translate:[1,0,0,1,t[4],t[5]],rotate:[e,n,-n,e,0,0],skew:[1,0,a,1,0,0]}},_matrix_map_point:function(t,e){var n=t[0],r=t[1],i=t[2],o=t[3],a=t[4],s=t[5],c=e[0],l=e[1];return[c*n+l*i+a,c*r+l*o+s]},_matrix_map_point_obj:function(t,e){var n=this._matrix_map_point(t,[e.x,e.y]);return{x:n[0],y:n[1]}},_matrix_map_rect:function(t,e){var n=this._matrix_map_point(t,[e.x,e.y]),r=this._matrix_map_point(t,[e.x+e.w,e.y+e.h]);return{x:n[0],y:n[1],w:r[0]-n[0],h:r[1]-n[1]}},_matrix_is_identity:function(t){return 1==t[0]&&(0==t[1]&&(0==t[2]&&(1==t[3]&&(0==t[4]&&0==t[5]))))},rotate:function(t){var e=[Math.cos(t),Math.sin(t),-Math.sin(t),Math.cos(t),0,0];this.ctx._transform=this._matrix_multiply(this.ctx._transform,e);},scale:function(t,e){var n=[t,0,0,e,0,0];this.ctx._transform=this._matrix_multiply(this.ctx._transform,n);},translate:function(t,e){var n=[1,0,0,1,t,e];this.ctx._transform=this._matrix_multiply(this.ctx._transform,n);},stroke:function(){if(0<this.ctx._clip_path.length){var t;(t=window.outIntercept?"group"===window.outIntercept.type?window.outIntercept.stream:window.outIntercept:this.internal.getCurrentPage()).push("q");var e=this.path;this.path=this.ctx._clip_path, this.ctx._clip_path=[], this._stroke(!0), this.ctx._clip_path=this.path, this.path=e, this._stroke(!1), t.push("Q");}else this._stroke(!1);},_stroke:function(t){if(t||!this._isStrokeTransparent()){for(var e=[],n=this.path,r=0;r<n.length;r++){var i=n[r];switch(i.type){case"mt":e.push({start:i,deltas:[],abs:[]});break;case"lt":var o=[i.x-n[r-1].x,i.y-n[r-1].y];e[e.length-1].deltas.push(o), e[e.length-1].abs.push(i);break;case"bct":o=[i.x1-n[r-1].x,i.y1-n[r-1].y,i.x2-n[r-1].x,i.y2-n[r-1].y,i.x-n[r-1].x,i.y-n[r-1].y];e[e.length-1].deltas.push(o);break;case"qct":var a=n[r-1].x+2/3*(i.x1-n[r-1].x),s=n[r-1].y+2/3*(i.y1-n[r-1].y),c=i.x+2/3*(i.x1-i.x),l=i.y+2/3*(i.y1-i.y),h=i.x,u=i.y;o=[a-n[r-1].x,s-n[r-1].y,c-n[r-1].x,l-n[r-1].y,h-n[r-1].x,u-n[r-1].y];e[e.length-1].deltas.push(o);break;case"arc":0==e.length&&e.push({start:{x:0,y:0},deltas:[],abs:[]}), e[e.length-1].arc=!0, e[e.length-1].abs.push(i);}}for(r=0;r<e.length;r++){var f;if(f=r==e.length-1?"s":null, e[r].arc)for(var d=e[r].abs,p=0;p<d.length;p++){var g=d[p],m=360*g.startAngle/(2*Math.PI),y=360*g.endAngle/(2*Math.PI),w=g.x,v=g.y;this.internal.arc2(this,w,v,g.radius,m,y,g.anticlockwise,f,t);}else{w=e[r].start.x, v=e[r].start.y;t?(this.pdf.lines(e[r].deltas,w,v,null,null), this.pdf.clip_fixed()):this.pdf.lines(e[r].deltas,w,v,null,f);}}}},_isFillTransparent:function(){return this.ctx._isFillTransparent||0==this.globalAlpha},_isStrokeTransparent:function(){return this.ctx._isStrokeTransparent||0==this.globalAlpha},fill:function(t){if(0<this.ctx._clip_path.length){var e;(e=window.outIntercept?"group"===window.outIntercept.type?window.outIntercept.stream:window.outIntercept:this.internal.getCurrentPage()).push("q");var n=this.path;this.path=this.ctx._clip_path, this.ctx._clip_path=[], this._fill(t,!0), this.ctx._clip_path=this.path, this.path=n, this._fill(t,!1), e.push("Q");}else this._fill(t,!1);},_fill:function(t,e){if(!this._isFillTransparent()){var n,r="function"==typeof this.pdf.internal.newObject2;n=window.outIntercept?"group"===window.outIntercept.type?window.outIntercept.stream:window.outIntercept:this.internal.getCurrentPage();var i=[],o=window.outIntercept;if(r)switch(this.ctx.globalCompositeOperation){case"normal":case"source-over":break;case"destination-in":case"destination-out":var a=this.pdf.internal.newStreamObject(),s=this.pdf.internal.newObject2();s.push("<</Type /ExtGState"), s.push("/SMask <</S /Alpha /G "+a.objId+" 0 R>>"), s.push(">>");var c="MASK"+s.objId;this.pdf.internal.addGraphicsState(c,s.objId);var l="/"+c+" gs";n.splice(0,0,"q"), n.splice(1,0,l), n.push("Q"), window.outIntercept=a;break;default:var h="/"+this.pdf.internal.blendModeMap[this.ctx.globalCompositeOperation.toUpperCase()];h&&this.pdf.internal.out(h+" gs");}var u=this.ctx.globalAlpha;if(this.ctx._fillOpacity<1&&(u=this.ctx._fillOpacity), r){var f=this.pdf.internal.newObject2();f.push("<</Type /ExtGState"), f.push("/CA "+u), f.push("/ca "+u), f.push(">>");c="GS_O_"+f.objId;this.pdf.internal.addGraphicsState(c,f.objId), this.pdf.internal.out("/"+c+" gs");}for(var d=this.path,p=0;p<d.length;p++){var g=d[p];switch(g.type){case"mt":i.push({start:g,deltas:[],abs:[]});break;case"lt":var m=[g.x-d[p-1].x,g.y-d[p-1].y];i[i.length-1].deltas.push(m), i[i.length-1].abs.push(g);break;case"bct":m=[g.x1-d[p-1].x,g.y1-d[p-1].y,g.x2-d[p-1].x,g.y2-d[p-1].y,g.x-d[p-1].x,g.y-d[p-1].y];i[i.length-1].deltas.push(m);break;case"qct":var y=d[p-1].x+2/3*(g.x1-d[p-1].x),w=d[p-1].y+2/3*(g.y1-d[p-1].y),v=g.x+2/3*(g.x1-g.x),b=g.y+2/3*(g.y1-g.y),x=g.x,S=g.y;m=[y-d[p-1].x,w-d[p-1].y,v-d[p-1].x,b-d[p-1].y,x-d[p-1].x,S-d[p-1].y];i[i.length-1].deltas.push(m);break;case"arc":0===i.length&&i.push({deltas:[],abs:[]}), i[i.length-1].arc=!0, i[i.length-1].abs.push(g);break;case"close":i.push({close:!0});}}for(p=0;p<i.length;p++){var k;if(p==i.length-1?(k="f", "evenodd"===t&&(k+="*")):k=null, i[p].close)this.pdf.internal.out("h"), k&&this.pdf.internal.out(k);else if(i[p].arc){i[p].start&&this.internal.move2(this,i[p].start.x,i[p].start.y);for(var _=i[p].abs,C=0;C<_.length;C++){var I=_[C];if(void 0!==I.startAngle){var A=360*I.startAngle/(2*Math.PI),T=360*I.endAngle/(2*Math.PI),F=I.x,q=I.y;if(0===C&&this.internal.move2(this,F,q), this.internal.arc2(this,F,q,I.radius,A,T,I.anticlockwise,null,e), C===_.length-1&&i[p].start){F=i[p].start.x, q=i[p].start.y;this.internal.line2(E,F,q);}}else this.internal.line2(E,I.x,I.y);}}else{F=i[p].start.x, q=i[p].start.y;e?(this.pdf.lines(i[p].deltas,F,q,null,null), this.pdf.clip_fixed()):this.pdf.lines(i[p].deltas,F,q,null,k);}}window.outIntercept=o;}},pushMask:function(){if("function"==typeof this.pdf.internal.newObject2){var t=this.pdf.internal.newStreamObject(),e=this.pdf.internal.newObject2();e.push("<</Type /ExtGState"), e.push("/SMask <</S /Alpha /G "+t.objId+" 0 R>>"), e.push(">>");var n="MASK"+e.objId;this.pdf.internal.addGraphicsState(n,e.objId);var r="/"+n+" gs";this.pdf.internal.out(r);}else console.log("jsPDF v2 not enabled");},clip:function(){if(0<this.ctx._clip_path.length)for(var t=0;t<this.path.length;t++)this.ctx._clip_path.push(this.path[t]);else this.ctx._clip_path=this.path;this.path=[];},measureText:function(n){var r=this.pdf;return{getWidth:function(){var t=r.internal.getFontSize(),e=r.getStringUnitWidth(n)*t/r.internal.scaleFactor;return e*=1.3333},get width(){return this.getWidth(n)}}},_getBaseline:function(t){var e=parseInt(this.pdf.internal.getFontSize()),n=.25*e;switch(this.ctx.textBaseline){case"bottom":return t-n;case"top":return t+e;case"hanging":return t+e-n;case"middle":return t+e/2-n;case"ideographic":return t;case"alphabetic":default:return t}}};var E=t.context2d;function e(){this._isStrokeTransparent=!1, this._strokeOpacity=1, this.strokeStyle="#000000", this.fillStyle="#000000", this._isFillTransparent=!1, this._fillOpacity=1, this.font="12pt times", this.textBaseline="alphabetic", this.textAlign="start", this.lineWidth=1, this.lineJoin="miter", this.lineCap="butt", this._transform=[1,0,0,1,0,0], this.globalCompositeOperation="normal", this.globalAlpha=1, this._clip_path=[], this.ignoreClearRect=!1, this.copy=function(t){this._isStrokeTransparent=t._isStrokeTransparent, this._strokeOpacity=t._strokeOpacity, this.strokeStyle=t.strokeStyle, this._isFillTransparent=t._isFillTransparent, this._fillOpacity=t._fillOpacity, this.fillStyle=t.fillStyle, this.font=t.font, this.lineWidth=t.lineWidth, this.lineJoin=t.lineJoin, this.lineCap=t.lineCap, this.textBaseline=t.textBaseline, this.textAlign=t.textAlign, this._fontSize=t._fontSize, this._transform=t._transform.slice(0), this.globalCompositeOperation=t.globalCompositeOperation, this.globalAlpha=t.globalAlpha, this._clip_path=t._clip_path.slice(0), this.ignoreClearRect=t.ignoreClearRect;};}Object.defineProperty(E,"fillStyle",{set:function(t){this.setFillStyle(t);},get:function(){return this.ctx.fillStyle}}), Object.defineProperty(E,"strokeStyle",{set:function(t){this.setStrokeStyle(t);},get:function(){return this.ctx.strokeStyle}}), Object.defineProperty(E,"lineWidth",{set:function(t){this.setLineWidth(t);},get:function(){return this.ctx.lineWidth}}), Object.defineProperty(E,"lineCap",{set:function(t){this.setLineCap(t);},get:function(){return this.ctx.lineCap}}), Object.defineProperty(E,"lineJoin",{set:function(t){this.setLineJoin(t);},get:function(){return this.ctx.lineJoin}}), Object.defineProperty(E,"miterLimit",{set:function(t){this.ctx.miterLimit=t;},get:function(){return this.ctx.miterLimit}}), Object.defineProperty(E,"textBaseline",{set:function(t){this.setTextBaseline(t);},get:function(){return this.getTextBaseline()}}), Object.defineProperty(E,"textAlign",{set:function(t){this.setTextAlign(t);},get:function(){return this.getTextAlign()}}), Object.defineProperty(E,"font",{set:function(t){this.setFont(t);},get:function(){return this.ctx.font}}), Object.defineProperty(E,"globalCompositeOperation",{set:function(t){this.ctx.globalCompositeOperation=t;},get:function(){return this.ctx.globalCompositeOperation}}), Object.defineProperty(E,"globalAlpha",{set:function(t){this.ctx.globalAlpha=t;},get:function(){return this.ctx.globalAlpha}}), Object.defineProperty(E,"ignoreClearRect",{set:function(t){this.ctx.ignoreClearRect=t;},get:function(){return this.ctx.ignoreClearRect}}), E.internal={}, E.internal.rxRgb=/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/, E.internal.rxRgba=/rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d\.]+)\s*\)/, E.internal.rxTransparent=/transparent|rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*0+\s*\)/, E.internal.arc=function(t,e,n,r,i,o,a,s){for(var c=this.pdf.internal.scaleFactor,l=this.pdf.internal.pageSize.getHeight(),h=this.pdf.internal.f2,u=i*(Math.PI/180),f=o*(Math.PI/180),d=this.createArc(r,u,f,a),p=0;p<d.length;p++){var g=d[p];0===p?this.pdf.internal.out([h((g.x1+e)*c),h((l-(g.y1+n))*c),"m",h((g.x2+e)*c),h((l-(g.y2+n))*c),h((g.x3+e)*c),h((l-(g.y3+n))*c),h((g.x4+e)*c),h((l-(g.y4+n))*c),"c"].join(" ")):this.pdf.internal.out([h((g.x2+e)*c),h((l-(g.y2+n))*c),h((g.x3+e)*c),h((l-(g.y3+n))*c),h((g.x4+e)*c),h((l-(g.y4+n))*c),"c"].join(" ")), t._lastPoint={x:e,y:n};}null!==s&&this.pdf.internal.out(this.pdf.internal.getStyle(s));}, E.internal.arc2=function(t,e,n,r,i,o,a,s,c){var l=e,h=n;c?(this.arc(t,l,h,r,i,o,a,null), this.pdf.clip_fixed()):this.arc(t,l,h,r,i,o,a,s);}, E.internal.move2=function(t,e,n){var r=this.pdf.internal.scaleFactor,i=this.pdf.internal.pageSize.getHeight(),o=this.pdf.internal.f2;this.pdf.internal.out([o(e*r),o((i-n)*r),"m"].join(" ")), t._lastPoint={x:e,y:n};}, E.internal.line2=function(t,e,n){var r=this.pdf.internal.scaleFactor,i=this.pdf.internal.pageSize.getHeight(),o=this.pdf.internal.f2,a={x:e,y:n};this.pdf.internal.out([o(a.x*r),o((i-a.y)*r),"l"].join(" ")), t._lastPoint=a;}, E.internal.createArc=function(t,e,n,r){var i=2*Math.PI,o=Math.PI/2,a=e;for((a<i||i<a)&&(a%=i), a<0&&(a=i+a);n<e;)e-=i;var s=Math.abs(n-e);s<i&&r&&(s=i-s);for(var c=[],l=r?-1:1,h=a;1e-5<s;){var u=h+l*Math.min(s,o);c.push(this.createSmallArc(t,h,u)), s-=Math.abs(u-h), h=u;}return c}, E.internal.getCurrentPage=function(){return this.pdf.internal.pages[this.pdf.internal.getCurrentPageInfo().pageNumber]}, E.internal.createSmallArc=function(t,e,n){var r=(n-e)/2,i=t*Math.cos(r),o=t*Math.sin(r),a=i,s=-o,c=a*a+s*s,l=c+a*i+s*o,h=4/3*(Math.sqrt(2*c*l)-l)/(a*o-s*i),u=a-h*s,f=s+h*a,d=u,p=-f,g=r+e,m=Math.cos(g),y=Math.sin(g);return{x1:t*Math.cos(e),y1:t*Math.sin(e),x2:u*m-f*y,y2:u*y+f*m,x3:d*m-p*y,y3:d*y+p*m,x4:t*Math.cos(n),y4:t*Math.sin(n)}};}(K.API), function(t){var T,F,i,a,s,c,l,h,q,v,f,u,d,n,E,P,p,g,m,O;T=function(){return function(t){return e.prototype=t, new e};function e(){}}(), v=function(t){var e,n,r,i,o,a,s;for(n=0, r=t.length, e=void 0, a=i=!1;!i&&n!==r;)(e=t[n]=t[n].trimLeft())&&(i=!0), n++;for(n=r-1;r&&!a&&-1!==n;)(e=t[n]=t[n].trimRight())&&(a=!0), n--;for(o=/\s+$/g, s=!0, n=0;n!==r;)"\u2028"!=t[n]&&(e=t[n].replace(/\s+/g," "), s&&(e=e.trimLeft()), e&&(s=o.test(e)), t[n]=e), n++;return t}, u=function(t){var e,n,r;for(e=void 0, n=(r=t.split(",")).shift();!e&&n;)e=i[n.trim().toLowerCase()], n=r.shift();return e}, d=function(t){var e;return-1<(t="auto"===t?"0px":t).indexOf("em")&&!isNaN(Number(t.replace("em","")))&&(t=18.719*Number(t.replace("em",""))+"px"), -1<t.indexOf("pt")&&!isNaN(Number(t.replace("pt","")))&&(t=1.333*Number(t.replace("pt",""))+"px"), (e=n[t])?e:void 0!==(e={"xx-small":9,"x-small":11,small:13,medium:16,large:19,"x-large":23,"xx-large":28,auto:0}[{css_line_height_string:t}])?n[t]=e/16:(e=parseFloat(t))?n[t]=e/16:3===(e=t.match(/([\d\.]+)(px)/)).length?n[t]=parseFloat(e[1])/16:n[t]=1}, q=function(t){var e,n,r,i,o;return o=t, i=document.defaultView&&document.defaultView.getComputedStyle?document.defaultView.getComputedStyle(o,null):o.currentStyle?o.currentStyle:o.style, n=void 0, (e={})["font-family"]=u((r=function(t){return t=t.replace(/-\D/g,function(t){return t.charAt(1).toUpperCase()}), i[t]})("font-family"))||"times", e["font-style"]=a[r("font-style")]||"normal", e["text-align"]=s[r("text-align")]||"left", "bold"===(n=c[r("font-weight")]||"normal")&&("normal"===e["font-style"]?e["font-style"]=n:e["font-style"]=n+e["font-style"]), e["font-size"]=d(r("font-size"))||1, e["line-height"]=d(r("line-height"))||1, e.display="inline"===r("display")?"inline":"block", n="block"===e.display, e["margin-top"]=n&&d(r("margin-top"))||0, e["margin-bottom"]=n&&d(r("margin-bottom"))||0, e["padding-top"]=n&&d(r("padding-top"))||0, e["padding-bottom"]=n&&d(r("padding-bottom"))||0, e["margin-left"]=n&&d(r("margin-left"))||0, e["margin-right"]=n&&d(r("margin-right"))||0, e["padding-left"]=n&&d(r("padding-left"))||0, e["padding-right"]=n&&d(r("padding-right"))||0, e["page-break-before"]=r("page-break-before")||"auto", e.float=l[r("cssFloat")]||"none", e.clear=h[r("clear")]||"none", e.color=r("color"), e}, E=function(t,e,n){var r,i,o,a,s;if(o=!1, a=i=void 0, r=n["#"+t.id])if("function"==typeof r)o=r(t,e);else for(i=0, a=r.length;!o&&i!==a;)o=r[i](t,e), i++;if(r=n[t.nodeName], !o&&r)if("function"==typeof r)o=r(t,e);else for(i=0, a=r.length;!o&&i!==a;)o=r[i](t,e), i++;for(s="string"==typeof t.className?t.className.split(" "):[], i=0;i<s.length;i++)if(r=n["."+s[i]], !o&&r)if("function"==typeof r)o=r(t,e);else for(i=0, a=r.length;!o&&i!==a;)o=r[i](t,e), i++;return o}, O=function(t,e){var n,r,i,o,a,s,c,l,h;for(n=[], r=[], i=0, h=t.rows[0].cells.length, c=t.clientWidth;i<h;)l=t.rows[0].cells[i], r[i]={name:l.textContent.toLowerCase().replace(/\s+/g,""),prompt:l.textContent.replace(/\r?\n/g,""),width:l.clientWidth/c*e.pdf.internal.pageSize.getWidth()}, i++;for(i=1;i<t.rows.length;){for(s=t.rows[i], a={}, o=0;o<s.cells.length;)a[r[o].name]=s.cells[o].textContent.replace(/\r?\n/g,""), o++;n.push(a), i++;}return{rows:n,headers:r}};var B={SCRIPT:1,STYLE:1,NOSCRIPT:1,OBJECT:1,EMBED:1,SELECT:1},j=1;F=function(t,i,e){var n,r,o,a,s,c,l,h;for(r=t.childNodes, n=void 0, (s="block"===(o=q(t)).display)&&(i.setBlockBoundary(), i.setBlockStyle(o)), a=0, c=r.length;a<c;){if("object"===(void 0===(n=r[a])?"undefined":vt(n))){if(i.executeWatchFunctions(n), 1===n.nodeType&&"HEADER"===n.nodeName){var u=n,f=i.pdf.margins_doc.top;i.pdf.internal.events.subscribe("addPage",function(t){i.y=f, F(u,i,e), i.pdf.margins_doc.top=i.y+10, i.y+=10;},!1);}if(8===n.nodeType&&"#comment"===n.nodeName)~n.textContent.indexOf("ADD_PAGE")&&(i.pdf.addPage(), i.y=i.pdf.margins_doc.top);else if(1!==n.nodeType||B[n.nodeName])if(3===n.nodeType){var d=n.nodeValue;if(n.nodeValue&&"LI"===n.parentNode.nodeName)if("OL"===n.parentNode.parentNode.nodeName)d=j+++". "+d;else{var p=o["font-size"],g=(3-.75*p)*i.pdf.internal.scaleFactor,m=.75*p*i.pdf.internal.scaleFactor,y=1.74*p/i.pdf.internal.scaleFactor;h=function(t,e){this.pdf.circle(t+g,e+m,y,"FD");};}16&n.ownerDocument.body.compareDocumentPosition(n)&&i.addText(d,o);}else"string"==typeof n&&i.addText(n,o);else{var w;if("IMG"===n.nodeName){var v=n.getAttribute("src");w=P[i.pdf.sHashCode(v)||v];}if(w){i.pdf.internal.pageSize.getHeight()-i.pdf.margins_doc.bottom<i.y+n.height&&i.y>i.pdf.margins_doc.top&&(i.pdf.addPage(), i.y=i.pdf.margins_doc.top, i.executeWatchFunctions(n));var b=q(n),x=i.x,S=12/i.pdf.internal.scaleFactor,k=(b["margin-left"]+b["padding-left"])*S,_=(b["margin-right"]+b["padding-right"])*S,C=(b["margin-top"]+b["padding-top"])*S,I=(b["margin-bottom"]+b["padding-bottom"])*S;void 0!==b.float&&"right"===b.float?x+=i.settings.width-n.width-_:x+=k, i.pdf.addImage(w,x,i.y+C,n.width,n.height), w=void 0, "right"===b.float||"left"===b.float?(i.watchFunctions.push(function(t,e,n,r){return i.y>=e?(i.x+=t, i.settings.width+=n, !0):!!(r&&1===r.nodeType&&!B[r.nodeName]&&i.x+r.width>i.pdf.margins_doc.left+i.pdf.margins_doc.width)&&(i.x+=t, i.y=e, i.settings.width+=n, !0)}.bind(this,"left"===b.float?-n.width-k-_:0,i.y+n.height+C+I,n.width)), i.watchFunctions.push(function(t,e,n){return!(i.y<t&&e===i.pdf.internal.getNumberOfPages())||1===n.nodeType&&"both"===q(n).clear&&(i.y=t, !0)}.bind(this,i.y+n.height,i.pdf.internal.getNumberOfPages())), i.settings.width-=n.width+k+_, "left"===b.float&&(i.x+=n.width+k+_)):i.y+=n.height+C+I;}else if("TABLE"===n.nodeName)l=O(n,i), i.y+=10, i.pdf.table(i.x,i.y,l.rows,l.headers,{autoSize:!1,printHeaders:e.printHeaders,margins:i.pdf.margins_doc,css:q(n)}), i.y=i.pdf.lastCellPos.y+i.pdf.lastCellPos.h+20;else if("OL"===n.nodeName||"UL"===n.nodeName)j=1, E(n,i,e)||F(n,i,e), i.y+=10;else if("LI"===n.nodeName){var A=i.x;i.x+=20/i.pdf.internal.scaleFactor, i.y+=3, E(n,i,e)||F(n,i,e), i.x=A;}else"BR"===n.nodeName?(i.y+=o["font-size"]*i.pdf.internal.scaleFactor, i.addText("\u2028",T(o))):E(n,i,e)||F(n,i,e);}}a++;}if(e.outY=i.y, s)return i.setBlockBoundary(h)}, P={}, p=function(t,o,e,n){var a,r=t.getElementsByTagName("img"),i=r.length,s=0;function c(){o.pdf.internal.events.publish("imagesLoaded"), n(a);}function l(e,n,r){if(e){var i=new Image;a=++s, i.crossOrigin="", i.onerror=i.onload=function(){if(i.complete&&(0===i.src.indexOf("data:image/")&&(i.width=n||i.width||0, i.height=r||i.height||0), i.width+i.height)){var t=o.pdf.sHashCode(e)||e;P[t]=P[t]||i;}--s||c();}, i.src=e;}}for(;i--;)l(r[i].getAttribute("src"),r[i].width,r[i].height);return s||c()}, g=function(t,o,a){var s=t.getElementsByTagName("footer");if(0<s.length){s=s[0];var e=o.pdf.internal.write,n=o.y;o.pdf.internal.write=function(){}, F(s,o,a);var c=Math.ceil(o.y-n)+5;o.y=n, o.pdf.internal.write=e, o.pdf.margins_doc.bottom+=c;for(var r=function(t){var e=void 0!==t?t.pageNumber:1,n=o.y;o.y=o.pdf.internal.pageSize.getHeight()-o.pdf.margins_doc.bottom, o.pdf.margins_doc.bottom-=c;for(var r=s.getElementsByTagName("span"),i=0;i<r.length;++i)-1<(" "+r[i].className+" ").replace(/[\n\t]/g," ").indexOf(" pageCounter ")&&(r[i].innerHTML=e), -1<(" "+r[i].className+" ").replace(/[\n\t]/g," ").indexOf(" totalPages ")&&(r[i].innerHTML="###jsPDFVarTotalPages###");F(s,o,a), o.pdf.margins_doc.bottom+=c, o.y=n;},i=s.getElementsByTagName("span"),l=0;l<i.length;++l)-1<(" "+i[l].className+" ").replace(/[\n\t]/g," ").indexOf(" totalPages ")&&o.pdf.internal.events.subscribe("htmlRenderingFinished",o.pdf.putTotalPages.bind(o.pdf,"###jsPDFVarTotalPages###"),!0);o.pdf.internal.events.subscribe("addPage",r,!1), r(), B.FOOTER=1;}}, m=function(t,e,n,r,i,o){if(!e)return!1;var a,s,c,l;"string"==typeof e||e.parentNode||(e=""+e.innerHTML), "string"==typeof e&&(a=e.replace(/<\/?script[^>]*?>/gi,""), l="jsPDFhtmlText"+Date.now().toString()+(1e3*Math.random()).toFixed(0), (c=document.createElement("div")).style.cssText="position: absolute !important;clip: rect(1px 1px 1px 1px); /* IE6, IE7 */clip: rect(1px, 1px, 1px, 1px);padding:0 !important;border:0 !important;height: 1px !important;width: 1px !important; top:auto;left:-100px;overflow: hidden;", c.innerHTML='<iframe style="height:1px;width:1px" name="'+l+'" />', document.body.appendChild(c), (s=window.frames[l]).document.open(), s.document.writeln(a), s.document.close(), e=s.document.body);var h,u=new f(t,n,r,i);return p.call(this,e,u,i.elementHandlers,function(t){g(e,u,i.elementHandlers), F(e,u,i.elementHandlers), u.pdf.internal.events.publish("htmlRenderingFinished"), h=u.dispose(), "function"==typeof o?o(h):t&&console.error("jsPDF Warning: rendering issues? provide a callback to fromHTML!");}), h||{x:u.x,y:u.y}}, (f=function(t,e,n,r){return this.pdf=t, this.x=e, this.y=n, this.settings=r, this.watchFunctions=[], this.init(), this}).prototype.init=function(){return this.paragraph={text:[],style:[]}, this.pdf.internal.write("q")}, f.prototype.dispose=function(){return this.pdf.internal.write("Q"), {x:this.x,y:this.y,ready:!0}}, f.prototype.executeWatchFunctions=function(t){var e=!1,n=[];if(0<this.watchFunctions.length){for(var r=0;r<this.watchFunctions.length;++r)!0===this.watchFunctions[r](t)?e=!0:n.push(this.watchFunctions[r]);this.watchFunctions=n;}return e}, f.prototype.splitFragmentsIntoLines=function(t,e){var n,r,i,o,a,s,c,l,h,u,f,d,p,g;for(u=this.pdf.internal.scaleFactor, o={}, s=c=l=g=a=i=h=r=void 0, d=[f=[]], n=0, p=this.settings.width;t.length;)if(a=t.shift(), g=e.shift(), a)if((i=o[(r=g["font-family"])+(h=g["font-style"])])||(i=this.pdf.internal.getFont(r,h).metadata.Unicode, o[r+h]=i), l={widths:i.widths,kerning:i.kerning,fontSize:12*g["font-size"],textIndent:n}, c=this.pdf.getStringUnitWidth(a,l)*l.fontSize/u, "\u2028"==a)f=[], d.push(f);else if(p<n+c){for(s=this.pdf.splitTextToSize(a,p,l), f.push([s.shift(),g]);s.length;)f=[[s.shift(),g]], d.push(f);n=this.pdf.getStringUnitWidth(f[0][0],l)*l.fontSize/u;}else f.push([a,g]), n+=c;if(void 0!==g["text-align"]&&("center"===g["text-align"]||"right"===g["text-align"]||"justify"===g["text-align"]))for(var m=0;m<d.length;++m){var y=this.pdf.getStringUnitWidth(d[m][0][0],l)*l.fontSize/u;0<m&&(d[m][0][1]=T(d[m][0][1]));var w=p-y;if("right"===g["text-align"])d[m][0][1]["margin-left"]=w;else if("center"===g["text-align"])d[m][0][1]["margin-left"]=w/2;else if("justify"===g["text-align"]){var v=d[m][0][0].split(" ").length-1;d[m][0][1]["word-spacing"]=w/v, m===d.length-1&&(d[m][0][1]["word-spacing"]=0);}}return d}, f.prototype.RenderTextFragment=function(t,e){var n,r;r=0, this.pdf.internal.pageSize.getHeight()-this.pdf.margins_doc.bottom<this.y+this.pdf.internal.getFontSize()&&(this.pdf.internal.write("ET","Q"), this.pdf.addPage(), this.y=this.pdf.margins_doc.top, this.pdf.internal.write("q","BT",this.getPdfColor(e.color),this.pdf.internal.getCoordinateString(this.x),this.pdf.internal.getVerticalCoordinateString(this.y),"Td"), r=Math.max(r,e["line-height"],e["font-size"]), this.pdf.internal.write(0,(-12*r).toFixed(2),"Td")), n=this.pdf.internal.getFont(e["font-family"],e["font-style"]);var i=this.getPdfColor(e.color);i!==this.lastTextColor&&(this.pdf.internal.write(i), this.lastTextColor=i), void 0!==e["word-spacing"]&&0<e["word-spacing"]&&this.pdf.internal.write(e["word-spacing"].toFixed(2),"Tw"), this.pdf.internal.write("/"+n.id,(12*e["font-size"]).toFixed(2),"Tf","("+this.pdf.internal.pdfEscape(t)+") Tj"), void 0!==e["word-spacing"]&&this.pdf.internal.write(0,"Tw");}, f.prototype.getPdfColor=function(t){var e,n,r,i=/rgb\s*\(\s*(\d+),\s*(\d+),\s*(\d+\s*)\)/.exec(t);if(null!=i?(e=parseInt(i[1]), n=parseInt(i[2]), r=parseInt(i[3])):("#"!=t.charAt(0)&&((t=dt.colorNameToHex(t))||(t="#000000")), e=t.substring(1,3), e=parseInt(e,16), n=t.substring(3,5), n=parseInt(n,16), r=t.substring(5,7), r=parseInt(r,16)), "string"==typeof e&&/^#[0-9A-Fa-f]{6}$/.test(e)){var o=parseInt(e.substr(1),16);e=o>>16&255, n=o>>8&255, r=255&o;}var a=this.f3;return 0===e&&0===n&&0===r||void 0===n?a(e/255)+" g":[a(e/255),a(n/255),a(r/255),"rg"].join(" ")}, f.prototype.f3=function(t){return t.toFixed(3)}, f.prototype.renderParagraph=function(t){var e,n,r,i,o,a,s,c,l,h,u,f,d;if(r=v(this.paragraph.text), f=this.paragraph.style, e=this.paragraph.blockstyle, this.paragraph.priorblockstyle||{}, this.paragraph={text:[],style:[],blockstyle:{},priorblockstyle:e}, r.join("").trim()){s=this.splitFragmentsIntoLines(r,f), c=a=void 0, n=12/this.pdf.internal.scaleFactor, this.priorMarginBottom=this.priorMarginBottom||0, u=(Math.max((e["margin-top"]||0)-this.priorMarginBottom,0)+(e["padding-top"]||0))*n, h=((e["margin-bottom"]||0)+(e["padding-bottom"]||0))*n, this.priorMarginBottom=e["margin-bottom"]||0, "always"===e["page-break-before"]&&(this.pdf.addPage(), this.y=0, u=((e["margin-top"]||0)+(e["padding-top"]||0))*n), l=this.pdf.internal.write, o=i=void 0, this.y+=u, l("q","BT 0 g",this.pdf.internal.getCoordinateString(this.x),this.pdf.internal.getVerticalCoordinateString(this.y),"Td");for(var p=0;s.length;){for(i=c=0, o=(a=s.shift()).length;i!==o;)a[i][0].trim()&&(c=Math.max(c,a[i][1]["line-height"],a[i][1]["font-size"]), d=7*a[i][1]["font-size"]), i++;var g=0,m=0;for(void 0!==a[0][1]["margin-left"]&&0<a[0][1]["margin-left"]&&(g=(m=this.pdf.internal.getCoordinateString(a[0][1]["margin-left"]))-p, p=m), l(g+Math.max(e["margin-left"]||0,0)*n,(-12*c).toFixed(2),"Td"), i=0, o=a.length;i!==o;)a[i][0]&&this.RenderTextFragment(a[i][0],a[i][1]), i++;if(this.y+=c*n, this.executeWatchFunctions(a[0][1])&&0<s.length){var y=[],w=[];s.forEach(function(t){for(var e=0,n=t.length;e!==n;)t[e][0]&&(y.push(t[e][0]+" "), w.push(t[e][1])), ++e;}), s=this.splitFragmentsIntoLines(v(y),w), l("ET","Q"), l("q","BT 0 g",this.pdf.internal.getCoordinateString(this.x),this.pdf.internal.getVerticalCoordinateString(this.y),"Td");}}return t&&"function"==typeof t&&t.call(this,this.x-9,this.y-d/2), l("ET","Q"), this.y+=h}}, f.prototype.setBlockBoundary=function(t){return this.renderParagraph(t)}, f.prototype.setBlockStyle=function(t){return this.paragraph.blockstyle=t}, f.prototype.addText=function(t,e){return this.paragraph.text.push(t), this.paragraph.style.push(e)}, i={helvetica:"helvetica","sans-serif":"helvetica","times new roman":"times",serif:"times",times:"times",monospace:"courier",courier:"courier"}, c={100:"normal",200:"normal",300:"normal",400:"normal",500:"bold",600:"bold",700:"bold",800:"bold",900:"bold",normal:"normal",bold:"bold",bolder:"bold",lighter:"normal"}, a={normal:"normal",italic:"italic",oblique:"italic"}, s={left:"left",right:"right",center:"center",justify:"justify"}, l={none:"none",right:"right",left:"left"}, h={none:"none",both:"both"}, n={normal:1}, t.fromHTML=function(t,e,n,r,i,o){return this.margins_doc=o||{top:0,bottom:0}, r||(r={}), r.elementHandlers||(r.elementHandlers={}), m(this,t,isNaN(e)?4:e,isNaN(n)?4:n,r,i)};}(K.API), K.API.addJS=function(t){return s=t, this.internal.events.subscribe("postPutResources",function(t){n=this.internal.newObject(), this.internal.out("<<"), this.internal.out("/Names [(EmbeddedJS) "+(n+1)+" 0 R]"), this.internal.out(">>"), this.internal.out("endobj"), r=this.internal.newObject(), this.internal.out("<<"), this.internal.out("/S /JavaScript"), this.internal.out("/JS ("+s+")"), this.internal.out(">>"), this.internal.out("endobj");}), this.internal.events.subscribe("putCatalog",function(){void 0!==n&&void 0!==r&&this.internal.out("/Names <</JavaScript "+n+" 0 R>>");}), this}, (
/**
   * jsPDF Outline PlugIn
   * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */
l=K.API).events.push(["postPutResources",function(){var t=this,e=/^(\d+) 0 obj$/;if(0<this.outline.root.children.length)for(var n=t.outline.render().split(/\r\n/),r=0;r<n.length;r++){var i=n[r],o=e.exec(i);if(null!=o){var a=o[1];t.internal.newObjectDeferredBegin(a);}t.internal.write(i);}if(this.outline.createNamedDestinations){var s=this.internal.pages.length,c=[];for(r=0;r<s;r++){var l=t.internal.newObject();c.push(l);var h=t.internal.getPageInfo(r+1);t.internal.write("<< /D["+h.objId+" 0 R /XYZ null null null]>> endobj");}var u=t.internal.newObject();for(t.internal.write("<< /Names [ "), r=0;r<c.length;r++)t.internal.write("(page_"+(r+1)+")"+c[r]+" 0 R");t.internal.write(" ] >>","endobj"), t.internal.newObject(), t.internal.write("<< /Dests "+u+" 0 R"), t.internal.write(">>","endobj");}}]), l.events.push(["putCatalog",function(){0<this.outline.root.children.length&&(this.internal.write("/Outlines",this.outline.makeRef(this.outline.root)), this.outline.createNamedDestinations&&this.internal.write("/Names "+namesOid+" 0 R"));}]), l.events.push(["initialized",function(){var o=this;o.outline={createNamedDestinations:!1,root:{children:[]}}, o.outline.add=function(t,e,n){var r={title:e,options:n,children:[]};return null==t&&(t=this.root), t.children.push(r), r}, o.outline.render=function(){return this.ctx={}, this.ctx.val="", this.ctx.pdf=o, this.genIds_r(this.root), this.renderRoot(this.root), this.renderItems(this.root), this.ctx.val}, o.outline.genIds_r=function(t){t.id=o.internal.newObjectDeferred();for(var e=0;e<t.children.length;e++)this.genIds_r(t.children[e]);}, o.outline.renderRoot=function(t){this.objStart(t), this.line("/Type /Outlines"), 0<t.children.length&&(this.line("/First "+this.makeRef(t.children[0])), this.line("/Last "+this.makeRef(t.children[t.children.length-1]))), this.line("/Count "+this.count_r({count:0},t)), this.objEnd();}, o.outline.renderItems=function(t){for(var e=0;e<t.children.length;e++){var n=t.children[e];this.objStart(n), this.line("/Title "+this.makeString(n.title)), this.line("/Parent "+this.makeRef(t)), 0<e&&this.line("/Prev "+this.makeRef(t.children[e-1])), e<t.children.length-1&&this.line("/Next "+this.makeRef(t.children[e+1])), 0<n.children.length&&(this.line("/First "+this.makeRef(n.children[0])), this.line("/Last "+this.makeRef(n.children[n.children.length-1])));var r=this.count=this.count_r({count:0},n);if(0<r&&this.line("/Count "+r), n.options&&n.options.pageNumber){var i=o.internal.getPageInfo(n.options.pageNumber);this.line("/Dest ["+i.objId+" 0 R /XYZ 0 "+this.ctx.pdf.internal.pageSize.getHeight()*this.ctx.pdf.internal.scaleFactor+" 0]");}this.objEnd();}for(e=0;e<t.children.length;e++)n=t.children[e], this.renderItems(n);}, o.outline.line=function(t){this.ctx.val+=t+"\r\n";}, o.outline.makeRef=function(t){return t.id+" 0 R"}, o.outline.makeString=function(t){return"("+o.internal.pdfEscape(t)+")"}, o.outline.objStart=function(t){this.ctx.val+="\r\n"+t.id+" 0 obj\r\n<<\r\n";}, o.outline.objEnd=function(t){this.ctx.val+=">> \r\nendobj\r\n";}, o.outline.count_r=function(t,e){for(var n=0;n<e.children.length;n++)t.count++, this.count_r(t,e.children[n]);return t.count};}]), q=K.API, E=function(){var t="function"==typeof Deflater;if(!t)throw new Error("requires deflate.js for compression");return t}, P=function(t,e,n,r){var i=5,o=b;switch(r){case q.image_compression.FAST:i=3, o=v;break;case q.image_compression.MEDIUM:i=6, o=x;break;case q.image_compression.SLOW:i=9, o=S;}t=y(t,e,n,o);var a=new Uint8Array(g(i)),s=m(t),c=new Deflater(i),l=c.append(t),h=c.flush(),u=a.length+l.length+h.length,f=new Uint8Array(u+4);return f.set(a), f.set(l,a.length), f.set(h,a.length+l.length), f[u++]=s>>>24&255, f[u++]=s>>>16&255, f[u++]=s>>>8&255, f[u++]=255&s, q.arrayBufferToBinaryString(f)}, g=function(t,e){var n=Math.LOG2E*Math.log(32768)-8<<4|8,r=n<<8;return r|=Math.min(3,(e-1&255)>>1)<<6, r|=0, [n,255&(r+=31-r%31)]}, m=function(t,e){for(var n,r=1,i=0,o=t.length,a=0;0<o;){for(o-=n=e<o?e:o;i+=r+=t[a++], --n;);r%=65521, i%=65521;}return(i<<16|r)>>>0}, y=function(t,e,n,r){for(var i,o,a,s=t.length/e,c=new Uint8Array(t.length+s),l=k(),h=0;h<s;h++){if(a=h*e, i=t.subarray(a,a+e), r)c.set(r(i,n,o),a+h);else{for(var u=0,f=l.length,d=[];u<f;u++)d[u]=l[u](i,n,o);var p=_(d.concat());c.set(d[p],a+h);}o=i;}return c}, h=function(t,e,n){var r=Array.apply([],t);return r.unshift(0), r}, v=function(t,e,n){var r,i=[],o=0,a=t.length;for(i[0]=1;o<a;o++)r=t[o-e]||0, i[o+1]=t[o]-r+256&255;return i}, b=function(t,e,n){var r,i=[],o=0,a=t.length;for(i[0]=2;o<a;o++)r=n&&n[o]||0, i[o+1]=t[o]-r+256&255;return i}, x=function(t,e,n){var r,i,o=[],a=0,s=t.length;for(o[0]=3;a<s;a++)r=t[a-e]||0, i=n&&n[a]||0, o[a+1]=t[a]+256-(r+i>>>1)&255;return o}, S=function(t,e,n){var r,i,o,a,s=[],c=0,l=t.length;for(s[0]=4;c<l;c++)r=t[c-e]||0, i=n&&n[c]||0, o=n&&n[c-e]||0, a=u(r,i,o), s[c+1]=t[c]-a+256&255;return s}, u=function(t,e,n){var r=t+e-n,i=Math.abs(r-t),o=Math.abs(r-e),a=Math.abs(r-n);return i<=o&&i<=a?t:o<=a?e:n}, k=function(){return[h,v,b,x,S]}, _=function(t){for(var e,n,r,i=0,o=t.length;i<o;)((e=f(t[i].slice(1)))<n||!n)&&(n=e, r=i), i++;return r}, f=function(t){for(var e=0,n=t.length,r=0;e<n;)r+=Math.abs(t[e++]);return r}, q.processPNG=function(t,e,n,r,i){var o,a,s,c,l,h,u=this.color_spaces.DEVICE_RGB,f=this.decode.FLATE_DECODE,d=8;if(this.isArrayBuffer(t)&&(t=new Uint8Array(t)), this.isArrayBufferView(t)){if("function"!=typeof PNG||"function"!=typeof gt)throw new Error("PNG support requires png.js and zlib.js");if(t=(o=new PNG(t)).imgData, d=o.bits, u=o.colorSpace, c=o.colors, -1!==[4,6].indexOf(o.colorType)){if(8===o.bits)for(var p,g=(I=32==o.pixelBitlength?new Uint32Array(o.decodePixels().buffer):16==o.pixelBitlength?new Uint16Array(o.decodePixels().buffer):new Uint8Array(o.decodePixels().buffer)).length,m=new Uint8Array(g*o.colors),y=new Uint8Array(g),w=o.pixelBitlength-o.bits,v=0,b=0;v<g;v++){for(x=I[v], p=0;p<w;)m[b++]=x>>>p&255, p+=o.bits;y[v]=x>>>p&255;}if(16===o.bits){g=(I=new Uint32Array(o.decodePixels().buffer)).length, m=new Uint8Array(g*(32/o.pixelBitlength)*o.colors), y=new Uint8Array(g*(32/o.pixelBitlength));for(var x,S=1<o.colors,k=b=v=0;v<g;)x=I[v++], m[b++]=x>>>0&255, S&&(m[b++]=x>>>16&255, x=I[v++], m[b++]=x>>>0&255), y[k++]=x>>>16&255;d=8;}r!==q.image_compression.NONE&&E()?(t=P(m,o.width*o.colors,o.colors,r), h=P(y,o.width,1,r)):(t=m, h=y, f=null);}if(3===o.colorType&&(u=this.color_spaces.INDEXED, l=o.palette, o.transparency.indexed)){var _=o.transparency.indexed,C=0;for(v=0, g=_.length;v<g;++v)C+=_[v];if((C/=255)==g-1&&-1!==_.indexOf(0))s=[_.indexOf(0)];else if(C!==g){var I=o.decodePixels();for(y=new Uint8Array(I.length), v=0, g=I.length;v<g;v++)y[v]=_[I[v]];h=P(y,o.width,1);}}var A=function(t){var e;switch(t){case q.image_compression.FAST:e=11;break;case q.image_compression.MEDIUM:e=13;break;case q.image_compression.SLOW:e=14;break;default:e=12;}return e}(r);return a=f===this.decode.FLATE_DECODE?"/Predictor "+A+" /Colors "+c+" /BitsPerComponent "+d+" /Columns "+o.width:"/Colors "+c+" /BitsPerComponent "+d+" /Columns "+o.width, (this.isArrayBuffer(t)||this.isArrayBufferView(t))&&(t=this.arrayBufferToBinaryString(t)), (h&&this.isArrayBuffer(h)||this.isArrayBufferView(h))&&(h=this.arrayBufferToBinaryString(h)), this.createImageInfo(t,o.width,o.height,u,d,f,e,n,a,s,l,h,A)}throw new Error("Unsupported PNG image data, try using JPEG instead.")}, K.API.setLanguage=function(t){return void 0===this.internal.languageSettings&&(this.internal.languageSettings={}, this.internal.languageSettings.isSubscribed=!1), void 0!=={af:"Afrikaans",sq:"Albanian",ar:"Arabic (Standard)","ar-DZ":"Arabic (Algeria)","ar-BH":"Arabic (Bahrain)","ar-EG":"Arabic (Egypt)","ar-IQ":"Arabic (Iraq)","ar-JO":"Arabic (Jordan)","ar-KW":"Arabic (Kuwait)","ar-LB":"Arabic (Lebanon)","ar-LY":"Arabic (Libya)","ar-MA":"Arabic (Morocco)","ar-OM":"Arabic (Oman)","ar-QA":"Arabic (Qatar)","ar-SA":"Arabic (Saudi Arabia)","ar-SY":"Arabic (Syria)","ar-TN":"Arabic (Tunisia)","ar-AE":"Arabic (U.A.E.)","ar-YE":"Arabic (Yemen)",an:"Aragonese",hy:"Armenian",as:"Assamese",ast:"Asturian",az:"Azerbaijani",eu:"Basque",be:"Belarusian",bn:"Bengali",bs:"Bosnian",br:"Breton",bg:"Bulgarian",my:"Burmese",ca:"Catalan",ch:"Chamorro",ce:"Chechen",zh:"Chinese","zh-HK":"Chinese (Hong Kong)","zh-CN":"Chinese (PRC)","zh-SG":"Chinese (Singapore)","zh-TW":"Chinese (Taiwan)",cv:"Chuvash",co:"Corsican",cr:"Cree",hr:"Croatian",cs:"Czech",da:"Danish",nl:"Dutch (Standard)","nl-BE":"Dutch (Belgian)",en:"English","en-AU":"English (Australia)","en-BZ":"English (Belize)","en-CA":"English (Canada)","en-IE":"English (Ireland)","en-JM":"English (Jamaica)","en-NZ":"English (New Zealand)","en-PH":"English (Philippines)","en-ZA":"English (South Africa)","en-TT":"English (Trinidad & Tobago)","en-GB":"English (United Kingdom)","en-US":"English (United States)","en-ZW":"English (Zimbabwe)",eo:"Esperanto",et:"Estonian",fo:"Faeroese",fj:"Fijian",fi:"Finnish",fr:"French (Standard)","fr-BE":"French (Belgium)","fr-CA":"French (Canada)","fr-FR":"French (France)","fr-LU":"French (Luxembourg)","fr-MC":"French (Monaco)","fr-CH":"French (Switzerland)",fy:"Frisian",fur:"Friulian",gd:"Gaelic (Scots)","gd-IE":"Gaelic (Irish)",gl:"Galacian",ka:"Georgian",de:"German (Standard)","de-AT":"German (Austria)","de-DE":"German (Germany)","de-LI":"German (Liechtenstein)","de-LU":"German (Luxembourg)","de-CH":"German (Switzerland)",el:"Greek",gu:"Gujurati",ht:"Haitian",he:"Hebrew",hi:"Hindi",hu:"Hungarian",is:"Icelandic",id:"Indonesian",iu:"Inuktitut",ga:"Irish",it:"Italian (Standard)","it-CH":"Italian (Switzerland)",ja:"Japanese",kn:"Kannada",ks:"Kashmiri",kk:"Kazakh",km:"Khmer",ky:"Kirghiz",tlh:"Klingon",ko:"Korean","ko-KP":"Korean (North Korea)","ko-KR":"Korean (South Korea)",la:"Latin",lv:"Latvian",lt:"Lithuanian",lb:"Luxembourgish",mk:"FYRO Macedonian",ms:"Malay",ml:"Malayalam",mt:"Maltese",mi:"Maori",mr:"Marathi",mo:"Moldavian",nv:"Navajo",ng:"Ndonga",ne:"Nepali",no:"Norwegian",nb:"Norwegian (Bokmal)",nn:"Norwegian (Nynorsk)",oc:"Occitan",or:"Oriya",om:"Oromo",fa:"Persian","fa-IR":"Persian/Iran",pl:"Polish",pt:"Portuguese","pt-BR":"Portuguese (Brazil)",pa:"Punjabi","pa-IN":"Punjabi (India)","pa-PK":"Punjabi (Pakistan)",qu:"Quechua",rm:"Rhaeto-Romanic",ro:"Romanian","ro-MO":"Romanian (Moldavia)",ru:"Russian","ru-MO":"Russian (Moldavia)",sz:"Sami (Lappish)",sg:"Sango",sa:"Sanskrit",sc:"Sardinian",sd:"Sindhi",si:"Singhalese",sr:"Serbian",sk:"Slovak",sl:"Slovenian",so:"Somani",sb:"Sorbian",es:"Spanish","es-AR":"Spanish (Argentina)","es-BO":"Spanish (Bolivia)","es-CL":"Spanish (Chile)","es-CO":"Spanish (Colombia)","es-CR":"Spanish (Costa Rica)","es-DO":"Spanish (Dominican Republic)","es-EC":"Spanish (Ecuador)","es-SV":"Spanish (El Salvador)","es-GT":"Spanish (Guatemala)","es-HN":"Spanish (Honduras)","es-MX":"Spanish (Mexico)","es-NI":"Spanish (Nicaragua)","es-PA":"Spanish (Panama)","es-PY":"Spanish (Paraguay)","es-PE":"Spanish (Peru)","es-PR":"Spanish (Puerto Rico)","es-ES":"Spanish (Spain)","es-UY":"Spanish (Uruguay)","es-VE":"Spanish (Venezuela)",sx:"Sutu",sw:"Swahili",sv:"Swedish","sv-FI":"Swedish (Finland)","sv-SV":"Swedish (Sweden)",ta:"Tamil",tt:"Tatar",te:"Teluga",th:"Thai",tig:"Tigre",ts:"Tsonga",tn:"Tswana",tr:"Turkish",tk:"Turkmen",uk:"Ukrainian",hsb:"Upper Sorbian",ur:"Urdu",ve:"Venda",vi:"Vietnamese",vo:"Volapuk",wa:"Walloon",cy:"Welsh",xh:"Xhosa",ji:"Yiddish",zu:"Zulu"}[t]&&(this.internal.languageSettings.languageCode=t, !1===this.internal.languageSettings.isSubscribed&&(this.internal.events.subscribe("putCatalog",function(){this.internal.write("/Lang ("+this.internal.languageSettings.languageCode+")");}), this.internal.languageSettings.isSubscribed=!0)), this}, C=K.API, O=C.getCharWidthsArray=function(t,e){e||(e={});var n,r=t.length,i=[];if(e.font){var o=e.fontSize,a=e.charSpace;for(n=0;n<r;n++)i.push(e.font.widthOfString(t[n],o,a)/o);return i}var s=e.widths?e.widths:this.internal.getFont().metadata.Unicode.widths,c=s.fof?s.fof:1,l=e.kerning?e.kerning:this.internal.getFont().metadata.Unicode.kerning,h=l.fof?l.fof:1,u=0,f=0,d=s[0]||c;for(n=0, r=t.length;n<r;n++)u=t.charCodeAt(n), i.push((s[u]||d)/c+(l[u]&&l[u][f]||0)/h), f=u;return i}, B=function(t){for(var e=t.length,n=0;e;)n+=t[--e];return n}, j=C.getStringUnitWidth=function(t,e){return B(O.call(this,t,e))}, R=function(t,e,n,r){for(var i=[],o=0,a=t.length,s=0;o!==a&&s+e[o]<n;)s+=e[o], o++;i.push(t.slice(0,o));var c=o;for(s=0;o!==a;)s+e[o]>r&&(i.push(t.slice(c,o)), s=0, c=o), s+=e[o], o++;return c!==o&&i.push(t.slice(c,o)), i}, D=function(t,e,n){n||(n={});var r,i,o,a,s,c,l=[],h=[l],u=n.textIndent||0,f=0,d=0,p=t.split(" "),g=O(" ",n)[0];if(c=-1===n.lineIndent?p[0].length+2:n.lineIndent||0){var m=Array(c).join(" "),y=[];p.map(function(t){1<(t=t.split(/\s*\n/)).length?y=y.concat(t.map(function(t,e){return(e&&t.length?"\n":"")+t})):y.push(t[0]);}), p=y, c=j(m,n);}for(o=0, a=p.length;o<a;o++){var w=0;if(r=p[o], c&&"\n"==r[0]&&(r=r.substr(1), w=1), i=O(r,n), e<u+f+(d=B(i))||w){if(e<d){for(s=R(r,i,e-(u+f),e), l.push(s.shift()), l=[s.pop()];s.length;)h.push([s.shift()]);d=B(i.slice(r.length-(l[0]?l[0].length:0)));}else l=[r];h.push(l), u=d+c, f=g;}else l.push(r), u+=f+d, f=g;}if(c)var v=function(t,e){return(e?m:"")+t.join(" ")};else v=function(t){return t.join(" ")};return h.map(v)}, C.splitTextToSize=function(t,e,n){n||(n={});var r,i=n.fontSize||this.internal.getFontSize(),o=function(t){var e={0:1},n={};if(t.widths&&t.kerning)return{widths:t.widths,kerning:t.kerning};var r=this.internal.getFont(t.fontName,t.fontStyle),i="Unicode";return r.metadata[i]?{widths:r.metadata[i].widths||e,kerning:r.metadata[i].kerning||n}:{font:r.metadata,fontSize:this.internal.getFontSize(),charSpace:this.internal.getCharSpace()}}.call(this,n);r=Array.isArray(t)?t:t.split(/\r?\n/);var a=1*this.internal.scaleFactor*e/i;o.textIndent=n.textIndent?1*n.textIndent*this.internal.scaleFactor/i:0, o.lineIndent=n.lineIndent;var s,c,l=[];for(s=0, c=r.length;s<c;s++)l=l.concat(D(r[s],a,o));return l}, M=K.API, N={codePages:["WinAnsiEncoding"],WinAnsiEncoding:(z=function(t){for(var e="klmnopqrstuvwxyz",n={},r=0;r<e.length;r++)n[e[r]]="0123456789abcdef"[r];var i,o,a,s,c,l={},h=1,u=l,f=[],d="",p="",g=t.length-1;for(r=1;r!=g;)c=t[r], r+=1, "'"==c?o?(s=o.join(""), o=i):o=[]:o?o.push(c):"{"==c?(f.push([u,s]), u={}, s=i):"}"==c?((a=f.pop())[0][a[1]]=u, s=i, u=a[0]):"-"==c?h=-1:s===i?n.hasOwnProperty(c)?(d+=n[c], s=parseInt(d,16)*h, h=1, d=""):d+=c:n.hasOwnProperty(c)?(p+=n[c], u[s]=parseInt(p,16)*h, h=1, s=i, p=""):p+=c;return l})("{19m8n201n9q201o9r201s9l201t9m201u8m201w9n201x9o201y8o202k8q202l8r202m9p202q8p20aw8k203k8t203t8v203u9v2cq8s212m9t15m8w15n9w2dw9s16k8u16l9u17s9z17x8y17y9y}")}, L={Unicode:{Courier:N,"Courier-Bold":N,"Courier-BoldOblique":N,"Courier-Oblique":N,Helvetica:N,"Helvetica-Bold":N,"Helvetica-BoldOblique":N,"Helvetica-Oblique":N,"Times-Roman":N,"Times-Bold":N,"Times-BoldItalic":N,"Times-Italic":N}
/** 
    Resources:
    Font metrics data is reprocessed derivative of contents of
    "Font Metrics for PDF Core 14 Fonts" package, which exhibits the following copyright and license:
    
    Copyright (c) 1989, 1990, 1991, 1992, 1993, 1997 Adobe Systems Incorporated. All Rights Reserved.
    
    This file and the 14 PostScript(R) AFM files it accompanies may be used,
    copied, and distributed for any purpose and without charge, with or without
    modification, provided that all copyright notices are retained; that the AFM
    files are not distributed without this file; that all modifications to this
    file or any of the AFM files are prominently noted in the modified file(s);
    and that this paragraph is not modified. Adobe Systems has no responsibility
    or obligation to support the use of the AFM files.
    
    */}, U={Unicode:{"Courier-Oblique":z("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),"Times-BoldItalic":z("{'widths'{k3o2q4ycx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2r202m2n2n3m2o3m2p5n202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5n4l4m4m4m4n4m4o4s4p4m4q4m4r4s4s4y4t2r4u3m4v4m4w3x4x5t4y4s4z4s5k3x5l4s5m4m5n3r5o3x5p4s5q4m5r5t5s4m5t3x5u3x5v2l5w1w5x2l5y3t5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q2l6r3m6s3r6t1w6u1w6v3m6w1w6x4y6y3r6z3m7k3m7l3m7m2r7n2r7o1w7p3r7q2w7r4m7s3m7t2w7u2r7v2n7w1q7x2n7y3t202l3mcl4mal2ram3man3mao3map3mar3mas2lat4uau1uav3maw3way4uaz2lbk2sbl3t'fof'6obo2lbp3tbq3mbr1tbs2lbu1ybv3mbz3mck4m202k3mcm4mcn4mco4mcp4mcq5ycr4mcs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz2w203k6o212m6o2dw2l2cq2l3t3m3u2l17s3x19m3m}'kerning'{cl{4qu5kt5qt5rs17ss5ts}201s{201ss}201t{cks4lscmscnscoscpscls2wu2yu201ts}201x{2wu2yu}2k{201ts}2w{4qx5kx5ou5qx5rs17su5tu}2x{17su5tu5ou}2y{4qx5kx5ou5qx5rs17ss5ts}'fof'-6ofn{17sw5tw5ou5qw5rs}7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qs}3v{17su5tu5os5qs}7p{17su5tu}ck{4qu5kt5qt5rs17ss5ts}4l{4qu5kt5qt5rs17ss5ts}cm{4qu5kt5qt5rs17ss5ts}cn{4qu5kt5qt5rs17ss5ts}co{4qu5kt5qt5rs17ss5ts}cp{4qu5kt5qt5rs17ss5ts}6l{4qu5ou5qw5rt17su5tu}5q{ckuclucmucnucoucpu4lu}5r{ckuclucmucnucoucpu4lu}7q{cksclscmscnscoscps4ls}6p{4qu5ou5qw5rt17sw5tw}ek{4qu5ou5qw5rt17su5tu}el{4qu5ou5qw5rt17su5tu}em{4qu5ou5qw5rt17su5tu}en{4qu5ou5qw5rt17su5tu}eo{4qu5ou5qw5rt17su5tu}ep{4qu5ou5qw5rt17su5tu}es{17ss5ts5qs4qu}et{4qu5ou5qw5rt17sw5tw}eu{4qu5ou5qw5rt17ss5ts}ev{17ss5ts5qs4qu}6z{17sw5tw5ou5qw5rs}fm{17sw5tw5ou5qw5rs}7n{201ts}fo{17sw5tw5ou5qw5rs}fp{17sw5tw5ou5qw5rs}fq{17sw5tw5ou5qw5rs}7r{cksclscmscnscoscps4ls}fs{17sw5tw5ou5qw5rs}ft{17su5tu}fu{17su5tu}fv{17su5tu}fw{17su5tu}fz{cksclscmscnscoscps4ls}}}"),"Helvetica-Bold":z("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}"),Courier:z("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),"Courier-BoldOblique":z("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),"Times-Bold":z("{'widths'{k3q2q5ncx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2l202m2n2n3m2o3m2p6o202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5x4l4s4m4m4n4s4o4s4p4m4q3x4r4y4s4y4t2r4u3m4v4y4w4m4x5y4y4s4z4y5k3x5l4y5m4s5n3r5o4m5p4s5q4s5r6o5s4s5t4s5u4m5v2l5w1w5x2l5y3u5z3m6k2l6l3m6m3r6n2w6o3r6p2w6q2l6r3m6s3r6t1w6u2l6v3r6w1w6x5n6y3r6z3m7k3r7l3r7m2w7n2r7o2l7p3r7q3m7r4s7s3m7t3m7u2w7v2r7w1q7x2r7y3o202l3mcl4sal2lam3man3mao3map3mar3mas2lat4uau1yav3maw3tay4uaz2lbk2sbl3t'fof'6obo2lbp3rbr1tbs2lbu2lbv3mbz3mck4s202k3mcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3rek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3m3u2l17s4s19m3m}'kerning'{cl{4qt5ks5ot5qy5rw17sv5tv}201t{cks4lscmscnscoscpscls4wv}2k{201ts}2w{4qu5ku7mu5os5qx5ru17su5tu}2x{17su5tu5ou5qs}2y{4qv5kv7mu5ot5qz5ru17su5tu}'fof'-6o7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qu}3v{17su5tu5os5qu}fu{17su5tu5ou5qu}7p{17su5tu5ou5qu}ck{4qt5ks5ot5qy5rw17sv5tv}4l{4qt5ks5ot5qy5rw17sv5tv}cm{4qt5ks5ot5qy5rw17sv5tv}cn{4qt5ks5ot5qy5rw17sv5tv}co{4qt5ks5ot5qy5rw17sv5tv}cp{4qt5ks5ot5qy5rw17sv5tv}6l{17st5tt5ou5qu}17s{ckuclucmucnucoucpu4lu4wu}5o{ckuclucmucnucoucpu4lu4wu}5q{ckzclzcmzcnzcozcpz4lz4wu}5r{ckxclxcmxcnxcoxcpx4lx4wu}5t{ckuclucmucnucoucpu4lu4wu}7q{ckuclucmucnucoucpu4lu}6p{17sw5tw5ou5qu}ek{17st5tt5qu}el{17st5tt5ou5qu}em{17st5tt5qu}en{17st5tt5qu}eo{17st5tt5qu}ep{17st5tt5ou5qu}es{17ss5ts5qu}et{17sw5tw5ou5qu}eu{17sw5tw5ou5qu}ev{17ss5ts5qu}6z{17sw5tw5ou5qu5rs}fm{17sw5tw5ou5qu5rs}fn{17sw5tw5ou5qu5rs}fo{17sw5tw5ou5qu5rs}fp{17sw5tw5ou5qu5rs}fq{17sw5tw5ou5qu5rs}7r{cktcltcmtcntcotcpt4lt5os}fs{17sw5tw5ou5qu5rs}ft{17su5tu5ou5qu}7m{5os}fv{17su5tu5ou5qu}fw{17su5tu5ou5qu}fz{cksclscmscnscoscps4ls}}}"),Symbol:z("{'widths'{k3uaw4r19m3m2k1t2l2l202m2y2n3m2p5n202q6o3k3m2s2l2t2l2v3r2w1t3m3m2y1t2z1wbk2sbl3r'fof'6o3n3m3o3m3p3m3q3m3r3m3s3m3t3m3u1w3v1w3w3r3x3r3y3r3z2wbp3t3l3m5v2l5x2l5z3m2q4yfr3r7v3k7w1o7x3k}'kerning'{'fof'-6o}}"),Helvetica:z("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}"),"Helvetica-BoldOblique":z("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}"),ZapfDingbats:z("{'widths'{k4u2k1w'fof'6o}'kerning'{'fof'-6o}}"),"Courier-Bold":z("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),"Times-Italic":z("{'widths'{k3n2q4ycx2l201n3m201o5t201s2l201t2l201u2l201w3r201x3r201y3r2k1t2l2l202m2n2n3m2o3m2p5n202q5t2r1p2s2l2t2l2u3m2v4n2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w4n3x4n3y4n3z3m4k5w4l3x4m3x4n4m4o4s4p3x4q3x4r4s4s4s4t2l4u2w4v4m4w3r4x5n4y4m4z4s5k3x5l4s5m3x5n3m5o3r5p4s5q3x5r5n5s3x5t3r5u3r5v2r5w1w5x2r5y2u5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q1w6r3m6s3m6t1w6u1w6v2w6w1w6x4s6y3m6z3m7k3m7l3m7m2r7n2r7o1w7p3m7q2w7r4m7s2w7t2w7u2r7v2s7w1v7x2s7y3q202l3mcl3xal2ram3man3mao3map3mar3mas2lat4wau1vav3maw4nay4waz2lbk2sbl4n'fof'6obo2lbp3mbq3obr1tbs2lbu1zbv3mbz3mck3x202k3mcm3xcn3xco3xcp3xcq5tcr4mcs3xct3xcu3xcv3xcw2l2m2ucy2lcz2ldl4mdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr4nfs3mft3mfu3mfv3mfw3mfz2w203k6o212m6m2dw2l2cq2l3t3m3u2l17s3r19m3m}'kerning'{cl{5kt4qw}201s{201sw}201t{201tw2wy2yy6q-t}201x{2wy2yy}2k{201tw}2w{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}2x{17ss5ts5os}2y{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}'fof'-6o6t{17ss5ts5qs}7t{5os}3v{5qs}7p{17su5tu5qs}ck{5kt4qw}4l{5kt4qw}cm{5kt4qw}cn{5kt4qw}co{5kt4qw}cp{5kt4qw}6l{4qs5ks5ou5qw5ru17su5tu}17s{2ks}5q{ckvclvcmvcnvcovcpv4lv}5r{ckuclucmucnucoucpu4lu}5t{2ks}6p{4qs5ks5ou5qw5ru17su5tu}ek{4qs5ks5ou5qw5ru17su5tu}el{4qs5ks5ou5qw5ru17su5tu}em{4qs5ks5ou5qw5ru17su5tu}en{4qs5ks5ou5qw5ru17su5tu}eo{4qs5ks5ou5qw5ru17su5tu}ep{4qs5ks5ou5qw5ru17su5tu}es{5ks5qs4qs}et{4qs5ks5ou5qw5ru17su5tu}eu{4qs5ks5qw5ru17su5tu}ev{5ks5qs4qs}ex{17ss5ts5qs}6z{4qv5ks5ou5qw5ru17su5tu}fm{4qv5ks5ou5qw5ru17su5tu}fn{4qv5ks5ou5qw5ru17su5tu}fo{4qv5ks5ou5qw5ru17su5tu}fp{4qv5ks5ou5qw5ru17su5tu}fq{4qv5ks5ou5qw5ru17su5tu}7r{5os}fs{4qv5ks5ou5qw5ru17su5tu}ft{17su5tu5qs}fu{17su5tu5qs}fv{17su5tu5qs}fw{17su5tu5qs}}}"),"Times-Roman":z("{'widths'{k3n2q4ycx2l201n3m201o6o201s2l201t2l201u2l201w2w201x2w201y2w2k1t2l2l202m2n2n3m2o3m2p5n202q6o2r1m2s2l2t2l2u3m2v3s2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v1w3w3s3x3s3y3s3z2w4k5w4l4s4m4m4n4m4o4s4p3x4q3r4r4s4s4s4t2l4u2r4v4s4w3x4x5t4y4s4z4s5k3r5l4s5m4m5n3r5o3x5p4s5q4s5r5y5s4s5t4s5u3x5v2l5w1w5x2l5y2z5z3m6k2l6l2w6m3m6n2w6o3m6p2w6q2l6r3m6s3m6t1w6u1w6v3m6w1w6x4y6y3m6z3m7k3m7l3m7m2l7n2r7o1w7p3m7q3m7r4s7s3m7t3m7u2w7v3k7w1o7x3k7y3q202l3mcl4sal2lam3man3mao3map3mar3mas2lat4wau1vav3maw3say4waz2lbk2sbl3s'fof'6obo2lbp3mbq2xbr1tbs2lbu1zbv3mbz2wck4s202k3mcm4scn4sco4scp4scq5tcr4mcs3xct3xcu3xcv3xcw2l2m2tcy2lcz2ldl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek2wel2wem2wen2weo2wep2weq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr3sfs3mft3mfu3mfv3mfw3mfz3m203k6o212m6m2dw2l2cq2l3t3m3u1w17s4s19m3m}'kerning'{cl{4qs5ku17sw5ou5qy5rw201ss5tw201ws}201s{201ss}201t{ckw4lwcmwcnwcowcpwclw4wu201ts}2k{201ts}2w{4qs5kw5os5qx5ru17sx5tx}2x{17sw5tw5ou5qu}2y{4qs5kw5os5qx5ru17sx5tx}'fof'-6o7t{ckuclucmucnucoucpu4lu5os5rs}3u{17su5tu5qs}3v{17su5tu5qs}7p{17sw5tw5qs}ck{4qs5ku17sw5ou5qy5rw201ss5tw201ws}4l{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cm{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cn{4qs5ku17sw5ou5qy5rw201ss5tw201ws}co{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cp{4qs5ku17sw5ou5qy5rw201ss5tw201ws}6l{17su5tu5os5qw5rs}17s{2ktclvcmvcnvcovcpv4lv4wuckv}5o{ckwclwcmwcnwcowcpw4lw4wu}5q{ckyclycmycnycoycpy4ly4wu5ms}5r{cktcltcmtcntcotcpt4lt4ws}5t{2ktclvcmvcnvcovcpv4lv4wuckv}7q{cksclscmscnscoscps4ls}6p{17su5tu5qw5rs}ek{5qs5rs}el{17su5tu5os5qw5rs}em{17su5tu5os5qs5rs}en{17su5qs5rs}eo{5qs5rs}ep{17su5tu5os5qw5rs}es{5qs}et{17su5tu5qw5rs}eu{17su5tu5qs5rs}ev{5qs}6z{17sv5tv5os5qx5rs}fm{5os5qt5rs}fn{17sv5tv5os5qx5rs}fo{17sv5tv5os5qx5rs}fp{5os5qt5rs}fq{5os5qt5rs}7r{ckuclucmucnucoucpu4lu5os}fs{17sv5tv5os5qx5rs}ft{17ss5ts5qs}fu{17sw5tw5qs}fv{17sw5tw5qs}fw{17ss5ts5qs}fz{ckuclucmucnucoucpu4lu5os5rs}}}"),"Helvetica-Oblique":z("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}")}}, M.events.push(["addFont",function(t){var e,n,r,i="Unicode";(e=U[i][t.postScriptName])&&((n=t.metadata[i]?t.metadata[i]:t.metadata[i]={}).widths=e.widths, n.kerning=e.kerning), (r=L[i][t.postScriptName])&&((n=t.metadata[i]?t.metadata[i]:t.metadata[i]={}).encoding=r).codePages&&r.codePages.length&&(t.encoding=r.codePages[0]);}]), H=K, "undefined"!=typeof self&&self||"undefined"!=typeof commonjsGlobal&&commonjsGlobal||"undefined"!=typeof window&&window||Function("return this")(), H.API.events.push(["addFont",function(t){H.API.existsFileInVFS(t.postScriptName)?(t.metadata=H.API.TTFFont.open(t.postScriptName,t.fontName,H.API.getFileFromVFS(t.postScriptName),t.encoding), t.metadata.Unicode=t.metadata.Unicode||{encoding:{},kerning:{},widths:[]}):14<t.id.slice(1)&&console.error("Font does not exist in FileInVFS, import fonts or remove declaration doc.addFont('"+t.postScriptName+"').");}]), K.API.addSVG=function(t,e,n,r,i){if(void 0===e||void 0===n)throw new Error("addSVG needs values for 'x' and 'y'");function o(t){for(var e=parseFloat(t[1]),n=parseFloat(t[2]),r=[],i=3,o=t.length;i<o;)"c"===t[i]?(r.push([parseFloat(t[i+1]),parseFloat(t[i+2]),parseFloat(t[i+3]),parseFloat(t[i+4]),parseFloat(t[i+5]),parseFloat(t[i+6])]), i+=7):"l"===t[i]?(r.push([parseFloat(t[i+1]),parseFloat(t[i+2])]), i+=3):i+=1;return[e,n,r]}var a,s,c,l,h,u,f,d,p=(l=document, d=l.createElement("iframe"), h=".jsPDF_sillysvg_iframe {display:none;position:absolute;}", (f=(u=l).createElement("style")).type="text/css", f.styleSheet?f.styleSheet.cssText=h:f.appendChild(u.createTextNode(h)), u.getElementsByTagName("head")[0].appendChild(f), d.name="childframe", d.setAttribute("width",0), d.setAttribute("height",0), d.setAttribute("frameborder","0"), d.setAttribute("scrolling","no"), d.setAttribute("seamless","seamless"), d.setAttribute("class","jsPDF_sillysvg_iframe"), l.body.appendChild(d), d),g=(a=t, (c=((s=p).contentWindow||s.contentDocument).document).write(a), c.close(), c.getElementsByTagName("svg")[0]),m=[1,1],y=parseFloat(g.getAttribute("width")),w=parseFloat(g.getAttribute("height"));y&&w&&(r&&i?m=[r/y,i/w]:r?m=[r/y,r/y]:i&&(m=[i/w,i/w]));var v,b,x,S,k=g.childNodes;for(v=0, b=k.length;v<b;v++)(x=k[v]).tagName&&"PATH"===x.tagName.toUpperCase()&&((S=o(x.getAttribute("d").split(" ")))[0]=S[0]*m[0]+e, S[1]=S[1]*m[1]+n, this.lines.call(this,S[2],S[0],S[1],m));return this}, K.API.putTotalPages=function(t){for(var e=new RegExp(t,"g"),n=1;n<=this.internal.getNumberOfPages();n++)for(var r=0;r<this.internal.pages[n].length;r++)this.internal.pages[n][r]=this.internal.pages[n][r].replace(e,this.internal.getNumberOfPages());return this}, K.API.viewerPreferences=function(t,e){var n;t=t||{}, e=e||!1;var r,i,o={HideToolbar:{defaultValue:!1,value:!1,type:"boolean",explicitSet:!1,valueSet:[!0,!1],pdfVersion:1.3},HideMenubar:{defaultValue:!1,value:!1,type:"boolean",explicitSet:!1,valueSet:[!0,!1],pdfVersion:1.3},HideWindowUI:{defaultValue:!1,value:!1,type:"boolean",explicitSet:!1,valueSet:[!0,!1],pdfVersion:1.3},FitWindow:{defaultValue:!1,value:!1,type:"boolean",explicitSet:!1,valueSet:[!0,!1],pdfVersion:1.3},CenterWindow:{defaultValue:!1,value:!1,type:"boolean",explicitSet:!1,valueSet:[!0,!1],pdfVersion:1.3},DisplayDocTitle:{defaultValue:!1,value:!1,type:"boolean",explicitSet:!1,valueSet:[!0,!1],pdfVersion:1.4},NonFullScreenPageMode:{defaultValue:"UseNone",value:"UseNone",type:"name",explicitSet:!1,valueSet:["UseNone","UseOutlines","UseThumbs","UseOC"],pdfVersion:1.3},Direction:{defaultValue:"L2R",value:"L2R",type:"name",explicitSet:!1,valueSet:["L2R","R2L"],pdfVersion:1.3},ViewArea:{defaultValue:"CropBox",value:"CropBox",type:"name",explicitSet:!1,valueSet:["MediaBox","CropBox","TrimBox","BleedBox","ArtBox"],pdfVersion:1.4},ViewClip:{defaultValue:"CropBox",value:"CropBox",type:"name",explicitSet:!1,valueSet:["MediaBox","CropBox","TrimBox","BleedBox","ArtBox"],pdfVersion:1.4},PrintArea:{defaultValue:"CropBox",value:"CropBox",type:"name",explicitSet:!1,valueSet:["MediaBox","CropBox","TrimBox","BleedBox","ArtBox"],pdfVersion:1.4},PrintClip:{defaultValue:"CropBox",value:"CropBox",type:"name",explicitSet:!1,valueSet:["MediaBox","CropBox","TrimBox","BleedBox","ArtBox"],pdfVersion:1.4},PrintScaling:{defaultValue:"AppDefault",value:"AppDefault",type:"name",explicitSet:!1,valueSet:["AppDefault","None"],pdfVersion:1.6},Duplex:{defaultValue:"",value:"none",type:"name",explicitSet:!1,valueSet:["Simplex","DuplexFlipShortEdge","DuplexFlipLongEdge","none"],pdfVersion:1.7},PickTrayByPDFSize:{defaultValue:!1,value:!1,type:"boolean",explicitSet:!1,valueSet:[!0,!1],pdfVersion:1.7},PrintPageRange:{defaultValue:"",value:"",type:"array",explicitSet:!1,valueSet:null,pdfVersion:1.7},NumCopies:{defaultValue:1,value:1,type:"integer",explicitSet:!1,valueSet:null,pdfVersion:1.7}},a=Object.keys(o),s=[],c=0,l=0,h=0,u=!0;function f(t,e){var n,r=!1;for(n=0;n<t.length;n+=1)t[n]===e&&(r=!0);return r}if(void 0===this.internal.viewerpreferences&&(this.internal.viewerpreferences={}, this.internal.viewerpreferences.configuration=JSON.parse(JSON.stringify(o)), this.internal.viewerpreferences.isSubscribed=!1), n=this.internal.viewerpreferences.configuration, "reset"===t||!0===e){var d=a.length;for(h=0;h<d;h+=1)n[a[h]].value=n[a[h]].defaultValue, n[a[h]].explicitSet=!1;}if("object"===(void 0===t?"undefined":vt(t)))for(r in t)if(i=t[r], f(a,r)&&void 0!==i){if("boolean"===n[r].type&&"boolean"==typeof i)n[r].value=i;else if("name"===n[r].type&&f(n[r].valueSet,i))n[r].value=i;else if("integer"===n[r].type&&Number.isInteger(i))n[r].value=i;else if("array"===n[r].type){for(c=0;c<i.length;c+=1)if(u=!0, 1===i[c].length&&"number"==typeof i[c][0])s.push(String(i[c]));else if(1<i[c].length){for(l=0;l<i[c].length;l+=1)"number"!=typeof i[c][l]&&(u=!1);!0===u&&s.push(String(i[c].join("-")));}n[r].value=String(s);}else n[r].value=n[r].defaultValue;n[r].explicitSet=!0;}return!1===this.internal.viewerpreferences.isSubscribed&&(this.internal.events.subscribe("putCatalog",function(){var t,e=[];for(t in n)!0===n[t].explicitSet&&("name"===n[t].type?e.push("/"+t+" /"+n[t].value):e.push("/"+t+" "+n[t].value));0!==e.length&&this.internal.write("/ViewerPreferences\n<<\n"+e.join("\n")+"\n>>");}), this.internal.viewerpreferences.isSubscribed=!0), this.internal.viewerpreferences.configuration=n, this}, W=K.API, Y=G=V="", W.addMetadata=function(t,e){return G=e||"http://jspdf.default.namespaceuri/", V=t, this.internal.events.subscribe("postPutResources",function(){if(V){var t='<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description rdf:about="" xmlns:jspdf="'+G+'"><jspdf:metadata>',e=unescape(encodeURIComponent('<x:xmpmeta xmlns:x="adobe:ns:meta/">')),n=unescape(encodeURIComponent(t)),r=unescape(encodeURIComponent(V)),i=unescape(encodeURIComponent("</jspdf:metadata></rdf:Description></rdf:RDF>")),o=unescape(encodeURIComponent("</x:xmpmeta>")),a=n.length+r.length+i.length+e.length+o.length;Y=this.internal.newObject(), this.internal.write("<< /Type /Metadata /Subtype /XML /Length "+a+" >>"), this.internal.write("stream"), this.internal.write(e+n+r+i+o), this.internal.write("endstream"), this.internal.write("endobj");}else Y="";}), this.internal.events.subscribe("putCatalog",function(){Y&&this.internal.write("/Metadata "+Y+" 0 R");}), this}, function(h,t){var e=h.API,m=[0];e.events.push(["putFont",function(t){!function(t,e,n){if(t.metadata instanceof h.API.TTFFont&&"Identity-H"===t.encoding){for(var r=t.metadata.Unicode.widths,i=t.metadata.subset.encode(m),o="",a=0;a<i.length;a++)o+=String.fromCharCode(i[a]);var s=n();e("<<"), e("/Length "+o.length), e("/Length1 "+o.length), e(">>"), e("stream"), e(o), e("endstream"), e("endobj");var c=n();e("<<"), e("/Type /FontDescriptor"), e("/FontName /"+t.fontName), e("/FontFile2 "+s+" 0 R"), e("/FontBBox "+h.API.PDFObject.convert(t.metadata.bbox)), e("/Flags "+t.metadata.flags), e("/StemV "+t.metadata.stemV), e("/ItalicAngle "+t.metadata.italicAngle), e("/Ascent "+t.metadata.ascender), e("/Descent "+t.metadata.decender), e("/CapHeight "+t.metadata.capHeight), e(">>"), e("endobj");var l=n();e("<<"), e("/Type /Font"), e("/BaseFont /"+t.fontName), e("/FontDescriptor "+c+" 0 R"), e("/W "+h.API.PDFObject.convert(r)), e("/CIDToGIDMap /Identity"), e("/DW 1000"), e("/Subtype /CIDFontType2"), e("/CIDSystemInfo"), e("<<"), e("/Supplement 0"), e("/Registry (Adobe)"), e("/Ordering ("+t.encoding+")"), e(">>"), e(">>"), e("endobj"), t.objectNumber=n(), e("<<"), e("/Type /Font"), e("/Subtype /Type0"), e("/BaseFont /"+t.fontName), e("/Encoding /"+t.encoding), e("/DescendantFonts ["+l+" 0 R]"), e(">>"), e("endobj"), t.isAlreadyPutted=!0;}}(t.font,t.out,t.newObject);}]);e.events.push(["putFont",function(t){!function(t,e,n){if(t.metadata instanceof h.API.TTFFont&&"WinAnsiEncoding"===t.encoding){t.metadata.Unicode.widths;for(var r=t.metadata.rawData,i="",o=0;o<r.length;o++)i+=String.fromCharCode(r[o]);var a=n();e("<<"), e("/Length "+i.length), e("/Length1 "+i.length), e(">>"), e("stream"), e(i), e("endstream"), e("endobj");var s=n();for(e("<<"), e("/Descent "+t.metadata.decender), e("/CapHeight "+t.metadata.capHeight), e("/StemV "+t.metadata.stemV), e("/Type /FontDescriptor"), e("/FontFile2 "+a+" 0 R"), e("/Flags 96"), e("/FontBBox "+h.API.PDFObject.convert(t.metadata.bbox)), e("/FontName /"+t.fontName), e("/ItalicAngle "+t.metadata.italicAngle), e("/Ascent "+t.metadata.ascender), e(">>"), e("endobj"), t.objectNumber=n(), o=0;o<t.metadata.hmtx.widths.length;o++)t.metadata.hmtx.widths[o]=parseInt(t.metadata.hmtx.widths[o]*(1e3/t.metadata.head.unitsPerEm));e("<</Subtype/TrueType/Type/Font/BaseFont/"+t.fontName+"/FontDescriptor "+s+" 0 R/Encoding/"+t.encoding+" /FirstChar 29 /LastChar 255 /Widths "+h.API.PDFObject.convert(t.metadata.hmtx.widths)+">>"), e("endobj"), t.isAlreadyPutted=!0;}}(t.font,t.out,t.newObject);}]);var l=function(t){var e,n,r=t.text,i=t.x,o=t.y,a=t.options||{},s=t.mutex||{},c=s.pdfEscape,l=s.activeFontKey,h=s.fonts,u=(s.activeFontSize, ""),f=0,d="",p=h[n=l].encoding;if("Identity-H"!==h[n].encoding)return{text:r,x:i,y:o,options:a,mutex:s};for(d=r, n=l, "[object Array]"===Object.prototype.toString.call(r)&&(d=r[0]), f=0;f<d.length;f+=1)h[n].metadata.hasOwnProperty("cmap")&&(e=h[n].metadata.cmap.unicode.codeMap[d[f].charCodeAt(0)]), e?u+=d[f]:d[f].charCodeAt(0)<256&&h[n].metadata.hasOwnProperty("Unicode")?u+=d[f]:u+="";var g="";return parseInt(n.slice(1))<14||"WinAnsiEncoding"===p?g=function(t){for(var e="",n=0;n<t.length;n++)e+=""+t.charCodeAt(n).toString(16);return e}(c(u,n)):"Identity-H"===p&&(g=function(t,e){for(var n,r=e.metadata.Unicode.widths,i=["","0","00","000","0000"],o=[""],a=0,s=t.length;a<s;++a){if(n=e.metadata.characterToGlyph(t.charCodeAt(a)), m.push(n), -1==r.indexOf(n)&&(r.push(n), r.push([parseInt(e.metadata.widthOfGlyph(n),10)])), "0"==n)return o.join("");n=n.toString(16), o.push(i[4-n.length],n);}return o.join("")}(u,h[n])), s.isHex=!0, {text:g,x:i,y:o,options:a,mutex:s}};e.events.push(["postProcessText",function(t){var e=t.text,n=t.x,r=t.y,i=t.options,o=t.mutex,a=(i.lang, []),s={text:e,x:n,y:r,options:i,mutex:o};if("[object Array]"===Object.prototype.toString.call(e)){var c=0;for(c=0;c<e.length;c+=1)"[object Array]"===Object.prototype.toString.call(e[c])&&3===e[c].length?a.push([l(Object.assign({},s,{text:e[c][0]})).text,e[c][1],e[c][2]]):a.push(l(Object.assign({},s,{text:e[c]})).text);t.text=a;}else t.text=l(Object.assign({},s,{text:e})).text;}]);}(K,"undefined"!=typeof self&&self||"undefined"!=typeof commonjsGlobal&&commonjsGlobal||"undefined"!=typeof window&&window||Function("return this")()), X=K.API, J={}, X.existsFileInVFS=function(t){return J.hasOwnProperty(t)}, X.addFileToVFS=function(t,e){return J[t]=e, this}, X.getFileFromVFS=function(t){return J.hasOwnProperty(t)?J[t]:null}, function(t){if(t.URL=t.URL||t.webkitURL, t.Blob&&t.URL)try{return new Blob}catch(t){}var s=t.BlobBuilder||t.WebKitBlobBuilder||t.MozBlobBuilder||function(t){var s=function(t){return Object.prototype.toString.call(t).match(/^\[object\s(.*)\]$/)[1]},e=function(){this.data=[];},c=function(t,e,n){this.data=t, this.size=t.length, this.type=e, this.encoding=n;},n=e.prototype,r=c.prototype,l=t.FileReaderSync,h=function(t){this.code=this[this.name=t];},i="NOT_FOUND_ERR SECURITY_ERR ABORT_ERR NOT_READABLE_ERR ENCODING_ERR NO_MODIFICATION_ALLOWED_ERR INVALID_STATE_ERR SYNTAX_ERR".split(" "),o=i.length,a=t.URL||t.webkitURL||t,u=a.createObjectURL,f=a.revokeObjectURL,d=a,p=t.btoa,g=t.atob,m=t.ArrayBuffer,y=t.Uint8Array,w=/^[\w-]+:\/*\[?[\w\.:-]+\]?(?::[0-9]+)?/;for(c.fake=r.fake=!0;o--;)h.prototype[i[o]]=o+1;return a.createObjectURL||(d=t.URL=function(t){var e,n=document.createElementNS("http://www.w3.org/1999/xhtml","a");return n.href=t, "origin"in n||("data:"===n.protocol.toLowerCase()?n.origin=null:(e=t.match(w), n.origin=e&&e[1])), n}), d.createObjectURL=function(t){var e,n=t.type;return null===n&&(n="application/octet-stream"), t instanceof c?(e="data:"+n, "base64"===t.encoding?e+";base64,"+t.data:"URI"===t.encoding?e+","+decodeURIComponent(t.data):p?e+";base64,"+p(t.data):e+","+encodeURIComponent(t.data)):u?u.call(a,t):void 0}, d.revokeObjectURL=function(t){"data:"!==t.substring(0,5)&&f&&f.call(a,t);}, n.append=function(t){var e=this.data;if(y&&(t instanceof m||t instanceof y)){for(var n="",r=new y(t),i=0,o=r.length;i<o;i++)n+=String.fromCharCode(r[i]);e.push(n);}else if("Blob"===s(t)||"File"===s(t)){if(!l)throw new h("NOT_READABLE_ERR");var a=new l;e.push(a.readAsBinaryString(t));}else t instanceof c?"base64"===t.encoding&&g?e.push(g(t.data)):"URI"===t.encoding?e.push(decodeURIComponent(t.data)):"raw"===t.encoding&&e.push(t.data):("string"!=typeof t&&(t+=""), e.push(unescape(encodeURIComponent(t))));}, n.getBlob=function(t){return arguments.length||(t=null), new c(this.data.join(""),t,"raw")}, n.toString=function(){return"[object BlobBuilder]"}, r.slice=function(t,e,n){var r=arguments.length;return r<3&&(n=null), new c(this.data.slice(t,1<r?e:this.data.length),n,this.encoding)}, r.toString=function(){return"[object Blob]"}, r.close=function(){this.size=0, delete this.data;}, e}(t);t.Blob=function(t,e){var n=e&&e.type||"",r=new s;if(t)for(var i=0,o=t.length;i<o;i++)Uint8Array&&t[i]instanceof Uint8Array?r.append(t[i].buffer):r.append(t[i]);var a=r.getBlob(n);return!a.slice&&a.webkitSlice&&(a.slice=a.webkitSlice), a};var e=Object.getPrototypeOf||function(t){return t.__proto__};t.Blob.prototype=e(new t.Blob);}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||window.content||window);var Q,Z,$,tt,et,nt,rt,it,ot,at,st,ct,lt,ht,bt=bt||function(s){if(!(void 0===s||"undefined"!=typeof navigator&&/MSIE [1-9]\./.test(navigator.userAgent))){var t=s.document,c=function(){return s.URL||s.webkitURL||s},l=t.createElementNS("http://www.w3.org/1999/xhtml","a"),h="download"in l,u=/constructor/i.test(s.HTMLElement)||s.safari,f=/CriOS\/[\d]+/.test(navigator.userAgent),d=function(t){(s.setImmediate||s.setTimeout)(function(){throw t},0);},p=function(t){setTimeout(function(){"string"==typeof t?c().revokeObjectURL(t):t.remove();},4e4);},g=function(t){return/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(t.type)?new Blob([String.fromCharCode(65279),t],{type:t.type}):t},r=function(t,n,e){e||(t=g(t));var r,i=this,o="application/octet-stream"===t.type,a=function(){!function(t,e,n){for(var r=(e=[].concat(e)).length;r--;){var i=t["on"+e[r]];if("function"==typeof i)try{i.call(t,n||t);}catch(t){d(t);}}}(i,"writestart progress write writeend".split(" "));};if(i.readyState=i.INIT, h)return r=c().createObjectURL(t), void setTimeout(function(){var t,e;l.href=r, l.download=n, t=l, e=new MouseEvent("click"), t.dispatchEvent(e), a(), p(r), i.readyState=i.DONE;});!function(){if((f||o&&u)&&s.FileReader){var e=new FileReader;return e.onloadend=function(){var t=f?e.result:e.result.replace(/^data:[^;]*;/,"data:attachment/file;");s.open(t,"_blank")||(s.location.href=t), t=void 0, i.readyState=i.DONE, a();}, e.readAsDataURL(t), i.readyState=i.INIT}r||(r=c().createObjectURL(t)), o?s.location.href=r:s.open(r,"_blank")||(s.location.href=r);i.readyState=i.DONE, a(), p(r);}();},e=r.prototype;return"undefined"!=typeof navigator&&navigator.msSaveOrOpenBlob?function(t,e,n){return e=e||t.name||"download", n||(t=g(t)), navigator.msSaveOrOpenBlob(t,e)}:(e.abort=function(){}, e.readyState=e.INIT=0, e.WRITING=1, e.DONE=2, e.error=e.onwritestart=e.onprogress=e.onwrite=e.onabort=e.onerror=e.onwriteend=null, function(t,e,n){return new r(t,e||t.name||"download",n)})}}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||window.content);"undefined"!='object'&&module.exports?module.exports.saveAs=bt:"undefined"!=typeof undefined&&null!==undefined&&null!==undefined.amd&&undefined("FileSaver.js",function(){return bt}), K.API.adler32cs=(nt="function"==typeof ArrayBuffer&&"function"==typeof Uint8Array, rt=null, it=function(){if(!nt)return function(){return!1};try{var t={};"function"==typeof t.Buffer&&(rt=t.Buffer);}catch(t){}return function(t){return t instanceof ArrayBuffer||null!==rt&&t instanceof rt}}(), ot=null!==rt?function(t){return new rt(t,"utf8").toString("binary")}:function(t){return unescape(encodeURIComponent(t))}, at=65521, st=function(t,e){for(var n=65535&t,r=t>>>16,i=0,o=e.length;i<o;i++)n=(n+(255&e.charCodeAt(i)))%at, r=(r+n)%at;return(r<<16|n)>>>0}, ct=function(t,e){for(var n=65535&t,r=t>>>16,i=0,o=e.length;i<o;i++)n=(n+e[i])%at, r=(r+n)%at;return(r<<16|n)>>>0}, ht=(lt={}).Adler32=(((et=(tt=function(t){if(!(this instanceof tt))throw new TypeError("Constructor cannot called be as a function.");if(!isFinite(t=null==t?1:+t))throw new Error("First arguments needs to be a finite number.");this.checksum=t>>>0;}).prototype={}).constructor=tt).from=((Q=function(t){if(!(this instanceof tt))throw new TypeError("Constructor cannot called be as a function.");if(null==t)throw new Error("First argument needs to be a string.");this.checksum=st(1,t.toString());}).prototype=et, Q), tt.fromUtf8=((Z=function(t){if(!(this instanceof tt))throw new TypeError("Constructor cannot called be as a function.");if(null==t)throw new Error("First argument needs to be a string.");var e=ot(t.toString());this.checksum=st(1,e);}).prototype=et, Z), nt&&(tt.fromBuffer=(($=function(t){if(!(this instanceof tt))throw new TypeError("Constructor cannot called be as a function.");if(!it(t))throw new Error("First argument needs to be ArrayBuffer.");var e=new Uint8Array(t);return this.checksum=ct(1,e)}).prototype=et, $)), et.update=function(t){if(null==t)throw new Error("First argument needs to be a string.");return t=t.toString(), this.checksum=st(this.checksum,t)}, et.updateUtf8=function(t){if(null==t)throw new Error("First argument needs to be a string.");var e=ot(t.toString());return this.checksum=st(this.checksum,e)}, nt&&(et.updateBuffer=function(t){if(!it(t))throw new Error("First argument needs to be ArrayBuffer.");var e=new Uint8Array(t);return this.checksum=ct(this.checksum,e)}), et.clone=function(){return new ht(this.checksum)}, tt), lt.from=function(t){if(null==t)throw new Error("First argument needs to be a string.");return st(1,t.toString())}, lt.fromUtf8=function(t){if(null==t)throw new Error("First argument needs to be a string.");var e=ot(t.toString());return st(1,e)}, nt&&(lt.fromBuffer=function(t){if(!it(t))throw new Error("First argument need to be ArrayBuffer.");var e=new Uint8Array(t);return ct(1,e)}), lt), function(t){var p=15,g=573,e=[0,1,2,3,4,4,5,5,6,6,6,6,7,7,7,7,8,8,8,8,8,8,8,8,9,9,9,9,9,9,9,9,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,11,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,13,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,0,0,16,17,18,18,19,19,20,20,20,20,21,21,21,21,22,22,22,22,22,22,22,22,23,23,23,23,23,23,23,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29,29];function ut(){var d=this;function c(t,e){for(var n=0;n|=1&t, t>>>=1, n<<=1, 0<--e;);return n>>>1}d.build_tree=function(t){var e,n,r,i=d.dyn_tree,o=d.stat_desc.static_tree,a=d.stat_desc.elems,s=-1;for(t.heap_len=0, t.heap_max=g, e=0;e<a;e++)0!==i[2*e]?(t.heap[++t.heap_len]=s=e, t.depth[e]=0):i[2*e+1]=0;for(;t.heap_len<2;)i[2*(r=t.heap[++t.heap_len]=s<2?++s:0)]=1, t.depth[r]=0, t.opt_len--, o&&(t.static_len-=o[2*r+1]);for(d.max_code=s, e=Math.floor(t.heap_len/2);1<=e;e--)t.pqdownheap(i,e);for(r=a;e=t.heap[1], t.heap[1]=t.heap[t.heap_len--], t.pqdownheap(i,1), n=t.heap[1], t.heap[--t.heap_max]=e, t.heap[--t.heap_max]=n, i[2*r]=i[2*e]+i[2*n], t.depth[r]=Math.max(t.depth[e],t.depth[n])+1, i[2*e+1]=i[2*n+1]=r, t.heap[1]=r++, t.pqdownheap(i,1), 2<=t.heap_len;);t.heap[--t.heap_max]=t.heap[1], function(t){var e,n,r,i,o,a,s=d.dyn_tree,c=d.stat_desc.static_tree,l=d.stat_desc.extra_bits,h=d.stat_desc.extra_base,u=d.stat_desc.max_length,f=0;for(i=0;i<=p;i++)t.bl_count[i]=0;for(s[2*t.heap[t.heap_max]+1]=0, e=t.heap_max+1;e<g;e++)u<(i=s[2*s[2*(n=t.heap[e])+1]+1]+1)&&(i=u, f++), s[2*n+1]=i, n>d.max_code||(t.bl_count[i]++, o=0, h<=n&&(o=l[n-h]), a=s[2*n], t.opt_len+=a*(i+o), c&&(t.static_len+=a*(c[2*n+1]+o)));if(0!==f){do{for(i=u-1;0===t.bl_count[i];)i--;t.bl_count[i]--, t.bl_count[i+1]+=2, t.bl_count[u]--, f-=2;}while(0<f);for(i=u;0!==i;i--)for(n=t.bl_count[i];0!==n;)(r=t.heap[--e])>d.max_code||(s[2*r+1]!=i&&(t.opt_len+=(i-s[2*r+1])*s[2*r], s[2*r+1]=i), n--);}}(t), function(t,e,n){var r,i,o,a=[],s=0;for(r=1;r<=p;r++)a[r]=s=s+n[r-1]<<1;for(i=0;i<=e;i++)0!==(o=t[2*i+1])&&(t[2*i]=c(a[o]++,o));}(i,d.max_code,t.bl_count);};}function ft(t,e,n,r,i){var o=this;o.static_tree=t, o.extra_bits=e, o.extra_base=n, o.elems=r, o.max_length=i;}ut._length_code=[0,1,2,3,4,5,6,7,8,8,9,9,10,10,11,11,12,12,12,12,13,13,13,13,14,14,14,14,15,15,15,15,16,16,16,16,16,16,16,16,17,17,17,17,17,17,17,17,18,18,18,18,18,18,18,18,19,19,19,19,19,19,19,19,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,23,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,28], ut.base_length=[0,1,2,3,4,5,6,7,8,10,12,14,16,20,24,28,32,40,48,56,64,80,96,112,128,160,192,224,0], ut.base_dist=[0,1,2,3,4,6,8,12,16,24,32,48,64,96,128,192,256,384,512,768,1024,1536,2048,3072,4096,6144,8192,12288,16384,24576], ut.d_code=function(t){return t<256?e[t]:e[256+(t>>>7)]}, ut.extra_lbits=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0], ut.extra_dbits=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13], ut.extra_blbits=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7], ut.bl_order=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15], ft.static_ltree=[12,8,140,8,76,8,204,8,44,8,172,8,108,8,236,8,28,8,156,8,92,8,220,8,60,8,188,8,124,8,252,8,2,8,130,8,66,8,194,8,34,8,162,8,98,8,226,8,18,8,146,8,82,8,210,8,50,8,178,8,114,8,242,8,10,8,138,8,74,8,202,8,42,8,170,8,106,8,234,8,26,8,154,8,90,8,218,8,58,8,186,8,122,8,250,8,6,8,134,8,70,8,198,8,38,8,166,8,102,8,230,8,22,8,150,8,86,8,214,8,54,8,182,8,118,8,246,8,14,8,142,8,78,8,206,8,46,8,174,8,110,8,238,8,30,8,158,8,94,8,222,8,62,8,190,8,126,8,254,8,1,8,129,8,65,8,193,8,33,8,161,8,97,8,225,8,17,8,145,8,81,8,209,8,49,8,177,8,113,8,241,8,9,8,137,8,73,8,201,8,41,8,169,8,105,8,233,8,25,8,153,8,89,8,217,8,57,8,185,8,121,8,249,8,5,8,133,8,69,8,197,8,37,8,165,8,101,8,229,8,21,8,149,8,85,8,213,8,53,8,181,8,117,8,245,8,13,8,141,8,77,8,205,8,45,8,173,8,109,8,237,8,29,8,157,8,93,8,221,8,61,8,189,8,125,8,253,8,19,9,275,9,147,9,403,9,83,9,339,9,211,9,467,9,51,9,307,9,179,9,435,9,115,9,371,9,243,9,499,9,11,9,267,9,139,9,395,9,75,9,331,9,203,9,459,9,43,9,299,9,171,9,427,9,107,9,363,9,235,9,491,9,27,9,283,9,155,9,411,9,91,9,347,9,219,9,475,9,59,9,315,9,187,9,443,9,123,9,379,9,251,9,507,9,7,9,263,9,135,9,391,9,71,9,327,9,199,9,455,9,39,9,295,9,167,9,423,9,103,9,359,9,231,9,487,9,23,9,279,9,151,9,407,9,87,9,343,9,215,9,471,9,55,9,311,9,183,9,439,9,119,9,375,9,247,9,503,9,15,9,271,9,143,9,399,9,79,9,335,9,207,9,463,9,47,9,303,9,175,9,431,9,111,9,367,9,239,9,495,9,31,9,287,9,159,9,415,9,95,9,351,9,223,9,479,9,63,9,319,9,191,9,447,9,127,9,383,9,255,9,511,9,0,7,64,7,32,7,96,7,16,7,80,7,48,7,112,7,8,7,72,7,40,7,104,7,24,7,88,7,56,7,120,7,4,7,68,7,36,7,100,7,20,7,84,7,52,7,116,7,3,8,131,8,67,8,195,8,35,8,163,8,99,8,227,8], ft.static_dtree=[0,5,16,5,8,5,24,5,4,5,20,5,12,5,28,5,2,5,18,5,10,5,26,5,6,5,22,5,14,5,30,5,1,5,17,5,9,5,25,5,5,5,21,5,13,5,29,5,3,5,19,5,11,5,27,5,7,5,23,5], ft.static_l_desc=new ft(ft.static_ltree,ut.extra_lbits,257,286,p), ft.static_d_desc=new ft(ft.static_dtree,ut.extra_dbits,0,30,p), ft.static_bl_desc=new ft(null,ut.extra_blbits,0,19,7);function n(t,e,n,r,i){var o=this;o.good_length=t, o.max_lazy=e, o.nice_length=n, o.max_chain=r, o.func=i;}var dt=[new n(0,0,0,0,0),new n(4,4,8,4,1),new n(4,5,16,8,1),new n(4,6,32,32,1),new n(4,4,16,16,2),new n(8,16,32,32,2),new n(8,16,128,128,2),new n(8,32,128,256,2),new n(32,128,258,1024,2),new n(32,258,258,4096,2)],pt=["need dictionary","stream end","","","stream error","data error","","buffer error","",""],gt=262;function mt(t,e,n,r){var i=t[2*e],o=t[2*n];return i<o||i==o&&r[e]<=r[n]}function r(){var c,l,h,u,f,d,p,g,i,m,y,w,v,a,b,x,S,k,_,C,I,A,T,F,q,E,P,O,B,j,s,R,D,M,z,N,L,o,U,H,W,V=this,G=new ut,Y=new ut,X=new ut;function J(){var t;for(t=0;t<286;t++)s[2*t]=0;for(t=0;t<30;t++)R[2*t]=0;for(t=0;t<19;t++)D[2*t]=0;s[512]=1, V.opt_len=V.static_len=0, N=o=0;}function K(t,e){var n,r,i=-1,o=t[1],a=0,s=7,c=4;for(0===o&&(s=138, c=3), t[2*(e+1)+1]=65535, n=0;n<=e;n++)r=o, o=t[2*(n+1)+1], ++a<s&&r==o||(a<c?D[2*r]+=a:0!==r?(r!=i&&D[2*r]++, D[32]++):a<=10?D[34]++:D[36]++, i=r, (a=0)===o?(s=138, c=3):r==o?(s=6, c=3):(s=7, c=4));}function Q(t){V.pending_buf[V.pending++]=t;}function Z(t){Q(255&t), Q(t>>>8&255);}function $(t,e){var n,r=e;16-r<W?(Z(H|=(n=t)<<W&65535), H=n>>>16-W, W+=r-16):(H|=t<<W&65535, W+=r);}function tt(t,e){var n=2*t;$(65535&e[n],65535&e[n+1]);}function et(t,e){var n,r,i=-1,o=t[1],a=0,s=7,c=4;for(0===o&&(s=138, c=3), n=0;n<=e;n++)if(r=o, o=t[2*(n+1)+1], !(++a<s&&r==o)){if(a<c)for(;tt(r,D), 0!=--a;);else 0!==r?(r!=i&&(tt(r,D), a--), tt(16,D), $(a-3,2)):a<=10?(tt(17,D), $(a-3,3)):(tt(18,D), $(a-11,7));i=r, (a=0)===o?(s=138, c=3):r==o?(s=6, c=3):(s=7, c=4);}}function nt(){16==W?(Z(H), W=H=0):8<=W&&(Q(255&H), H>>>=8, W-=8);}function rt(t,e){var n,r,i;if(V.pending_buf[L+2*N]=t>>>8&255, V.pending_buf[L+2*N+1]=255&t, V.pending_buf[M+N]=255&e, N++, 0===t?s[2*e]++:(o++, t--, s[2*(ut._length_code[e]+256+1)]++, R[2*ut.d_code(t)]++), 0==(8191&N)&&2<P){for(n=8*N, r=I-S, i=0;i<30;i++)n+=R[2*i]*(5+ut.extra_dbits[i]);if(n>>>=3, o<Math.floor(N/2)&&n<Math.floor(r/2))return!0}return N==z-1}function it(t,e){var n,r,i,o,a=0;if(0!==N)for(;n=V.pending_buf[L+2*a]<<8&65280|255&V.pending_buf[L+2*a+1], r=255&V.pending_buf[M+a], a++, 0===n?tt(r,t):(tt((i=ut._length_code[r])+256+1,t), 0!==(o=ut.extra_lbits[i])&&$(r-=ut.base_length[i],o), tt(i=ut.d_code(--n),e), 0!==(o=ut.extra_dbits[i])&&$(n-=ut.base_dist[i],o)), a<N;);tt(256,t), U=t[513];}function ot(){8<W?Z(H):0<W&&Q(255&H), W=H=0;}function at(t,e,n){var r,i,o;$(0+(n?1:0),3), r=t, i=e, o=!0, ot(), U=8, o&&(Z(i), Z(~i)), V.pending_buf.set(g.subarray(r,r+i),V.pending), V.pending+=i;}function e(t,e,n){var r,i,o=0;0<P?(G.build_tree(V), Y.build_tree(V), o=function(){var t;for(K(s,G.max_code), K(R,Y.max_code), X.build_tree(V), t=18;3<=t&&0===D[2*ut.bl_order[t]+1];t--);return V.opt_len+=3*(t+1)+5+5+4, t}(), r=V.opt_len+3+7>>>3, (i=V.static_len+3+7>>>3)<=r&&(r=i)):r=i=e+5, e+4<=r&&-1!=t?at(t,e,n):i==r?($(2+(n?1:0),3), it(ft.static_ltree,ft.static_dtree)):($(4+(n?1:0),3), function(t,e,n){var r;for($(t-257,5), $(e-1,5), $(n-4,4), r=0;r<n;r++)$(D[2*ut.bl_order[r]+1],3);et(s,t-1), et(R,e-1);}(G.max_code+1,Y.max_code+1,o+1), it(s,R)), J(), n&&ot();}function st(t){e(0<=S?S:-1,I-S,t), S=I, c.flush_pending();}function ct(){var t,e,n,r;do{if(0===(r=i-T-I)&&0===I&&0===T)r=f;else if(-1==r)r--;else if(f+f-gt<=I){for(g.set(g.subarray(f,f+f),0), A-=f, I-=f, S-=f, n=t=v;e=65535&y[--n], y[n]=f<=e?e-f:0, 0!=--t;);for(n=t=f;e=65535&m[--n], m[n]=f<=e?e-f:0, 0!=--t;);r+=f;}if(0===c.avail_in)return;t=c.read_buf(g,I+T,r), 3<=(T+=t)&&(w=((w=255&g[I])<<x^255&g[I+1])&b);}while(T<gt&&0!==c.avail_in)}function lt(t){var e,n,r=q,i=I,o=F,a=f-gt<I?I-(f-gt):0,s=j,c=p,l=I+258,h=g[i+o-1],u=g[i+o];B<=F&&(r>>=2), T<s&&(s=T);do{if(g[(e=t)+o]==u&&g[e+o-1]==h&&g[e]==g[i]&&g[++e]==g[i+1]){i+=2, e++;do{}while(g[++i]==g[++e]&&g[++i]==g[++e]&&g[++i]==g[++e]&&g[++i]==g[++e]&&g[++i]==g[++e]&&g[++i]==g[++e]&&g[++i]==g[++e]&&g[++i]==g[++e]&&i<l);if(n=258-(l-i), i=l-258, o<n){if(A=t, s<=(o=n))break;h=g[i+o-1], u=g[i+o];}}}while((t=65535&m[t&c])>a&&0!=--r);return o<=T?o:T}function ht(t){return t.total_in=t.total_out=0, t.msg=null, V.pending=0, V.pending_out=0, l=113, u=0, G.dyn_tree=s, G.stat_desc=ft.static_l_desc, Y.dyn_tree=R, Y.stat_desc=ft.static_d_desc, X.dyn_tree=D, X.stat_desc=ft.static_bl_desc, W=H=0, U=8, J(), function(){var t;for(i=2*f, t=y[v-1]=0;t<v-1;t++)y[t]=0;E=dt[P].max_lazy, B=dt[P].good_length, j=dt[P].nice_length, q=dt[P].max_chain, k=F=2, w=C=T=S=I=0;}(), 0}V.depth=[], V.bl_count=[], V.heap=[], s=[], R=[], D=[], V.pqdownheap=function(t,e){for(var n=V.heap,r=n[e],i=e<<1;i<=V.heap_len&&(i<V.heap_len&&mt(t,n[i+1],n[i],V.depth)&&i++, !mt(t,r,n[i],V.depth));)n[e]=n[i], e=i, i<<=1;n[e]=r;}, V.deflateInit=function(t,e,n,r,i,o){return r||(r=8), i||(i=8), o||(o=0), t.msg=null, -1==e&&(e=6), i<1||9<i||8!=r||n<9||15<n||e<0||9<e||o<0||2<o?-2:(t.dstate=V, p=(f=1<<(d=n))-1, b=(v=1<<(a=i+7))-1, x=Math.floor((a+3-1)/3), g=new Uint8Array(2*f), m=[], y=[], z=1<<i+6, V.pending_buf=new Uint8Array(4*z), h=4*z, L=Math.floor(z/2), M=3*z, P=e, O=o, ht(t))}, V.deflateEnd=function(){return 42!=l&&113!=l&&666!=l?-2:(V.pending_buf=null, g=m=y=null, V.dstate=null, 113==l?-3:0)}, V.deflateParams=function(t,e,n){var r=0;return-1==e&&(e=6), e<0||9<e||n<0||2<n?-2:(dt[P].func!=dt[e].func&&0!==t.total_in&&(r=t.deflate(1)), P!=e&&(E=dt[P=e].max_lazy, B=dt[P].good_length, j=dt[P].nice_length, q=dt[P].max_chain), O=n, r)}, V.deflateSetDictionary=function(t,e,n){var r,i=n,o=0;if(!e||42!=l)return-2;if(i<3)return 0;for(f-gt<i&&(o=n-(i=f-gt)), g.set(e.subarray(o,o+i),0), S=I=i, w=((w=255&g[0])<<x^255&g[1])&b, r=0;r<=i-3;r++)w=(w<<x^255&g[r+2])&b, m[r&p]=y[w], y[w]=r;return 0}, V.deflate=function(t,e){var n,r,i,o,a,s;if(4<e||e<0)return-2;if(!t.next_out||!t.next_in&&0!==t.avail_in||666==l&&4!=e)return t.msg=pt[4], -2;if(0===t.avail_out)return t.msg=pt[7], -5;if(c=t, o=u, u=e, 42==l&&(r=8+(d-8<<4)<<8, 3<(i=(P-1&255)>>1)&&(i=3), r|=i<<6, 0!==I&&(r|=32), l=113, Q((s=r+=31-r%31)>>8&255), Q(255&s)), 0!==V.pending){if(c.flush_pending(), 0===c.avail_out)return u=-1, 0}else if(0===c.avail_in&&e<=o&&4!=e)return c.msg=pt[7], -5;if(666==l&&0!==c.avail_in)return t.msg=pt[7], -5;if(0!==c.avail_in||0!==T||0!=e&&666!=l){switch(a=-1, dt[P].func){case 0:a=function(t){var e,n=65535;for(h-5<n&&(n=h-5);;){if(T<=1){if(ct(), 0===T&&0==t)return 0;if(0===T)break}if(I+=T, e=S+n, ((T=0)===I||e<=I)&&(T=I-e, I=e, st(!1), 0===c.avail_out))return 0;if(f-gt<=I-S&&(st(!1), 0===c.avail_out))return 0}return st(4==t), 0===c.avail_out?4==t?2:0:4==t?3:1}(e);break;case 1:a=function(t){for(var e,n=0;;){if(T<gt){if(ct(), T<gt&&0==t)return 0;if(0===T)break}if(3<=T&&(w=(w<<x^255&g[I+2])&b, n=65535&y[w], m[I&p]=y[w], y[w]=I), 0!==n&&(I-n&65535)<=f-gt&&2!=O&&(k=lt(n)), 3<=k)if(e=rt(I-A,k-3), T-=k, k<=E&&3<=T){for(k--;w=(w<<x^255&g[++I+2])&b, n=65535&y[w], m[I&p]=y[w], y[w]=I, 0!=--k;);I++;}else I+=k, k=0, w=((w=255&g[I])<<x^255&g[I+1])&b;else e=rt(0,255&g[I]), T--, I++;if(e&&(st(!1), 0===c.avail_out))return 0}return st(4==t), 0===c.avail_out?4==t?2:0:4==t?3:1}(e);break;case 2:a=function(t){for(var e,n,r=0;;){if(T<gt){if(ct(), T<gt&&0==t)return 0;if(0===T)break}if(3<=T&&(w=(w<<x^255&g[I+2])&b, r=65535&y[w], m[I&p]=y[w], y[w]=I), F=k, _=A, k=2, 0!==r&&F<E&&(I-r&65535)<=f-gt&&(2!=O&&(k=lt(r)), k<=5&&(1==O||3==k&&4096<I-A)&&(k=2)), 3<=F&&k<=F){for(n=I+T-3, e=rt(I-1-_,F-3), T-=F-1, F-=2;++I<=n&&(w=(w<<x^255&g[I+2])&b, r=65535&y[w], m[I&p]=y[w], y[w]=I), 0!=--F;);if(C=0, k=2, I++, e&&(st(!1), 0===c.avail_out))return 0}else if(0!==C){if((e=rt(0,255&g[I-1]))&&st(!1), I++, T--, 0===c.avail_out)return 0}else C=1, I++, T--;}return 0!==C&&(e=rt(0,255&g[I-1]), C=0), st(4==t), 0===c.avail_out?4==t?2:0:4==t?3:1}(e);}if(2!=a&&3!=a||(l=666), 0==a||2==a)return 0===c.avail_out&&(u=-1), 0;if(1==a){if(1==e)$(2,3), tt(256,ft.static_ltree), nt(), 1+U+10-W<9&&($(2,3), tt(256,ft.static_ltree), nt()), U=7;else if(at(0,0,!1), 3==e)for(n=0;n<v;n++)y[n]=0;if(c.flush_pending(), 0===c.avail_out)return u=-1, 0}}return 4!=e?0:1};}function i(){var t=this;t.next_in_index=0, t.next_out_index=0, t.avail_in=0, t.total_in=0, t.avail_out=0, t.total_out=0;}i.prototype={deflateInit:function(t,e){return this.dstate=new r, e||(e=p), this.dstate.deflateInit(this,t,e)},deflate:function(t){return this.dstate?this.dstate.deflate(this,t):-2},deflateEnd:function(){if(!this.dstate)return-2;var t=this.dstate.deflateEnd();return this.dstate=null, t},deflateParams:function(t,e){return this.dstate?this.dstate.deflateParams(this,t,e):-2},deflateSetDictionary:function(t,e){return this.dstate?this.dstate.deflateSetDictionary(this,t,e):-2},read_buf:function(t,e,n){var r=this,i=r.avail_in;return n<i&&(i=n), 0===i?0:(r.avail_in-=i, t.set(r.next_in.subarray(r.next_in_index,r.next_in_index+i),e), r.next_in_index+=i, r.total_in+=i, i)},flush_pending:function(){var t=this,e=t.dstate.pending;e>t.avail_out&&(e=t.avail_out), 0!==e&&(t.next_out.set(t.dstate.pending_buf.subarray(t.dstate.pending_out,t.dstate.pending_out+e),t.next_out_index), t.next_out_index+=e, t.dstate.pending_out+=e, t.total_out+=e, t.avail_out-=e, t.dstate.pending-=e, 0===t.dstate.pending&&(t.dstate.pending_out=0));}};var o=t.zip||t;o.Deflater=o._jzlib_Deflater=function(t){var s=new i,c=new Uint8Array(512),e=t?t.level:-1;void 0===e&&(e=-1), s.deflateInit(e), s.next_out=c, this.append=function(t,e){var n,r=[],i=0,o=0,a=0;if(t.length){s.next_in_index=0, s.next_in=t, s.avail_in=t.length;do{if(s.next_out_index=0, s.avail_out=512, 0!=s.deflate(0))throw new Error("deflating: "+s.msg);s.next_out_index&&(512==s.next_out_index?r.push(new Uint8Array(c)):r.push(new Uint8Array(c.subarray(0,s.next_out_index)))), a+=s.next_out_index, e&&0<s.next_in_index&&s.next_in_index!=i&&(e(s.next_in_index), i=s.next_in_index);}while(0<s.avail_in||0===s.avail_out);return n=new Uint8Array(a), r.forEach(function(t){n.set(t,o), o+=t.length;}), n}}, this.flush=function(){var t,e,n=[],r=0,i=0;do{if(s.next_out_index=0, s.avail_out=512, 1!=(t=s.deflate(4))&&0!=t)throw new Error("deflating: "+s.msg);0<512-s.avail_out&&n.push(new Uint8Array(c.subarray(0,s.next_out_index))), i+=s.next_out_index;}while(0<s.avail_in||0===s.avail_out);return s.deflateEnd(), e=new Uint8Array(i), n.forEach(function(t){e.set(t,r), r+=t.length;}), e};};}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||"undefined"!=typeof commonjsGlobal&&commonjsGlobal||Function('return typeof this === "object" && this.content')()||Function("return this")());
/**
   * CssColors
   * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
   *
   * Licensed under the MIT License.
   * http://opensource.org/licenses/mit-license
   */
var ut,ft,dt={};dt._colorsTable={aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgreen:"#006400",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",green:"#008000",greenyellow:"#adff2f",honeydew:"#f0fff0",hotpink:"#ff69b4","indianred ":"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgrey:"#d3d3d3",lightgreen:"#90ee90",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370d8",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#d87093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"}, dt.colorNameToHex=function(t){return t=t.toLowerCase(), void 0!==this._colorsTable[t]&&this._colorsTable[t]}, function(t){module.exports=t();}(function(){return function o(a,s,c){function l(n,t){if(!s[n]){if(!a[n]){var e="function"==typeof commonjsRequire&&commonjsRequire;if(!t&&e)return e(n,!0);if(h)return h(n,!0);var r=new Error("Cannot find module '"+n+"'");throw r.code="MODULE_NOT_FOUND", r}var i=s[n]={exports:{}};a[n][0].call(i.exports,function(t){var e=a[n][1][t];return l(e||t)},i,i.exports,o,a,s,c);}return s[n].exports}for(var h="function"==typeof commonjsRequire&&commonjsRequire,t=0;t<c.length;t++)l(c[t]);return l}({1:[function(t,P,O){(function(E){!function(t){var e="object"==typeof O&&O,n="object"==typeof P&&P&&P.exports==e&&P,r="object"==typeof E&&E;r.global!==r&&r.window!==r||(t=r);var i,o,y=2147483647,w=36,v=1,b=26,a=38,s=700,x=72,S=128,k="-",c=/^xn--/,l=/[^ -~]/,h=/\x2E|\u3002|\uFF0E|\uFF61/g,u={overflow:"Overflow: input needs wider integers to process","not-basic":"Illegal input >= 0x80 (not a basic code point)","invalid-input":"Invalid input"},f=w-v,_=Math.floor,C=String.fromCharCode;function I(t){throw RangeError(u[t])}function d(t,e){for(var n=t.length;n--;)t[n]=e(t[n]);return t}function p(t,e){return d(t.split(h),e).join(".")}function A(t){for(var e,n,r=[],i=0,o=t.length;i<o;)55296<=(e=t.charCodeAt(i++))&&e<=56319&&i<o?56320==(64512&(n=t.charCodeAt(i++)))?r.push(((1023&e)<<10)+(1023&n)+65536):(r.push(e), i--):r.push(e);return r}function T(t){return d(t,function(t){var e="";return 65535<t&&(e+=C((t-=65536)>>>10&1023|55296), t=56320|1023&t), e+=C(t)}).join("")}function F(t,e){return t+22+75*(t<26)-((0!=e)<<5)}function q(t,e,n){var r=0;for(t=n?_(t/s):t>>1, t+=_(t/e);f*b>>1<t;r+=w)t=_(t/f);return _(r+(f+1)*t/(t+a))}function g(t){var e,n,r,i,o,a,s,c,l,h,u,f=[],d=t.length,p=0,g=S,m=x;for((n=t.lastIndexOf(k))<0&&(n=0), r=0;r<n;++r)128<=t.charCodeAt(r)&&I("not-basic"), f.push(t.charCodeAt(r));for(i=0<n?n+1:0;i<d;){for(o=p, a=1, s=w;d<=i&&I("invalid-input"), u=t.charCodeAt(i++), (w<=(c=u-48<10?u-22:u-65<26?u-65:u-97<26?u-97:w)||c>_((y-p)/a))&&I("overflow"), p+=c*a, !(c<(l=s<=m?v:m+b<=s?b:s-m));s+=w)a>_(y/(h=w-l))&&I("overflow"), a*=h;m=q(p-o,e=f.length+1,0==o), _(p/e)>y-g&&I("overflow"), g+=_(p/e), p%=e, f.splice(p++,0,g);}return T(f)}function m(t){var e,n,r,i,o,a,s,c,l,h,u,f,d,p,g,m=[];for(f=(t=A(t)).length, e=S, o=x, a=n=0;a<f;++a)(u=t[a])<128&&m.push(C(u));for(r=i=m.length, i&&m.push(k);r<f;){for(s=y, a=0;a<f;++a)e<=(u=t[a])&&u<s&&(s=u);for(s-e>_((y-n)/(d=r+1))&&I("overflow"), n+=(s-e)*d, e=s, a=0;a<f;++a)if((u=t[a])<e&&++n>y&&I("overflow"), u==e){for(c=n, l=w;!(c<(h=l<=o?v:o+b<=l?b:l-o));l+=w)g=c-h, p=w-h, m.push(C(F(h+g%p,0))), c=_(g/p);m.push(C(F(c,0))), o=q(n,d,r==i), n=0, ++r;}++n, ++e;}return m.join("")}if(i={version:"1.2.4",ucs2:{decode:A,encode:T},decode:g,encode:m,toASCII:function(t){return p(t,function(t){return l.test(t)?"xn--"+m(t):t})},toUnicode:function(t){return p(t,function(t){return c.test(t)?g(t.slice(4).toLowerCase()):t})}}, e&&!e.nodeType)if(n)n.exports=i;else for(o in i)i.hasOwnProperty(o)&&(e[o]=i[o]);else t.punycode=i;}(this);}).call(this,"undefined"!=typeof commonjsGlobal?commonjsGlobal:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});},{}],2:[function(t,e,n){var i=t("./log");function u(t,e){for(var n=3===t.nodeType?document.createTextNode(t.nodeValue):t.cloneNode(!1),r=t.firstChild;r;)!0!==e&&1===r.nodeType&&"SCRIPT"===r.nodeName||n.appendChild(u(r,e)), r=r.nextSibling;return 1===t.nodeType&&(n._scrollTop=t.scrollTop, n._scrollLeft=t.scrollLeft, "CANVAS"===t.nodeName?function(e,t){try{t&&(t.width=e.width, t.height=e.height, t.getContext("2d").putImageData(e.getContext("2d").getImageData(0,0,e.width,e.height),0,0));}catch(t){i("Unable to copy canvas content from",e,t);}}(t,n):"TEXTAREA"!==t.nodeName&&"SELECT"!==t.nodeName||(n.value=t.value)), n}e.exports=function(o,t,e,n,a,s,c){var l=u(o.documentElement,a.javascriptEnabled),h=t.createElement("iframe");return h.className="html2canvas-container", h.style.visibility="hidden", h.style.position="fixed", h.style.left="-10000px", h.style.top="0px", h.style.border="0", h.width=e, h.height=n, h.scrolling="no", t.body.appendChild(h), new Promise(function(e){var t,n,r,i=h.contentWindow.document;h.contentWindow.onload=h.onload=function(){var t=setInterval(function(){0<i.body.childNodes.length&&(!function t(e){if(1===e.nodeType){e.scrollTop=e._scrollTop, e.scrollLeft=e._scrollLeft;for(var n=e.firstChild;n;)t(n), n=n.nextSibling;}}(i.documentElement), clearInterval(t), "view"===a.type&&(h.contentWindow.scrollTo(s,c), !/(iPad|iPhone|iPod)/g.test(navigator.userAgent)||h.contentWindow.scrollY===c&&h.contentWindow.scrollX===s||(i.documentElement.style.top=-c+"px", i.documentElement.style.left=-s+"px", i.documentElement.style.position="absolute")), e(h));},50);}, i.open(), i.write("<!DOCTYPE html><html></html>"), n=s, r=c, !(t=o).defaultView||n===t.defaultView.pageXOffset&&r===t.defaultView.pageYOffset||t.defaultView.scrollTo(n,r), i.replaceChild(i.adoptNode(l),i.documentElement), i.close();})};},{"./log":13}],3:[function(t,e,n){function r(t){this.r=0, this.g=0, this.b=0, this.a=null;this.fromArray(t)||this.namedColor(t)||this.rgb(t)||this.rgba(t)||this.hex6(t)||this.hex3(t);}r.prototype.darken=function(t){var e=1-t;return new r([Math.round(this.r*e),Math.round(this.g*e),Math.round(this.b*e),this.a])}, r.prototype.isTransparent=function(){return 0===this.a}, r.prototype.isBlack=function(){return 0===this.r&&0===this.g&&0===this.b}, r.prototype.fromArray=function(t){return Array.isArray(t)&&(this.r=Math.min(t[0],255), this.g=Math.min(t[1],255), this.b=Math.min(t[2],255), 3<t.length&&(this.a=t[3])), Array.isArray(t)};var i=/^#([a-f0-9]{3})$/i;r.prototype.hex3=function(t){var e;return null!==(e=t.match(i))&&(this.r=parseInt(e[1][0]+e[1][0],16), this.g=parseInt(e[1][1]+e[1][1],16), this.b=parseInt(e[1][2]+e[1][2],16)), null!==e};var o=/^#([a-f0-9]{6})$/i;r.prototype.hex6=function(t){var e=null;return null!==(e=t.match(o))&&(this.r=parseInt(e[1].substring(0,2),16), this.g=parseInt(e[1].substring(2,4),16), this.b=parseInt(e[1].substring(4,6),16)), null!==e};var a=/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;r.prototype.rgb=function(t){var e;return null!==(e=t.match(a))&&(this.r=Number(e[1]), this.g=Number(e[2]), this.b=Number(e[3])), null!==e};var s=/^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d?\.?\d+)\s*\)$/;r.prototype.rgba=function(t){var e;return null!==(e=t.match(s))&&(this.r=Number(e[1]), this.g=Number(e[2]), this.b=Number(e[3]), this.a=Number(e[4])), null!==e}, r.prototype.toString=function(){return null!==this.a&&1!==this.a?"rgba("+[this.r,this.g,this.b,this.a].join(",")+")":"rgb("+[this.r,this.g,this.b].join(",")+")"}, r.prototype.namedColor=function(t){t=t.toLowerCase();var e=c[t];if(e)this.r=e[0], this.g=e[1], this.b=e[2];else if("transparent"===t)return this.r=this.g=this.b=this.a=0, !0;return!!e}, r.prototype.isColor=!0;var c={aliceblue:[240,248,255],antiquewhite:[250,235,215],aqua:[0,255,255],aquamarine:[127,255,212],azure:[240,255,255],beige:[245,245,220],bisque:[255,228,196],black:[0,0,0],blanchedalmond:[255,235,205],blue:[0,0,255],blueviolet:[138,43,226],brown:[165,42,42],burlywood:[222,184,135],cadetblue:[95,158,160],chartreuse:[127,255,0],chocolate:[210,105,30],coral:[255,127,80],cornflowerblue:[100,149,237],cornsilk:[255,248,220],crimson:[220,20,60],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgoldenrod:[184,134,11],darkgray:[169,169,169],darkgreen:[0,100,0],darkgrey:[169,169,169],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkseagreen:[143,188,143],darkslateblue:[72,61,139],darkslategray:[47,79,79],darkslategrey:[47,79,79],darkturquoise:[0,206,209],darkviolet:[148,0,211],deeppink:[255,20,147],deepskyblue:[0,191,255],dimgray:[105,105,105],dimgrey:[105,105,105],dodgerblue:[30,144,255],firebrick:[178,34,34],floralwhite:[255,250,240],forestgreen:[34,139,34],fuchsia:[255,0,255],gainsboro:[220,220,220],ghostwhite:[248,248,255],gold:[255,215,0],goldenrod:[218,165,32],gray:[128,128,128],green:[0,128,0],greenyellow:[173,255,47],grey:[128,128,128],honeydew:[240,255,240],hotpink:[255,105,180],indianred:[205,92,92],indigo:[75,0,130],ivory:[255,255,240],khaki:[240,230,140],lavender:[230,230,250],lavenderblush:[255,240,245],lawngreen:[124,252,0],lemonchiffon:[255,250,205],lightblue:[173,216,230],lightcoral:[240,128,128],lightcyan:[224,255,255],lightgoldenrodyellow:[250,250,210],lightgray:[211,211,211],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightsalmon:[255,160,122],lightseagreen:[32,178,170],lightskyblue:[135,206,250],lightslategray:[119,136,153],lightslategrey:[119,136,153],lightsteelblue:[176,196,222],lightyellow:[255,255,224],lime:[0,255,0],limegreen:[50,205,50],linen:[250,240,230],magenta:[255,0,255],maroon:[128,0,0],mediumaquamarine:[102,205,170],mediumblue:[0,0,205],mediumorchid:[186,85,211],mediumpurple:[147,112,219],mediumseagreen:[60,179,113],mediumslateblue:[123,104,238],mediumspringgreen:[0,250,154],mediumturquoise:[72,209,204],mediumvioletred:[199,21,133],midnightblue:[25,25,112],mintcream:[245,255,250],mistyrose:[255,228,225],moccasin:[255,228,181],navajowhite:[255,222,173],navy:[0,0,128],oldlace:[253,245,230],olive:[128,128,0],olivedrab:[107,142,35],orange:[255,165,0],orangered:[255,69,0],orchid:[218,112,214],palegoldenrod:[238,232,170],palegreen:[152,251,152],paleturquoise:[175,238,238],palevioletred:[219,112,147],papayawhip:[255,239,213],peachpuff:[255,218,185],peru:[205,133,63],pink:[255,192,203],plum:[221,160,221],powderblue:[176,224,230],purple:[128,0,128],rebeccapurple:[102,51,153],red:[255,0,0],rosybrown:[188,143,143],royalblue:[65,105,225],saddlebrown:[139,69,19],salmon:[250,128,114],sandybrown:[244,164,96],seagreen:[46,139,87],seashell:[255,245,238],sienna:[160,82,45],silver:[192,192,192],skyblue:[135,206,235],slateblue:[106,90,205],slategray:[112,128,144],slategrey:[112,128,144],snow:[255,250,250],springgreen:[0,255,127],steelblue:[70,130,180],tan:[210,180,140],teal:[0,128,128],thistle:[216,191,216],tomato:[255,99,71],turquoise:[64,224,208],violet:[238,130,238],wheat:[245,222,179],white:[255,255,255],whitesmoke:[245,245,245],yellow:[255,255,0],yellowgreen:[154,205,50]};e.exports=r;},{}],4:[function(t,e,n){var p=t("./support"),d=t("./renderers/canvas"),g=t("./imageloader"),m=t("./nodeparser"),r=t("./nodecontainer"),y=t("./log"),i=t("./utils"),w=t("./clone"),v=t("./proxy").loadUrlDocument,b=i.getBounds,x="data-html2canvas-node",S=0;function o(t,e){var n,r,i=S++;if((e=e||{}).logging&&(y.options.logging=!0, y.options.start=Date.now()), e.async=void 0===e.async||e.async, e.allowTaint=void 0!==e.allowTaint&&e.allowTaint, e.removeContainer=void 0===e.removeContainer||e.removeContainer, e.javascriptEnabled=void 0!==e.javascriptEnabled&&e.javascriptEnabled, e.imageTimeout=void 0===e.imageTimeout?1e4:e.imageTimeout, e.renderer="function"==typeof e.renderer?e.renderer:d, e.strict=!!e.strict, "string"==typeof t){if("string"!=typeof e.proxy)return Promise.reject("Proxy must be used when rendering url");var o=null!=e.width?e.width:window.innerWidth,a=null!=e.height?e.height:window.innerHeight;return v((n=t, r=document.createElement("a"), r.href=n, r.href=r.href, r),e.proxy,document,o,a,e).then(function(t){return k(t.contentWindow.document.documentElement,t,e,o,a)})}var s,c,l,h,u,f=(void 0===t?[document.documentElement]:t.length?t:[t])[0];return f.setAttribute(x+i,i), (s=f.ownerDocument, c=e, l=f.ownerDocument.defaultView.innerWidth, h=f.ownerDocument.defaultView.innerHeight, u=i, w(s,s,l,h,c,s.defaultView.pageXOffset,s.defaultView.pageYOffset).then(function(t){y("Document cloned");var e=x+u,n="["+e+"='"+u+"']";s.querySelector(n).removeAttribute(e);var r=t.contentWindow,i=r.document.querySelector(n),o="function"==typeof c.onclone?Promise.resolve(c.onclone(r.document)):Promise.resolve(!0);return o.then(function(){return k(i,t,c,l,h)})})).then(function(t){return"function"==typeof e.onrendered&&(y("options.onrendered is deprecated, html2canvas returns a Promise containing the canvas"), e.onrendered(t)), t})}o.CanvasRenderer=d, o.NodeContainer=r, o.log=y, o.utils=i;var a="undefined"==typeof document||"function"!=typeof Object.create||"function"!=typeof document.createElement("canvas").getContext?function(){return Promise.reject("No canvas support")}:o;function k(n,r,i,t,e){var o,a,s=r.contentWindow,c=new p(s.document),l=new g(i,c),h=b(n),u="view"===i.type?t:(o=s.document, Math.max(Math.max(o.body.scrollWidth,o.documentElement.scrollWidth),Math.max(o.body.offsetWidth,o.documentElement.offsetWidth),Math.max(o.body.clientWidth,o.documentElement.clientWidth))),f="view"===i.type?e:(a=s.document, Math.max(Math.max(a.body.scrollHeight,a.documentElement.scrollHeight),Math.max(a.body.offsetHeight,a.documentElement.offsetHeight),Math.max(a.body.clientHeight,a.documentElement.clientHeight))),d=new i.renderer(u,f,l,i,document);return new m(n,d,c,l,i).ready.then(function(){var t,e;return y("Finished rendering"), t="view"===i.type?_(d.canvas,{width:d.canvas.width,height:d.canvas.height,top:0,left:0,x:0,y:0}):n===s.document.body||n===s.document.documentElement||null!=i.canvas?d.canvas:_(d.canvas,{width:null!=i.width?i.width:h.width,height:null!=i.height?i.height:h.height,top:h.top,left:h.left,x:0,y:0}), e=r, i.removeContainer&&(e.parentNode.removeChild(e), y("Cleaned up container")), t})}function _(t,e){var n=document.createElement("canvas"),r=Math.min(t.width-1,Math.max(0,e.left)),i=Math.min(t.width,Math.max(1,e.left+e.width)),o=Math.min(t.height-1,Math.max(0,e.top)),a=Math.min(t.height,Math.max(1,e.top+e.height));n.width=e.width, n.height=e.height;var s=i-r,c=a-o;return y("Cropping canvas at:","left:",e.left,"top:",e.top,"width:",s,"height:",c), y("Resulting crop with width",e.width,"and height",e.height,"with x",r,"and y",o), n.getContext("2d").drawImage(t,r,o,s,c,e.x,e.y,s,c), n}e.exports=a;},{"./clone":2,"./imageloader":11,"./log":13,"./nodecontainer":14,"./nodeparser":15,"./proxy":16,"./renderers/canvas":20,"./support":22,"./utils":26}],5:[function(t,e,n){var r=t("./log"),i=t("./utils").smallImage;e.exports=function t(e){if(this.src=e, r("DummyImageContainer for",e), !this.promise||!this.image){r("Initiating DummyImageContainer"), t.prototype.image=new Image;var n=this.image;t.prototype.promise=new Promise(function(t,e){n.onload=t, n.onerror=e, n.src=i(), !0===n.complete&&t(n);});}};},{"./log":13,"./utils":26}],6:[function(t,e,n){var c=t("./utils").smallImage;e.exports=function(t,e){var n,r,i=document.createElement("div"),o=document.createElement("img"),a=document.createElement("span"),s="Hidden Text";i.style.visibility="hidden", i.style.fontFamily=t, i.style.fontSize=e, i.style.margin=0, i.style.padding=0, document.body.appendChild(i), o.src=c(), o.width=1, o.height=1, o.style.margin=0, o.style.padding=0, o.style.verticalAlign="baseline", a.style.fontFamily=t, a.style.fontSize=e, a.style.margin=0, a.style.padding=0, a.appendChild(document.createTextNode(s)), i.appendChild(a), i.appendChild(o), n=o.offsetTop-a.offsetTop+1, i.removeChild(a), i.appendChild(document.createTextNode(s)), i.style.lineHeight="normal", o.style.verticalAlign="super", r=o.offsetTop-i.offsetTop+1, document.body.removeChild(i), this.baseline=n, this.lineWidth=1, this.middle=r;};},{"./utils":26}],7:[function(t,e,n){var r=t("./font");function i(){this.data={};}i.prototype.getMetrics=function(t,e){return void 0===this.data[t+"-"+e]&&(this.data[t+"-"+e]=new r(t,e)), this.data[t+"-"+e]}, e.exports=i;},{"./font":6}],8:[function(o,t,e){var a=o("./utils").getBounds,i=o("./proxy").loadUrlDocument;function n(e,t,n){this.image=null, this.src=e;var r=this,i=a(e);this.promise=(t?new Promise(function(t){"about:blank"===e.contentWindow.document.URL||null==e.contentWindow.document.documentElement?e.contentWindow.onload=e.onload=function(){t(e);}:t(e);}):this.proxyLoad(n.proxy,i,n)).then(function(t){return o("./core")(t.contentWindow.document.documentElement,{type:"view",width:t.width,height:t.height,proxy:n.proxy,javascriptEnabled:n.javascriptEnabled,removeContainer:n.removeContainer,allowTaint:n.allowTaint,imageTimeout:n.imageTimeout/2})}).then(function(t){return r.image=t});}n.prototype.proxyLoad=function(t,e,n){var r=this.src;return i(r.src,t,r.ownerDocument,e.width,e.height,n)}, t.exports=n;},{"./core":4,"./proxy":16,"./utils":26}],9:[function(t,e,n){function r(t){this.src=t.value, this.colorStops=[], this.type=null, this.x0=.5, this.y0=.5, this.x1=.5, this.y1=.5, this.promise=Promise.resolve(!0);}r.TYPES={LINEAR:1,RADIAL:2}, r.REGEXP_COLORSTOP=/^\s*(rgba?\(\s*\d{1,3},\s*\d{1,3},\s*\d{1,3}(?:,\s*[0-9\.]+)?\s*\)|[a-z]{3,20}|#[a-f0-9]{3,6})(?:\s+(\d{1,3}(?:\.\d+)?)(%|px)?)?(?:\s|$)/i, e.exports=r;},{}],10:[function(t,e,n){e.exports=function(n,r){this.src=n, this.image=new Image;var i=this;this.tainted=null, this.promise=new Promise(function(t,e){i.image.onload=t, i.image.onerror=e, r&&(i.image.crossOrigin="anonymous"), i.image.src=n, !0===i.image.complete&&t(i.image);});};},{}],11:[function(t,e,n){var o=t("./log"),r=t("./imagecontainer"),i=t("./dummyimagecontainer"),a=t("./proxyimagecontainer"),s=t("./framecontainer"),c=t("./svgcontainer"),l=t("./svgnodecontainer"),h=t("./lineargradientcontainer"),u=t("./webkitgradientcontainer"),f=t("./utils").bind;function d(t,e){this.link=null, this.options=t, this.support=e, this.origin=this.getOrigin(window.location.href);}d.prototype.findImages=function(t){var e=[];return t.reduce(function(t,e){switch(e.node.nodeName){case"IMG":return t.concat([{args:[e.node.src],method:"url"}]);case"svg":case"IFRAME":return t.concat([{args:[e.node],method:e.node.nodeName}])}return t},[]).forEach(this.addImage(e,this.loadImage),this), e}, d.prototype.findBackgroundImage=function(t,e){return e.parseBackgroundImages().filter(this.hasImageBackground).forEach(this.addImage(t,this.loadImage),this), t}, d.prototype.addImage=function(n,r){return function(e){e.args.forEach(function(t){this.imageExists(n,t)||(n.splice(0,0,r.call(this,e)), o("Added image #"+n.length,"string"==typeof t?t.substring(0,100):t));},this);}}, d.prototype.hasImageBackground=function(t){return"none"!==t.method}, d.prototype.loadImage=function(t){if("url"===t.method){var e=t.args[0];return!this.isSVG(e)||this.support.svg||this.options.allowTaint?e.match(/data:image\/.*;base64,/i)?new r(e.replace(/url\(['"]{0,}|['"]{0,}\)$/gi,""),!1):this.isSameOrigin(e)||!0===this.options.allowTaint||this.isSVG(e)?new r(e,!1):this.support.cors&&!this.options.allowTaint&&this.options.useCORS?new r(e,!0):this.options.proxy?new a(e,this.options.proxy):new i(e):new c(e)}return"linear-gradient"===t.method?new h(t):"gradient"===t.method?new u(t):"svg"===t.method?new l(t.args[0],this.support.svg):"IFRAME"===t.method?new s(t.args[0],this.isSameOrigin(t.args[0].src),this.options):new i(t)}, d.prototype.isSVG=function(t){return"svg"===t.substring(t.length-3).toLowerCase()||c.prototype.isInline(t)}, d.prototype.imageExists=function(t,e){return t.some(function(t){return t.src===e})}, d.prototype.isSameOrigin=function(t){return this.getOrigin(t)===this.origin}, d.prototype.getOrigin=function(t){var e=this.link||(this.link=document.createElement("a"));return e.href=t, e.href=e.href, e.protocol+e.hostname+e.port}, d.prototype.getPromise=function(e){return this.timeout(e,this.options.imageTimeout).catch(function(){return new i(e.src).promise.then(function(t){e.image=t;})})}, d.prototype.get=function(e){var n=null;return this.images.some(function(t){return(n=t).src===e})?n:null}, d.prototype.fetch=function(t){return this.images=t.reduce(f(this.findBackgroundImage,this),this.findImages(t)), this.images.forEach(function(e,n){e.promise.then(function(){o("Succesfully loaded image #"+(n+1),e);},function(t){o("Failed loading image #"+(n+1),e,t);});}), this.ready=Promise.all(this.images.map(this.getPromise,this)), o("Finished searching images"), this}, d.prototype.timeout=function(n,r){var i,t=Promise.race([n.promise,new Promise(function(t,e){i=setTimeout(function(){o("Timed out loading image",n), e(n);},r);})]).then(function(t){return clearTimeout(i), t});return t.catch(function(){clearTimeout(i);}), t}, e.exports=d;},{"./dummyimagecontainer":5,"./framecontainer":8,"./imagecontainer":10,"./lineargradientcontainer":12,"./log":13,"./proxyimagecontainer":17,"./svgcontainer":23,"./svgnodecontainer":24,"./utils":26,"./webkitgradientcontainer":27}],12:[function(t,e,n){var i=t("./gradientcontainer"),o=t("./color");function r(t){i.apply(this,arguments), this.type=i.TYPES.LINEAR;var e=r.REGEXP_DIRECTION.test(t.args[0])||!i.REGEXP_COLORSTOP.test(t.args[0]);e?t.args[0].split(/\s+/).reverse().forEach(function(t,e){switch(t){case"left":this.x0=0, this.x1=1;break;case"top":this.y0=0, this.y1=1;break;case"right":this.x0=1, this.x1=0;break;case"bottom":this.y0=1, this.y1=0;break;case"to":var n=this.y0,r=this.x0;this.y0=this.y1, this.x0=this.x1, this.x1=r, this.y1=n;break;case"center":break;default:var i=.01*parseFloat(t,10);if(isNaN(i))break;0===e?(this.y0=i, this.y1=1-this.y0):(this.x0=i, this.x1=1-this.x0);}},this):(this.y0=0, this.y1=1), this.colorStops=t.args.slice(e?1:0).map(function(t){var e=t.match(i.REGEXP_COLORSTOP),n=+e[2],r=0===n?"%":e[3];return{color:new o(e[1]),stop:"%"===r?n/100:null}}), null===this.colorStops[0].stop&&(this.colorStops[0].stop=0), null===this.colorStops[this.colorStops.length-1].stop&&(this.colorStops[this.colorStops.length-1].stop=1), this.colorStops.forEach(function(n,r){null===n.stop&&this.colorStops.slice(r).some(function(t,e){return null!==t.stop&&(n.stop=(t.stop-this.colorStops[r-1].stop)/(e+1)+this.colorStops[r-1].stop, !0)},this);},this);}r.prototype=Object.create(i.prototype), r.REGEXP_DIRECTION=/^\s*(?:to|left|right|top|bottom|center|\d{1,3}(?:\.\d+)?%?)(?:\s|$)/i, e.exports=r;},{"./color":3,"./gradientcontainer":9}],13:[function(t,e,n){var r=function(){r.options.logging&&window.console&&window.console.log&&Function.prototype.bind.call(window.console.log,window.console).apply(window.console,[Date.now()-r.options.start+"ms","html2canvas:"].concat([].slice.call(arguments,0)));};r.options={logging:!1}, e.exports=r;},{}],14:[function(t,e,n){var o=t("./color"),r=t("./utils"),i=r.getBounds,a=r.parseBackgrounds,s=r.offsetBounds;function c(t,e){this.node=t, this.parent=e, this.stack=null, this.bounds=null, this.borders=null, this.clip=[], this.backgroundClip=[], this.offsetBounds=null, this.visible=null, this.computedStyles=null, this.colors={}, this.styles={}, this.backgroundImages=null, this.transformData=null, this.transformMatrix=null, this.isPseudoElement=!1, this.opacity=null;}function l(t){return-1!==t.toString().indexOf("%")}function h(t){return t.replace("px","")}function u(t){return parseFloat(t)}c.prototype.cloneTo=function(t){t.visible=this.visible, t.borders=this.borders, t.bounds=this.bounds, t.clip=this.clip, t.backgroundClip=this.backgroundClip, t.computedStyles=this.computedStyles, t.styles=this.styles, t.backgroundImages=this.backgroundImages, t.opacity=this.opacity;}, c.prototype.getOpacity=function(){return null===this.opacity?this.opacity=this.cssFloat("opacity"):this.opacity}, c.prototype.assignStack=function(t){(this.stack=t).children.push(this);}, c.prototype.isElementVisible=function(){return this.node.nodeType===Node.TEXT_NODE?this.parent.visible:"none"!==this.css("display")&&"hidden"!==this.css("visibility")&&!this.node.hasAttribute("data-html2canvas-ignore")&&("INPUT"!==this.node.nodeName||"hidden"!==this.node.getAttribute("type"))}, c.prototype.css=function(t){return this.computedStyles||(this.computedStyles=this.isPseudoElement?this.parent.computedStyle(this.before?":before":":after"):this.computedStyle(null)), this.styles[t]||(this.styles[t]=this.computedStyles[t])}, c.prototype.prefixedCss=function(e){var n=this.css(e);return void 0===n&&["webkit","moz","ms","o"].some(function(t){return void 0!==(n=this.css(t+e.substr(0,1).toUpperCase()+e.substr(1)))},this), void 0===n?null:n}, c.prototype.computedStyle=function(t){return this.node.ownerDocument.defaultView.getComputedStyle(this.node,t)}, c.prototype.cssInt=function(t){var e=parseInt(this.css(t),10);return isNaN(e)?0:e}, c.prototype.color=function(t){return this.colors[t]||(this.colors[t]=new o(this.css(t)))}, c.prototype.cssFloat=function(t){var e=parseFloat(this.css(t));return isNaN(e)?0:e}, c.prototype.fontWeight=function(){var t=this.css("fontWeight");switch(parseInt(t,10)){case 401:t="bold";break;case 400:t="normal";}return t}, c.prototype.parseClip=function(){var t=this.css("clip").match(this.CLIP);return t?{top:parseInt(t[1],10),right:parseInt(t[2],10),bottom:parseInt(t[3],10),left:parseInt(t[4],10)}:null}, c.prototype.parseBackgroundImages=function(){return this.backgroundImages||(this.backgroundImages=a(this.css("backgroundImage")))}, c.prototype.cssList=function(t,e){var n=(this.css(t)||"").split(",");return 1===(n=(n=n[e||0]||n[0]||"auto").trim().split(" ")).length&&(n=[n[0],l(n[0])?"auto":n[0]]), n}, c.prototype.parseBackgroundSize=function(t,e,n){var r,i,o=this.cssList("backgroundSize",n);if(l(o[0]))r=t.width*parseFloat(o[0])/100;else{if(/contain|cover/.test(o[0])){var a=t.width/t.height,s=e.width/e.height;return a<s^"contain"===o[0]?{width:t.height*s,height:t.height}:{width:t.width,height:t.width/s}}r=parseInt(o[0],10);}return i="auto"===o[0]&&"auto"===o[1]?e.height:"auto"===o[1]?r/e.width*e.height:l(o[1])?t.height*parseFloat(o[1])/100:parseInt(o[1],10), "auto"===o[0]&&(r=i/e.height*e.width), {width:r,height:i}}, c.prototype.parseBackgroundPosition=function(t,e,n,r){var i,o,a=this.cssList("backgroundPosition",n);return i=l(a[0])?(t.width-(r||e).width)*(parseFloat(a[0])/100):parseInt(a[0],10), o="auto"===a[1]?i/e.width*e.height:l(a[1])?(t.height-(r||e).height)*parseFloat(a[1])/100:parseInt(a[1],10), "auto"===a[0]&&(i=o/e.height*e.width), {left:i,top:o}}, c.prototype.parseBackgroundRepeat=function(t){return this.cssList("backgroundRepeat",t)[0]}, c.prototype.parseTextShadows=function(){var t=this.css("textShadow"),e=[];if(t&&"none"!==t)for(var n=t.match(this.TEXT_SHADOW_PROPERTY),r=0;n&&r<n.length;r++){var i=n[r].match(this.TEXT_SHADOW_VALUES);e.push({color:new o(i[0]),offsetX:i[1]?parseFloat(i[1].replace("px","")):0,offsetY:i[2]?parseFloat(i[2].replace("px","")):0,blur:i[3]?i[3].replace("px",""):0});}return e}, c.prototype.parseTransform=function(){if(!this.transformData)if(this.hasTransform()){var t=this.parseBounds(),e=this.prefixedCss("transformOrigin").split(" ").map(h).map(u);e[0]+=t.left, e[1]+=t.top, this.transformData={origin:e,matrix:this.parseTransformMatrix()};}else this.transformData={origin:[0,0],matrix:[1,0,0,1,0,0]};return this.transformData}, c.prototype.parseTransformMatrix=function(){if(!this.transformMatrix){var t=this.prefixedCss("transform"),e=t?function(t){{if(t&&"matrix"===t[1])return t[2].split(",").map(function(t){return parseFloat(t.trim())});if(t&&"matrix3d"===t[1]){var e=t[2].split(",").map(function(t){return parseFloat(t.trim())});return[e[0],e[1],e[4],e[5],e[12],e[13]]}}}(t.match(this.MATRIX_PROPERTY)):null;this.transformMatrix=e||[1,0,0,1,0,0];}return this.transformMatrix}, c.prototype.parseBounds=function(){return this.bounds||(this.bounds=this.hasTransform()?s(this.node):i(this.node))}, c.prototype.hasTransform=function(){return"1,0,0,1,0,0"!==this.parseTransformMatrix().join(",")||this.parent&&this.parent.hasTransform()}, c.prototype.getValue=function(){var t,e,n=this.node.value||"";return"SELECT"===this.node.tagName?(t=this.node, n=(e=t.options[t.selectedIndex||0])&&e.text||""):"password"===this.node.type&&(n=Array(n.length+1).join("•")), 0===n.length?this.node.placeholder||"":n}, c.prototype.MATRIX_PROPERTY=/(matrix|matrix3d)\((.+)\)/, c.prototype.TEXT_SHADOW_PROPERTY=/((rgba|rgb)\([^\)]+\)(\s-?\d+px){0,})/g, c.prototype.TEXT_SHADOW_VALUES=/(-?\d+px)|(#.+)|(rgb\(.+\))|(rgba\(.+\))/g, c.prototype.CLIP=/^rect\((\d+)px,? (\d+)px,? (\d+)px,? (\d+)px\)$/, e.exports=c;},{"./color":3,"./utils":26}],15:[function(t,e,n){var s=t("./log"),c=t("punycode"),l=t("./nodecontainer"),f=t("./textcontainer"),d=t("./pseudoelementcontainer"),h=t("./fontmetrics"),u=t("./color"),p=t("./stackingcontext"),r=t("./utils"),g=r.bind,a=r.getBounds,m=r.parseBackgrounds,y=r.offsetBounds;function i(t,e,n,r,i){s("Starting NodeParser"), this.renderer=e, this.options=i, this.range=null, this.support=n, this.renderQueue=[], this.stack=new p(!0,1,t.ownerDocument,null);var o=new l(t,null);if(i.background&&e.rectangle(0,0,e.width,e.height,new u(i.background)), t===t.ownerDocument.documentElement){var a=new l(o.color("backgroundColor").isTransparent()?t.ownerDocument.body:t.ownerDocument.documentElement,null);e.rectangle(0,0,e.width,e.height,a.color("backgroundColor"));}o.visibile=o.isElementVisible(), this.createPseudoHideStyles(t.ownerDocument), this.disableAnimations(t.ownerDocument), this.nodes=U([o].concat(this.getChildren(o)).filter(function(t){return t.visible=t.isElementVisible()}).map(this.getPseudoElements,this)), this.fontMetrics=new h, s("Fetched nodes, total:",this.nodes.length), s("Calculate overflow clips"), this.calculateOverflowClips(), s("Start fetching images"), this.images=r.fetch(this.nodes.filter(R)), this.ready=this.images.ready.then(g(function(){return s("Images loaded, starting parsing"), s("Creating stacking contexts"), this.createStackingContexts(), s("Sorting stacking contexts"), this.sortStackingContexts(this.stack), this.parse(this.stack), s("Render queue created with "+this.renderQueue.length+" items"), new Promise(g(function(t){i.async?"function"==typeof i.async?i.async.call(this,this.renderQueue,t):0<this.renderQueue.length?(this.renderIndex=0, this.asyncRenderer(this.renderQueue,t)):t():(this.renderQueue.forEach(this.paint,this), t());},this))},this));}function o(t){return t.parent&&t.parent.clip.length}function w(){}i.prototype.calculateOverflowClips=function(){this.nodes.forEach(function(t){if(R(t)){D(t)&&t.appendToDOM(), t.borders=this.parseBorders(t);var e="hidden"===t.css("overflow")?[t.borders.clip]:[],n=t.parseClip();n&&-1!==["absolute","fixed"].indexOf(t.css("position"))&&e.push([["rect",t.bounds.left+n.left,t.bounds.top+n.top,n.right-n.left,n.bottom-n.top]]), t.clip=o(t)?t.parent.clip.concat(e):e, t.backgroundClip="hidden"!==t.css("overflow")?t.clip.concat([t.borders.clip]):t.clip, D(t)&&t.cleanDOM();}else M(t)&&(t.clip=o(t)?t.parent.clip:[]);D(t)||(t.bounds=null);},this);}, i.prototype.asyncRenderer=function(t,e,n){n=n||Date.now(), this.paint(t[this.renderIndex++]), t.length===this.renderIndex?e():n+20>Date.now()?this.asyncRenderer(t,e,n):setTimeout(g(function(){this.asyncRenderer(t,e);},this),0);}, i.prototype.createPseudoHideStyles=function(t){this.createStyles(t,"."+d.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE+':before { content: "" !important; display: none !important; }.'+d.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER+':after { content: "" !important; display: none !important; }');}, i.prototype.disableAnimations=function(t){this.createStyles(t,"* { -webkit-animation: none !important; -moz-animation: none !important; -o-animation: none !important; animation: none !important; -webkit-transition: none !important; -moz-transition: none !important; -o-transition: none !important; transition: none !important;}");}, i.prototype.createStyles=function(t,e){var n=t.createElement("style");n.innerHTML=e, t.body.appendChild(n);}, i.prototype.getPseudoElements=function(t){var e=[[t]];if(t.node.nodeType===Node.ELEMENT_NODE){var n=this.getPseudoElement(t,":before"),r=this.getPseudoElement(t,":after");n&&e.push(n), r&&e.push(r);}return U(e)}, i.prototype.getPseudoElement=function(t,e){var n=t.computedStyle(e);if(!n||!n.content||"none"===n.content||"-moz-alt-content"===n.content||"none"===n.display)return null;for(var r,i,o=(r=n.content, (i=r.substr(0,1))===r.substr(r.length-1)&&i.match(/'|"/)?r.substr(1,r.length-2):r),a="url"===o.substr(0,3),s=document.createElement(a?"img":"html2canvaspseudoelement"),c=new d(s,t,e),l=n.length-1;0<=l;l--){var h=n.item(l).replace(/(\-[a-z])/g,function(t){return t.toUpperCase().replace("-","")});s.style[h]=n[h];}if(s.className=d.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE+" "+d.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER, a)return s.src=m(o)[0].args[0], [c];var u=document.createTextNode(o);return s.appendChild(u), [c,new f(u,c)]}, i.prototype.getChildren=function(n){return U([].filter.call(n.node.childNodes,P).map(function(t){var e=[t.nodeType===Node.TEXT_NODE?new f(t,n):new l(t,n)].filter(L);return t.nodeType===Node.ELEMENT_NODE&&e.length&&"TEXTAREA"!==t.tagName?e[0].isElementVisible()?e.concat(this.getChildren(e[0])):[]:e},this))}, i.prototype.newStackingContext=function(t,e){var n=new p(e,t.getOpacity(),t.node,t.parent);t.cloneTo(n), (e?n.getParentStack(this):n.parent.stack).contexts.push(n), t.stack=n;}, i.prototype.createStackingContexts=function(){this.nodes.forEach(function(t){var e,n;R(t)&&(this.isRootElement(t)||t.getOpacity()<1||(n=(e=t).css("position"), "auto"!==(-1!==["absolute","relative","fixed"].indexOf(n)?e.css("zIndex"):"auto"))||this.isBodyWithTransparentRoot(t)||t.hasTransform())?this.newStackingContext(t,!0):R(t)&&(O(t)&&T(t)||-1!==["inline-block","inline-table"].indexOf(t.css("display"))||B(t))?this.newStackingContext(t,!1):t.assignStack(t.parent.stack);},this);}, i.prototype.isBodyWithTransparentRoot=function(t){return"BODY"===t.node.nodeName&&t.parent.color("backgroundColor").isTransparent()}, i.prototype.isRootElement=function(t){return null===t.parent}, i.prototype.sortStackingContexts=function(t){var n;t.contexts.sort((n=t.contexts.slice(0), function(t,e){return t.cssInt("zIndex")+n.indexOf(t)/n.length-(e.cssInt("zIndex")+n.indexOf(e)/n.length)})), t.contexts.forEach(this.sortStackingContexts,this);}, i.prototype.parseTextBounds=function(a){return function(t,e,n){if("none"!==a.parent.css("textDecoration").substr(0,4)||0!==t.trim().length){if(this.support.rangeBounds&&!a.parent.hasTransform()){var r=n.slice(0,e).join("").length;return this.getRangeBounds(a.node,r,t.length)}if(a.node&&"string"==typeof a.node.data){var i=a.node.splitText(t.length),o=this.getWrapperBounds(a.node,a.parent.hasTransform());return a.node=i, o}}else this.support.rangeBounds&&!a.parent.hasTransform()||(a.node=a.node.splitText(t.length));return{}}}, i.prototype.getWrapperBounds=function(t,e){var n=t.ownerDocument.createElement("html2canvaswrapper"),r=t.parentNode,i=t.cloneNode(!0);n.appendChild(t.cloneNode(!0)), r.replaceChild(n,t);var o=e?y(n):a(n);return r.replaceChild(i,n), o}, i.prototype.getRangeBounds=function(t,e,n){var r=this.range||(this.range=t.ownerDocument.createRange());return r.setStart(t,e), r.setEnd(t,e+n), r.getBoundingClientRect()}, i.prototype.parse=function(t){var e=t.contexts.filter(I),n=t.children.filter(R),r=n.filter(j(B)),i=r.filter(j(O)).filter(j(F)),o=n.filter(j(O)).filter(B),a=r.filter(j(O)).filter(F),s=t.contexts.concat(r.filter(O)).filter(T),c=t.children.filter(M).filter(E),l=t.contexts.filter(A);e.concat(i).concat(o).concat(a).concat(s).concat(c).concat(l).forEach(function(t){this.renderQueue.push(t), q(t)&&(this.parse(t), this.renderQueue.push(new w));},this);}, i.prototype.paint=function(t){try{t instanceof w?this.renderer.ctx.restore():M(t)?(D(t.parent)&&t.parent.appendToDOM(), this.paintText(t), D(t.parent)&&t.parent.cleanDOM()):this.paintNode(t);}catch(t){if(s(t), this.options.strict)throw t}}, i.prototype.paintNode=function(t){q(t)&&(this.renderer.setOpacity(t.opacity), this.renderer.ctx.save(), t.hasTransform()&&this.renderer.setTransform(t.parseTransform())), "INPUT"===t.node.nodeName&&"checkbox"===t.node.type?this.paintCheckbox(t):"INPUT"===t.node.nodeName&&"radio"===t.node.type?this.paintRadio(t):this.paintElement(t);}, i.prototype.paintElement=function(n){var r=n.parseBounds();this.renderer.clip(n.backgroundClip,function(){this.renderer.renderBackground(n,r,n.borders.borders.map(N));},this), this.renderer.clip(n.clip,function(){this.renderer.renderBorders(n.borders.borders);},this), this.renderer.clip(n.backgroundClip,function(){switch(n.node.nodeName){case"svg":case"IFRAME":var t=this.images.get(n.node);t?this.renderer.renderImage(n,r,n.borders,t):s("Error loading <"+n.node.nodeName+">",n.node);break;case"IMG":var e=this.images.get(n.node.src);e?this.renderer.renderImage(n,r,n.borders,e):s("Error loading <img>",n.node.src);break;case"CANVAS":this.renderer.renderImage(n,r,n.borders,{image:n.node});break;case"SELECT":case"INPUT":case"TEXTAREA":this.paintFormValue(n);}},this);}, i.prototype.paintCheckbox=function(t){var e=t.parseBounds(),n=Math.min(e.width,e.height),r={width:n-1,height:n-1,top:e.top,left:e.left},i=[3,3],o=[i,i,i,i],a=[1,1,1,1].map(function(t){return{color:new u("#A5A5A5"),width:t}}),s=S(r,o,a);this.renderer.clip(t.backgroundClip,function(){this.renderer.rectangle(r.left+1,r.top+1,r.width-2,r.height-2,new u("#DEDEDE")), this.renderer.renderBorders(b(a,r,s,o)), t.node.checked&&(this.renderer.font(new u("#424242"),"normal","normal","bold",n-3+"px","arial"), this.renderer.text("✔",r.left+n/6,r.top+n-1));},this);}, i.prototype.paintRadio=function(t){var e=t.parseBounds(),n=Math.min(e.width,e.height)-2;this.renderer.clip(t.backgroundClip,function(){this.renderer.circleStroke(e.left+1,e.top+1,n,new u("#DEDEDE"),1,new u("#A5A5A5")), t.node.checked&&this.renderer.circle(Math.ceil(e.left+n/4)+1,Math.ceil(e.top+n/4)+1,Math.floor(n/2),new u("#424242"));},this);}, i.prototype.paintFormValue=function(e){var t=e.getValue();if(0<t.length){var n=e.node.ownerDocument,r=n.createElement("html2canvaswrapper");["lineHeight","textAlign","fontFamily","fontWeight","fontSize","color","paddingLeft","paddingTop","paddingRight","paddingBottom","width","height","borderLeftStyle","borderTopStyle","borderLeftWidth","borderTopWidth","boxSizing","whiteSpace","wordWrap"].forEach(function(t){try{r.style[t]=e.css(t);}catch(t){s("html2canvas: Parse: Exception caught in renderFormValue: "+t.message);}});var i=e.parseBounds();r.style.position="fixed", r.style.left=i.left+"px", r.style.top=i.top+"px", r.textContent=t, n.body.appendChild(r), this.paintText(new f(r.firstChild,e)), n.body.removeChild(r);}}, i.prototype.paintText=function(n){n.applyTextTransform();var t,e=c.ucs2.decode(n.node.data),r=this.options.letterRendering&&!/^(normal|none|0px)$/.test(n.parent.css("letterSpacing"))||(t=n.node.data, /[^\u0000-\u00ff]/.test(t))?e.map(function(t){return c.ucs2.encode([t])}):function(t){var e,n=[],r=0,i=!1;for(;t.length;)o=t[r], -1!==[32,13,10,9,45].indexOf(o)===i?((e=t.splice(0,r)).length&&n.push(c.ucs2.encode(e)), i=!i, r=0):r++, r>=t.length&&(e=t.splice(0,r)).length&&n.push(c.ucs2.encode(e));var o;return n}(e),i=n.parent.fontWeight(),o=n.parent.css("fontSize"),a=n.parent.css("fontFamily"),s=n.parent.parseTextShadows();this.renderer.font(n.parent.color("color"),n.parent.css("fontStyle"),n.parent.css("fontVariant"),i,o,a), s.length?this.renderer.fontShadow(s[0].color,s[0].offsetX,s[0].offsetY,s[0].blur):this.renderer.clearShadow(), this.renderer.clip(n.parent.clip,function(){r.map(this.parseTextBounds(n),this).forEach(function(t,e){t&&(this.renderer.text(r[e],t.left,t.bottom), this.renderTextDecoration(n.parent,t,this.fontMetrics.getMetrics(a,o)));},this);},this);}, i.prototype.renderTextDecoration=function(t,e,n){switch(t.css("textDecoration").split(" ")[0]){case"underline":this.renderer.rectangle(e.left,Math.round(e.top+n.baseline+n.lineWidth),e.width,1,t.color("color"));break;case"overline":this.renderer.rectangle(e.left,Math.round(e.top),e.width,1,t.color("color"));break;case"line-through":this.renderer.rectangle(e.left,Math.ceil(e.top+n.middle+n.lineWidth),e.width,1,t.color("color"));}};var v={inset:[["darken",.6],["darken",.1],["darken",.1],["darken",.6]]};function b(a,s,c,l){return a.map(function(t,e){if(0<t.width){var n=s.left,r=s.top,i=s.width,o=s.height-a[2].width;switch(e){case 0:o=a[0].width, t.args=_({c1:[n,r],c2:[n+i,r],c3:[n+i-a[1].width,r+o],c4:[n+a[3].width,r+o]},l[0],l[1],c.topLeftOuter,c.topLeftInner,c.topRightOuter,c.topRightInner);break;case 1:n=s.left+s.width-a[1].width, i=a[1].width, t.args=_({c1:[n+i,r],c2:[n+i,r+o+a[2].width],c3:[n,r+o],c4:[n,r+a[0].width]},l[1],l[2],c.topRightOuter,c.topRightInner,c.bottomRightOuter,c.bottomRightInner);break;case 2:r=r+s.height-a[2].width, o=a[2].width, t.args=_({c1:[n+i,r+o],c2:[n,r+o],c3:[n+a[3].width,r],c4:[n+i-a[3].width,r]},l[2],l[3],c.bottomRightOuter,c.bottomRightInner,c.bottomLeftOuter,c.bottomLeftInner);break;case 3:i=a[3].width, t.args=_({c1:[n,r+o+a[2].width],c2:[n,r],c3:[n+i,r+a[0].width],c4:[n+i,r+o]},l[3],l[0],c.bottomLeftOuter,c.bottomLeftInner,c.topLeftOuter,c.topLeftInner);}}return t})}function x(t,e,n,r){var i=(Math.sqrt(2)-1)/3*4,o=n*i,a=r*i,s=t+n,c=e+r;return{topLeft:k({x:t,y:c},{x:t,y:c-a},{x:s-o,y:e},{x:s,y:e}),topRight:k({x:t,y:e},{x:t+o,y:e},{x:s,y:c-a},{x:s,y:c}),bottomRight:k({x:s,y:e},{x:s,y:e+a},{x:t+o,y:c},{x:t,y:c}),bottomLeft:k({x:s,y:c},{x:s-o,y:c},{x:t,y:e+a},{x:t,y:e})}}function S(t,e,n){var r=t.left,i=t.top,o=t.width,a=t.height,s=e[0][0]<o/2?e[0][0]:o/2,c=e[0][1]<a/2?e[0][1]:a/2,l=e[1][0]<o/2?e[1][0]:o/2,h=e[1][1]<a/2?e[1][1]:a/2,u=e[2][0]<o/2?e[2][0]:o/2,f=e[2][1]<a/2?e[2][1]:a/2,d=e[3][0]<o/2?e[3][0]:o/2,p=e[3][1]<a/2?e[3][1]:a/2,g=o-l,m=a-f,y=o-u,w=a-p;return{topLeftOuter:x(r,i,s,c).topLeft.subdivide(.5),topLeftInner:x(r+n[3].width,i+n[0].width,Math.max(0,s-n[3].width),Math.max(0,c-n[0].width)).topLeft.subdivide(.5),topRightOuter:x(r+g,i,l,h).topRight.subdivide(.5),topRightInner:x(r+Math.min(g,o+n[3].width),i+n[0].width,g>o+n[3].width?0:l-n[3].width,h-n[0].width).topRight.subdivide(.5),bottomRightOuter:x(r+y,i+m,u,f).bottomRight.subdivide(.5),bottomRightInner:x(r+Math.min(y,o-n[3].width),i+Math.min(m,a+n[0].width),Math.max(0,u-n[1].width),f-n[2].width).bottomRight.subdivide(.5),bottomLeftOuter:x(r,i+w,d,p).bottomLeft.subdivide(.5),bottomLeftInner:x(r+n[3].width,i+w,Math.max(0,d-n[3].width),p-n[2].width).bottomLeft.subdivide(.5)}}function k(s,c,l,h){var u=function(t,e,n){return{x:t.x+(e.x-t.x)*n,y:t.y+(e.y-t.y)*n}};return{start:s,startControl:c,endControl:l,end:h,subdivide:function(t){var e=u(s,c,t),n=u(c,l,t),r=u(l,h,t),i=u(e,n,t),o=u(n,r,t),a=u(i,o,t);return[k(s,e,i,a),k(a,o,r,h)]},curveTo:function(t){t.push(["bezierCurve",c.x,c.y,l.x,l.y,h.x,h.y]);},curveToReversed:function(t){t.push(["bezierCurve",l.x,l.y,c.x,c.y,s.x,s.y]);}}}function _(t,e,n,r,i,o,a){var s=[];return 0<e[0]||0<e[1]?(s.push(["line",r[1].start.x,r[1].start.y]), r[1].curveTo(s)):s.push(["line",t.c1[0],t.c1[1]]), 0<n[0]||0<n[1]?(s.push(["line",o[0].start.x,o[0].start.y]), o[0].curveTo(s), s.push(["line",a[0].end.x,a[0].end.y]), a[0].curveToReversed(s)):(s.push(["line",t.c2[0],t.c2[1]]), s.push(["line",t.c3[0],t.c3[1]])), 0<e[0]||0<e[1]?(s.push(["line",i[1].end.x,i[1].end.y]), i[1].curveToReversed(s)):s.push(["line",t.c4[0],t.c4[1]]), s}function C(t,e,n,r,i,o,a){0<e[0]||0<e[1]?(t.push(["line",r[0].start.x,r[0].start.y]), r[0].curveTo(t), r[1].curveTo(t)):t.push(["line",o,a]), (0<n[0]||0<n[1])&&t.push(["line",i[0].start.x,i[0].start.y]);}function I(t){return t.cssInt("zIndex")<0}function A(t){return 0<t.cssInt("zIndex")}function T(t){return 0===t.cssInt("zIndex")}function F(t){return-1!==["inline","inline-block","inline-table"].indexOf(t.css("display"))}function q(t){return t instanceof p}function E(t){return 0<t.node.data.trim().length}function P(t){return t.nodeType===Node.TEXT_NODE||t.nodeType===Node.ELEMENT_NODE}function O(t){return"static"!==t.css("position")}function B(t){return"none"!==t.css("float")}function j(t){var e=this;return function(){return!t.apply(e,arguments)}}function R(t){return t.node.nodeType===Node.ELEMENT_NODE}function D(t){return!0===t.isPseudoElement}function M(t){return t.node.nodeType===Node.TEXT_NODE}function z(t){return parseInt(t,10)}function N(t){return t.width}function L(t){return t.node.nodeType!==Node.ELEMENT_NODE||-1===["SCRIPT","HEAD","TITLE","OBJECT","BR","OPTION"].indexOf(t.node.nodeName)}function U(t){return[].concat.apply([],t)}i.prototype.parseBorders=function(o){var r,t=o.parseBounds(),e=(r=o, ["TopLeft","TopRight","BottomRight","BottomLeft"].map(function(t){var e=r.css("border"+t+"Radius"),n=e.split(" ");return n.length<=1&&(n[1]=n[0]), n.map(z)})),n=["Top","Right","Bottom","Left"].map(function(t,e){var n=o.css("border"+t+"Style"),r=o.color("border"+t+"Color");"inset"===n&&r.isBlack()&&(r=new u([255,255,255,r.a]));var i=v[n]?v[n][e]:null;return{width:o.cssInt("border"+t+"Width"),color:i?r[i[0]](i[1]):r,args:null}}),i=S(t,e,n);return{clip:this.parseBackgroundClip(o,i,n,e,t),borders:b(n,t,i,e)}}, i.prototype.parseBackgroundClip=function(t,e,n,r,i){var o=[];switch(t.css("backgroundClip")){case"content-box":case"padding-box":C(o,r[0],r[1],e.topLeftInner,e.topRightInner,i.left+n[3].width,i.top+n[0].width), C(o,r[1],r[2],e.topRightInner,e.bottomRightInner,i.left+i.width-n[1].width,i.top+n[0].width), C(o,r[2],r[3],e.bottomRightInner,e.bottomLeftInner,i.left+i.width-n[1].width,i.top+i.height-n[2].width), C(o,r[3],r[0],e.bottomLeftInner,e.topLeftInner,i.left+n[3].width,i.top+i.height-n[2].width);break;default:C(o,r[0],r[1],e.topLeftOuter,e.topRightOuter,i.left,i.top), C(o,r[1],r[2],e.topRightOuter,e.bottomRightOuter,i.left+i.width,i.top), C(o,r[2],r[3],e.bottomRightOuter,e.bottomLeftOuter,i.left+i.width,i.top+i.height), C(o,r[3],r[0],e.bottomLeftOuter,e.topLeftOuter,i.left,i.top+i.height);}return o}, e.exports=i;},{"./color":3,"./fontmetrics":7,"./log":13,"./nodecontainer":14,"./pseudoelementcontainer":18,"./stackingcontext":21,"./textcontainer":25,"./utils":26,punycode:1}],16:[function(t,e,n){var a=t("./xhr"),r=t("./utils"),s=t("./log"),c=t("./clone"),l=r.decode64;function h(t,e,n){var r="withCredentials"in new XMLHttpRequest;if(!e)return Promise.reject("No proxy configured");var i=f(r),o=d(e,t,i);return r?a(o):u(n,o,i).then(function(t){return l(t.content)})}var i=0;function u(i,o,a){return new Promise(function(e,n){var t=i.createElement("script"),r=function(){delete window.html2canvas.proxy[a], i.body.removeChild(t);};window.html2canvas.proxy[a]=function(t){r(), e(t);}, t.src=o, t.onerror=function(t){r(), n(t);}, i.body.appendChild(t);})}function f(t){return t?"":"html2canvas_"+Date.now()+"_"+ ++i+"_"+Math.round(1e5*Math.random())}function d(t,e,n){return t+"?url="+encodeURIComponent(e)+(n.length?"&callback=html2canvas.proxy."+n:"")}n.Proxy=h, n.ProxyURL=function(t,e,n){var r="crossOrigin"in new Image,i=f(r),o=d(e,t,i);return r?Promise.resolve(o):u(n,o,i).then(function(t){return"data:"+t.type+";base64,"+t.content})}, n.loadUrlDocument=function(t,e,n,r,i,o){return new h(t,e,window.document).then((a=t, function(e){var n,t=new DOMParser;try{n=t.parseFromString(e,"text/html");}catch(t){s("DOMParser not supported, falling back to createHTMLDocument"), n=document.implementation.createHTMLDocument("");try{n.open(), n.write(e), n.close();}catch(t){s("createHTMLDocument write not supported, falling back to document.body.innerHTML"), n.body.innerHTML=e;}}var r=n.querySelector("base");if(!r||!r.href.host){var i=n.createElement("base");i.href=a, n.head.insertBefore(i,n.head.firstChild);}return n})).then(function(t){return c(t,n,r,i,o,0,0)});var a;};},{"./clone":2,"./log":13,"./utils":26,"./xhr":28}],17:[function(t,e,n){var o=t("./proxy").ProxyURL;e.exports=function(n,r){var t=document.createElement("a");t.href=n, n=t.href, this.src=n, this.image=new Image;var i=this;this.promise=new Promise(function(t,e){i.image.crossOrigin="Anonymous", i.image.onload=t, i.image.onerror=e, new o(n,r,document).then(function(t){i.image.src=t;}).catch(e);});};},{"./proxy":16}],18:[function(t,e,n){var r=t("./nodecontainer");function i(t,e,n){r.call(this,t,e), this.isPseudoElement=!0, this.before=":before"===n;}i.prototype.cloneTo=function(t){i.prototype.cloneTo.call(this,t), t.isPseudoElement=!0, t.before=this.before;}, (i.prototype=Object.create(r.prototype)).appendToDOM=function(){this.before?this.parent.node.insertBefore(this.node,this.parent.node.firstChild):this.parent.node.appendChild(this.node), this.parent.node.className+=" "+this.getHideClass();}, i.prototype.cleanDOM=function(){this.node.parentNode.removeChild(this.node), this.parent.node.className=this.parent.node.className.replace(this.getHideClass(),"");}, i.prototype.getHideClass=function(){return this["PSEUDO_HIDE_ELEMENT_CLASS_"+(this.before?"BEFORE":"AFTER")]}, i.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE="___html2canvas___pseudoelement_before", i.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER="___html2canvas___pseudoelement_after", e.exports=i;},{"./nodecontainer":14}],19:[function(t,e,n){var c=t("./log");function r(t,e,n,r,i){this.width=t, this.height=e, this.images=n, this.options=r, this.document=i;}r.prototype.renderImage=function(t,e,n,r){var i=t.cssInt("paddingLeft"),o=t.cssInt("paddingTop"),a=t.cssInt("paddingRight"),s=t.cssInt("paddingBottom"),c=n.borders,l=e.width-(c[1].width+c[3].width+i+a),h=e.height-(c[0].width+c[2].width+o+s);this.drawImage(r,0,0,r.image.width||l,r.image.height||h,e.left+i+c[3].width,e.top+o+c[0].width,l,h);}, r.prototype.renderBackground=function(t,e,n){0<e.height&&0<e.width&&(this.renderBackgroundColor(t,e), this.renderBackgroundImage(t,e,n));}, r.prototype.renderBackgroundColor=function(t,e){var n=t.color("backgroundColor");n.isTransparent()||this.rectangle(e.left,e.top,e.width,e.height,n);}, r.prototype.renderBorders=function(t){t.forEach(this.renderBorder,this);}, r.prototype.renderBorder=function(t){t.color.isTransparent()||null===t.args||this.drawShape(t.args,t.color);}, r.prototype.renderBackgroundImage=function(o,a,s){o.parseBackgroundImages().reverse().forEach(function(t,e,n){switch(t.method){case"url":var r=this.images.get(t.args[0]);r?this.renderBackgroundRepeating(o,a,r,n.length-(e+1),s):c("Error loading background-image",t.args[0]);break;case"linear-gradient":case"gradient":var i=this.images.get(t.value);i?this.renderBackgroundGradient(i,a,s):c("Error loading background-image",t.args[0]);break;case"none":break;default:c("Unknown background-image type",t.args[0]);}},this);}, r.prototype.renderBackgroundRepeating=function(t,e,n,r,i){var o=t.parseBackgroundSize(e,n.image,r),a=t.parseBackgroundPosition(e,n.image,r,o);switch(t.parseBackgroundRepeat(r)){case"repeat-x":case"repeat no-repeat":this.backgroundRepeatShape(n,a,o,e,e.left+i[3],e.top+a.top+i[0],99999,o.height,i);break;case"repeat-y":case"no-repeat repeat":this.backgroundRepeatShape(n,a,o,e,e.left+a.left+i[3],e.top+i[0],o.width,99999,i);break;case"no-repeat":this.backgroundRepeatShape(n,a,o,e,e.left+a.left+i[3],e.top+a.top+i[0],o.width,o.height,i);break;default:this.renderBackgroundRepeat(n,a,o,{top:e.top,left:e.left},i[3],i[0]);}}, e.exports=r;},{"./log":13}],20:[function(t,e,n){var r=t("../renderer"),i=t("../lineargradientcontainer"),o=t("../log");function a(t,e){r.apply(this,arguments), this.canvas=this.options.canvas||this.document.createElement("canvas"), this.options.canvas||(this.canvas.width=t, this.canvas.height=e), this.ctx=this.canvas.getContext("2d"), this.taintCtx=this.document.createElement("canvas").getContext("2d"), this.ctx.textBaseline="bottom", this.variables={}, o("Initialized CanvasRenderer with size",t,"x",e);}function s(t){return 0<t.length}(a.prototype=Object.create(r.prototype)).setFillStyle=function(t){return this.ctx.fillStyle="object"==typeof t&&t.isColor?t.toString():t, this.ctx}, a.prototype.rectangle=function(t,e,n,r,i){this.setFillStyle(i).fillRect(t,e,n,r);}, a.prototype.circle=function(t,e,n,r){this.setFillStyle(r), this.ctx.beginPath(), this.ctx.arc(t+n/2,e+n/2,n/2,0,2*Math.PI,!0), this.ctx.closePath(), this.ctx.fill();}, a.prototype.circleStroke=function(t,e,n,r,i,o){this.circle(t,e,n,r), this.ctx.strokeStyle=o.toString(), this.ctx.stroke();}, a.prototype.drawShape=function(t,e){this.shape(t), this.setFillStyle(e).fill();}, a.prototype.taints=function(e){if(null===e.tainted){this.taintCtx.drawImage(e.image,0,0);try{this.taintCtx.getImageData(0,0,1,1), e.tainted=!1;}catch(t){this.taintCtx=document.createElement("canvas").getContext("2d"), e.tainted=!0;}}return e.tainted}, a.prototype.drawImage=function(t,e,n,r,i,o,a,s,c){this.taints(t)&&!this.options.allowTaint||this.ctx.drawImage(t.image,e,n,r,i,o,a,s,c);}, a.prototype.clip=function(t,e,n){this.ctx.save(), t.filter(s).forEach(function(t){this.shape(t).clip();},this), e.call(n), this.ctx.restore();}, a.prototype.shape=function(t){return this.ctx.beginPath(), t.forEach(function(t,e){"rect"===t[0]?this.ctx.rect.apply(this.ctx,t.slice(1)):this.ctx[0===e?"moveTo":t[0]+"To"].apply(this.ctx,t.slice(1));},this), this.ctx.closePath(), this.ctx}, a.prototype.font=function(t,e,n,r,i,o){this.setFillStyle(t).font=[e,n,r,i,o].join(" ").split(",")[0];}, a.prototype.fontShadow=function(t,e,n,r){this.setVariable("shadowColor",t.toString()).setVariable("shadowOffsetY",e).setVariable("shadowOffsetX",n).setVariable("shadowBlur",r);}, a.prototype.clearShadow=function(){this.setVariable("shadowColor","rgba(0,0,0,0)");}, a.prototype.setOpacity=function(t){this.ctx.globalAlpha=t;}, a.prototype.setTransform=function(t){this.ctx.translate(t.origin[0],t.origin[1]), this.ctx.transform.apply(this.ctx,t.matrix), this.ctx.translate(-t.origin[0],-t.origin[1]);}, a.prototype.setVariable=function(t,e){return this.variables[t]!==e&&(this.variables[t]=this.ctx[t]=e), this}, a.prototype.text=function(t,e,n){this.ctx.fillText(t,e,n);}, a.prototype.backgroundRepeatShape=function(t,e,n,r,i,o,a,s,c){var l=[["line",Math.round(i),Math.round(o)],["line",Math.round(i+a),Math.round(o)],["line",Math.round(i+a),Math.round(s+o)],["line",Math.round(i),Math.round(s+o)]];this.clip([l],function(){this.renderBackgroundRepeat(t,e,n,r,c[3],c[0]);},this);}, a.prototype.renderBackgroundRepeat=function(t,e,n,r,i,o){var a=Math.round(r.left+e.left+i),s=Math.round(r.top+e.top+o);this.setFillStyle(this.ctx.createPattern(this.resizeImage(t,n),"repeat")), this.ctx.translate(a,s), this.ctx.fill(), this.ctx.translate(-a,-s);}, a.prototype.renderBackgroundGradient=function(t,e){if(t instanceof i){var n=this.ctx.createLinearGradient(e.left+e.width*t.x0,e.top+e.height*t.y0,e.left+e.width*t.x1,e.top+e.height*t.y1);t.colorStops.forEach(function(t){n.addColorStop(t.stop,t.color.toString());}), this.rectangle(e.left,e.top,e.width,e.height,n);}}, a.prototype.resizeImage=function(t,e){var n=t.image;if(n.width===e.width&&n.height===e.height)return n;var r=document.createElement("canvas");return r.width=e.width, r.height=e.height, r.getContext("2d").drawImage(n,0,0,n.width,n.height,0,0,e.width,e.height), r}, e.exports=a;},{"../lineargradientcontainer":12,"../log":13,"../renderer":19}],21:[function(t,e,n){var i=t("./nodecontainer");function r(t,e,n,r){i.call(this,n,r), this.ownStacking=t, this.contexts=[], this.children=[], this.opacity=(this.parent?this.parent.stack.opacity:1)*e;}(r.prototype=Object.create(i.prototype)).getParentStack=function(t){var e=this.parent?this.parent.stack:null;return e?e.ownStacking?e:e.getParentStack(t):t.stack}, e.exports=r;},{"./nodecontainer":14}],22:[function(t,e,n){function r(t){this.rangeBounds=this.testRangeBounds(t), this.cors=this.testCORS(), this.svg=this.testSVG();}r.prototype.testRangeBounds=function(t){var e,n,r=!1;return t.createRange&&(e=t.createRange()).getBoundingClientRect&&((n=t.createElement("boundtest")).style.height="123px", n.style.display="block", t.body.appendChild(n), e.selectNode(n), 123===e.getBoundingClientRect().height&&(r=!0), t.body.removeChild(n)), r}, r.prototype.testCORS=function(){return void 0!==(new Image).crossOrigin}, r.prototype.testSVG=function(){var t=new Image,e=document.createElement("canvas"),n=e.getContext("2d");t.src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>";try{n.drawImage(t,0,0), e.toDataURL();}catch(t){return!1}return!0}, e.exports=r;},{}],23:[function(t,e,n){var r=t("./xhr"),i=t("./utils").decode64;function o(t){this.src=t, this.image=null;var n=this;this.promise=this.hasFabric().then(function(){return n.isInline(t)?Promise.resolve(n.inlineFormatting(t)):r(t)}).then(function(e){return new Promise(function(t){window.html2canvas.svg.fabric.loadSVGFromString(e,n.createCanvas.call(n,t));})});}o.prototype.hasFabric=function(){return window.html2canvas.svg&&window.html2canvas.svg.fabric?Promise.resolve():Promise.reject(new Error("html2canvas.svg.js is not loaded, cannot render svg"))}, o.prototype.inlineFormatting=function(t){return/^data:image\/svg\+xml;base64,/.test(t)?this.decode64(this.removeContentType(t)):this.removeContentType(t)}, o.prototype.removeContentType=function(t){return t.replace(/^data:image\/svg\+xml(;base64)?,/,"")}, o.prototype.isInline=function(t){return/^data:image\/svg\+xml/i.test(t)}, o.prototype.createCanvas=function(r){var i=this;return function(t,e){var n=new window.html2canvas.svg.fabric.StaticCanvas("c");i.image=n.lowerCanvasEl, n.setWidth(e.width).setHeight(e.height).add(window.html2canvas.svg.fabric.util.groupSVGElements(t,e)).renderAll(), r(n.lowerCanvasEl);}}, o.prototype.decode64=function(t){return"function"==typeof window.atob?window.atob(t):i(t)}, e.exports=o;},{"./utils":26,"./xhr":28}],24:[function(t,e,n){var r=t("./svgcontainer");function i(n,t){this.src=n, this.image=null;var r=this;this.promise=t?new Promise(function(t,e){r.image=new Image, r.image.onload=t, r.image.onerror=e, r.image.src="data:image/svg+xml,"+(new XMLSerializer).serializeToString(n), !0===r.image.complete&&t(r.image);}):this.hasFabric().then(function(){return new Promise(function(t){window.html2canvas.svg.fabric.parseSVGDocument(n,r.createCanvas.call(r,t));})});}i.prototype=Object.create(r.prototype), e.exports=i;},{"./svgcontainer":23}],25:[function(t,e,n){var r=t("./nodecontainer");function i(t,e){r.call(this,t,e);}function o(t,e,n){if(0<t.length)return e+n.toUpperCase()}(i.prototype=Object.create(r.prototype)).applyTextTransform=function(){this.node.data=this.transform(this.parent.css("textTransform"));}, i.prototype.transform=function(t){var e=this.node.data;switch(t){case"lowercase":return e.toLowerCase();case"capitalize":return e.replace(/(^|\s|:|-|\(|\))([a-z])/g,o);case"uppercase":return e.toUpperCase();default:return e}}, e.exports=i;},{"./nodecontainer":14}],26:[function(t,e,n){n.smallImage=function(){return"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"}, n.bind=function(t,e){return function(){return t.apply(e,arguments)}}, n.decode64=function(t){var e,n,r,i,o,a,s,c="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",l=t.length,h="";for(e=0;e<l;e+=4)o=c.indexOf(t[e])<<2|(n=c.indexOf(t[e+1]))>>4, a=(15&n)<<4|(r=c.indexOf(t[e+2]))>>2, s=(3&r)<<6|(i=c.indexOf(t[e+3])), h+=64===r?String.fromCharCode(o):64===i||-1===i?String.fromCharCode(o,a):String.fromCharCode(o,a,s);return h}, n.getBounds=function(t){if(t.getBoundingClientRect){var e=t.getBoundingClientRect(),n=null==t.offsetWidth?e.width:t.offsetWidth;return{top:e.top,bottom:e.bottom||e.top+e.height,right:e.left+n,left:e.left,width:n,height:null==t.offsetHeight?e.height:t.offsetHeight}}return{}}, n.offsetBounds=function(t){var e=t.offsetParent?n.offsetBounds(t.offsetParent):{top:0,left:0};return{top:t.offsetTop+e.top,bottom:t.offsetTop+t.offsetHeight+e.top,right:t.offsetLeft+e.left+t.offsetWidth,left:t.offsetLeft+e.left,width:t.offsetWidth,height:t.offsetHeight}}, n.parseBackgrounds=function(t){var e,n,r,i,o,a,s,c=[],l=0,h=0,u=function(){e&&('"'===n.substr(0,1)&&(n=n.substr(1,n.length-2)), n&&s.push(n), "-"===e.substr(0,1)&&0<(i=e.indexOf("-",1)+1)&&(r=e.substr(0,i), e=e.substr(i)), c.push({prefix:r,method:e.toLowerCase(),value:o,args:s,image:null})), s=[], e=r=n=o="";};return s=[], e=r=n=o="", t.split("").forEach(function(t){if(!(0===l&&-1<" \r\n\t".indexOf(t))){switch(t){case'"':a?a===t&&(a=null):a=t;break;case"(":if(a)break;if(0===l)return l=1, void(o+=t);h++;break;case")":if(a)break;if(1===l){if(0===h)return l=0, o+=t, void u();h--;}break;case",":if(a)break;if(0===l)return void u();if(1===l&&0===h&&!e.match(/^url$/i))return s.push(n), n="", void(o+=t)}o+=t, 0===l?e+=t:n+=t;}}), u(), c};},{}],27:[function(t,e,n){var r=t("./gradientcontainer");function i(t){r.apply(this,arguments), this.type="linear"===t.args[0]?r.TYPES.LINEAR:r.TYPES.RADIAL;}i.prototype=Object.create(r.prototype), e.exports=i;},{"./gradientcontainer":9}],28:[function(t,e,n){e.exports=function(r){return new Promise(function(t,e){var n=new XMLHttpRequest;n.open("GET",r), n.onload=function(){200===n.status?t(n.responseText):e(new Error(n.statusText));}, n.onerror=function(){e(new Error("Network Error"));}, n.send();})};},{}]},{},[4])(4)}), function(t){var n="+".charCodeAt(0),r="/".charCodeAt(0),i="0".charCodeAt(0),o="a".charCodeAt(0),a="A".charCodeAt(0),s="-".charCodeAt(0),c="_".charCodeAt(0),h=function(t){var e=t.charCodeAt(0);return e===n||e===s?62:e===r||e===c?63:e<i?-1:e<i+10?e-i+26+26:e<a+26?e-a:e<o+26?e-o+26:void 0};t.API.TTFFont=function(){function i(t,e,n){var r;if(this.rawData=t, r=this.contents=new X(t), this.contents.pos=4, "ttcf"===r.readString(4)){if(!e)throw new Error("Must specify a font name for TTC files.");throw new Error("Font "+e+" not found in TTC file.")}r.pos=0, this.parse(), this.subset=new T(this), this.registerTTF();}return i.open=function(t,e,n,r){return new i(function(t){var e,n,r,i,o,a;if(0<t.length%4)throw new Error("Invalid string. Length must be a multiple of 4");var s=t.length;o="="===t.charAt(s-2)?2:"="===t.charAt(s-1)?1:0, a=new Uint8Array(3*t.length/4-o), r=0<o?t.length-4:t.length;var c=0;function l(t){a[c++]=t;}for(n=e=0;e<r;e+=4, n+=3)l((16711680&(i=h(t.charAt(e))<<18|h(t.charAt(e+1))<<12|h(t.charAt(e+2))<<6|h(t.charAt(e+3))))>>16), l((65280&i)>>8), l(255&i);return 2===o?l(255&(i=h(t.charAt(e))<<2|h(t.charAt(e+1))>>4)):1===o&&(l((i=h(t.charAt(e))<<10|h(t.charAt(e+1))<<4|h(t.charAt(e+2))>>2)>>8&255), l(255&i)), a}(n),e,r)}, i.prototype.parse=function(){return this.directory=new e(this.contents), this.head=new d(this), this.name=new b(this), this.cmap=new m(this), this.hhea=new g(this), this.maxp=new x(this), this.hmtx=new S(this), this.post=new w(this), this.os2=new y(this), this.loca=new A(this), this.glyf=new _(this), this.ascender=this.os2.exists&&this.os2.ascender||this.hhea.ascender, this.decender=this.os2.exists&&this.os2.decender||this.hhea.decender, this.lineGap=this.os2.exists&&this.os2.lineGap||this.hhea.lineGap, this.bbox=[this.head.xMin,this.head.yMin,this.head.xMax,this.head.yMax]}, i.prototype.registerTTF=function(){var i,t,e,n,r;if(this.scaleFactor=1e3/this.head.unitsPerEm, this.bbox=function(){var t,e,n,r;for(r=[], t=0, e=(n=this.bbox).length;t<e;t++)i=n[t], r.push(Math.round(i*this.scaleFactor));return r}.call(this), this.stemV=0, this.post.exists?(e=255&(n=this.post.italic_angle), !0&(t=n>>16)&&(t=-(1+(65535^t))), this.italicAngle=+(t+"."+e)):this.italicAngle=0, this.ascender=Math.round(this.ascender*this.scaleFactor), this.decender=Math.round(this.decender*this.scaleFactor), this.lineGap=Math.round(this.lineGap*this.scaleFactor), this.capHeight=this.os2.exists&&this.os2.capHeight||this.ascender, this.xHeight=this.os2.exists&&this.os2.xHeight||0, this.familyClass=(this.os2.exists&&this.os2.familyClass||0)>>8, this.isSerif=1===(r=this.familyClass)||2===r||3===r||4===r||5===r||7===r, this.isScript=10===this.familyClass, this.flags=0, this.post.isFixedPitch&&(this.flags|=1), this.isSerif&&(this.flags|=2), this.isScript&&(this.flags|=8), 0!==this.italicAngle&&(this.flags|=64), this.flags|=32, !this.cmap.unicode)throw new Error("No unicode cmap for font")}, i.prototype.characterToGlyph=function(t){var e;return(null!=(e=this.cmap.unicode)?e.codeMap[t]:void 0)||0}, i.prototype.widthOfGlyph=function(t){var e;return e=1e3/this.head.unitsPerEm, this.hmtx.forGlyph(t).advance*e}, i.prototype.widthOfString=function(t,e,n){var r,i,o,a,s;for(i=a=o=0, s=(t=""+t).length;0<=s?a<s:s<a;i=0<=s?++a:--a)r=t.charCodeAt(i), o+=this.widthOfGlyph(this.characterToGlyph(r))+n*(1e3/e)||0;return o*(e/1e3)}, i.prototype.lineHeight=function(t,e){var n;return null==e&&(e=!1), n=e?this.lineGap:0, (this.ascender+n-this.decender)/1e3*t}, i}();var l,X=function(){function t(t){this.data=null!=t?t:[], this.pos=0, this.length=this.data.length;}return t.prototype.readByte=function(){return this.data[this.pos++]}, t.prototype.writeByte=function(t){return this.data[this.pos++]=t}, t.prototype.readUInt32=function(){return 16777216*this.readByte()+(this.readByte()<<16)+(this.readByte()<<8)+this.readByte()}, t.prototype.writeUInt32=function(t){return this.writeByte(t>>>24&255), this.writeByte(t>>16&255), this.writeByte(t>>8&255), this.writeByte(255&t)}, t.prototype.readInt32=function(){var t;return 2147483648<=(t=this.readUInt32())?t-4294967296:t}, t.prototype.writeInt32=function(t){return t<0&&(t+=4294967296), this.writeUInt32(t)}, t.prototype.readUInt16=function(){return this.readByte()<<8|this.readByte()}, t.prototype.writeUInt16=function(t){return this.writeByte(t>>8&255), this.writeByte(255&t)}, t.prototype.readInt16=function(){var t;return 32768<=(t=this.readUInt16())?t-65536:t}, t.prototype.writeInt16=function(t){return t<0&&(t+=65536), this.writeUInt16(t)}, t.prototype.readString=function(t){var e,n,r;for(n=[], e=r=0;0<=t?r<t:t<r;e=0<=t?++r:--r)n[e]=String.fromCharCode(this.readByte());return n.join("")}, t.prototype.writeString=function(t){var e,n,r,i;for(i=[], e=n=0, r=t.length;0<=r?n<r:r<n;e=0<=r?++n:--n)i.push(this.writeByte(t.charCodeAt(e)));return i}, t.prototype.readShort=function(){return this.readInt16()}, t.prototype.writeShort=function(t){return this.writeInt16(t)}, t.prototype.readLongLong=function(){var t,e,n,r,i,o,a,s;return t=this.readByte(), e=this.readByte(), n=this.readByte(), r=this.readByte(), i=this.readByte(), o=this.readByte(), a=this.readByte(), s=this.readByte(), 128&t?-1*(72057594037927940*(255^t)+281474976710656*(255^e)+1099511627776*(255^n)+4294967296*(255^r)+16777216*(255^i)+65536*(255^o)+256*(255^a)+(255^s)+1):72057594037927940*t+281474976710656*e+1099511627776*n+4294967296*r+16777216*i+65536*o+256*a+s}, t.prototype.readInt=function(){return this.readInt32()}, t.prototype.writeInt=function(t){return this.writeInt32(t)}, t.prototype.read=function(t){var e,n;for(e=[], n=0;0<=t?n<t:t<n;0<=t?++n:--n)e.push(this.readByte());return e}, t.prototype.write=function(t){var e,n,r,i;for(i=[], n=0, r=t.length;n<r;n++)e=t[n], i.push(this.writeByte(e));return i}, t}(),e=function(){var p;function t(t){var e,n,r;for(this.scalarType=t.readInt(), this.tableCount=t.readShort(), this.searchRange=t.readShort(), this.entrySelector=t.readShort(), this.rangeShift=t.readShort(), this.tables={}, n=0, r=this.tableCount;0<=r?n<r:r<n;0<=r?++n:--n)e={tag:t.readString(4),checksum:t.readInt(),offset:t.readInt(),length:t.readInt()}, this.tables[e.tag]=e;}return t.prototype.encode=function(t){var e,n,r,i,o,a,s,c,l,h,u,f,d;for(d in u=Object.keys(t).length, a=Math.log(2), l=16*Math.floor(Math.log(u)/a), i=Math.floor(l/a), c=16*u-l, (n=new X).writeInt(this.scalarType), n.writeShort(u), n.writeShort(l), n.writeShort(i), n.writeShort(c), r=16*u, s=n.pos+r, o=null, f=[], t)for(h=t[d], n.writeString(d), n.writeInt(p(h)), n.writeInt(s), n.writeInt(h.length), f=f.concat(h), "head"===d&&(o=s), s+=h.length;s%4;)f.push(0), s++;return n.write(f), e=2981146554-p(n.data), n.pos=o+8, n.writeUInt32(e), n.data}, p=function(t){var e,n,r,i;for(t=k.call(t);t.length%4;)t.push(0);for(n=new X(t), r=e=0, i=t.length;r<i;r+=4)e+=n.readUInt32();return 4294967295&e}, t}(),u={}.hasOwnProperty,f=function(t,e){for(var n in e)u.call(e,n)&&(t[n]=e[n]);function r(){this.constructor=t;}return r.prototype=e.prototype, t.prototype=new r, t.__super__=e.prototype, t};l=function(){function t(t){var e;this.file=t, e=this.file.directory.tables[this.tag], this.exists=!!e, e&&(this.offset=e.offset, this.length=e.length, this.parse(this.file.contents));}return t.prototype.parse=function(){}, t.prototype.encode=function(){}, t.prototype.raw=function(){return this.exists?(this.file.contents.pos=this.offset, this.file.contents.read(this.length)):null}, t}();var d=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return f(e,l), e.prototype.tag="head", e.prototype.parse=function(t){return t.pos=this.offset, this.version=t.readInt(), this.revision=t.readInt(), this.checkSumAdjustment=t.readInt(), this.magicNumber=t.readInt(), this.flags=t.readShort(), this.unitsPerEm=t.readShort(), this.created=t.readLongLong(), this.modified=t.readLongLong(), this.xMin=t.readShort(), this.yMin=t.readShort(), this.xMax=t.readShort(), this.yMax=t.readShort(), this.macStyle=t.readShort(), this.lowestRecPPEM=t.readShort(), this.fontDirectionHint=t.readShort(), this.indexToLocFormat=t.readShort(), this.glyphDataFormat=t.readShort()}, e}(),p=function(){function t(n,t){var e,r,i,o,a,s,c,l,h,u,f,d,p,g,m,y,w,v;switch(this.platformID=n.readUInt16(), this.encodingID=n.readShort(), this.offset=t+n.readInt(), h=n.pos, n.pos=this.offset, this.format=n.readUInt16(), this.length=n.readUInt16(), this.language=n.readUInt16(), this.isUnicode=3===this.platformID&&1===this.encodingID&&4===this.format||0===this.platformID&&4===this.format, this.codeMap={}, this.format){case 0:for(s=m=0;m<256;s=++m)this.codeMap[s]=n.readByte();break;case 4:for(f=n.readUInt16(), u=f/2, n.pos+=6, i=function(){var t,e;for(e=[], s=t=0;0<=u?t<u:u<t;s=0<=u?++t:--t)e.push(n.readUInt16());return e}(), n.pos+=2, p=function(){var t,e;for(e=[], s=t=0;0<=u?t<u:u<t;s=0<=u?++t:--t)e.push(n.readUInt16());return e}(), c=function(){var t,e;for(e=[], s=t=0;0<=u?t<u:u<t;s=0<=u?++t:--t)e.push(n.readUInt16());return e}(), l=function(){var t,e;for(e=[], s=t=0;0<=u?t<u:u<t;s=0<=u?++t:--t)e.push(n.readUInt16());return e}(), r=(this.length-n.pos+this.offset)/2, a=function(){var t,e;for(e=[], s=t=0;0<=r?t<r:r<t;s=0<=r?++t:--t)e.push(n.readUInt16());return e}(), s=y=0, v=i.length;y<v;s=++y)for(g=i[s], e=w=d=p[s];d<=g?w<=g:g<=w;e=d<=g?++w:--w)0===l[s]?o=e+c[s]:0!==(o=a[l[s]/2+(e-d)-(u-s)]||0)&&(o+=c[s]), this.codeMap[e]=65535&o;}n.pos=h;}return t.encode=function(t,e){var n,r,i,o,a,s,c,l,h,u,f,d,p,g,m,y,w,v,b,x,S,k,_,C,I,A,T,F,q,E,P,O,B,j,R,D,M,z,N,L,U,H,W,V,G,Y;switch(F=new X, o=Object.keys(t).sort(function(t,e){return t-e}), e){case"macroman":for(p=0, g=function(){var t,e;for(e=[], d=t=0;t<256;d=++t)e.push(0);return e}(), y={0:0}, i={}, q=0, B=o.length;q<B;q++)null==y[W=t[r=o[q]]]&&(y[W]=++p), i[r]={old:t[r],new:y[t[r]]}, g[r]=y[t[r]];return F.writeUInt16(1), F.writeUInt16(0), F.writeUInt32(12), F.writeUInt16(0), F.writeUInt16(262), F.writeUInt16(0), F.write(g), {charMap:i,subtable:F.data,maxGlyphID:p+1};case"unicode":for(A=[], h=[], y={}, n={}, m=c=null, E=w=0, j=o.length;E<j;E++)null==y[b=t[r=o[E]]]&&(y[b]=++w), n[r]={old:b,new:y[b]}, a=y[b]-r, null!=m&&a===c||(m&&h.push(m), A.push(r), c=a), m=r;for(m&&h.push(m), h.push(65535), A.push(65535), C=2*(_=A.length), k=2*Math.pow(Math.log(_)/Math.LN2,2), u=Math.log(k/2)/Math.LN2, S=2*_-k, s=[], x=[], f=[], d=P=0, R=A.length;P<R;d=++P){if(I=A[d], l=h[d], 65535===I){s.push(0), x.push(0);break}if(32768<=I-(T=n[I].new))for(s.push(0), x.push(2*(f.length+_-d)), r=O=I;I<=l?O<=l:l<=O;r=I<=l?++O:--O)f.push(n[r].new);else s.push(T-I), x.push(0);}for(F.writeUInt16(3), F.writeUInt16(1), F.writeUInt32(12), F.writeUInt16(4), F.writeUInt16(16+8*_+2*f.length), F.writeUInt16(0), F.writeUInt16(C), F.writeUInt16(k), F.writeUInt16(u), F.writeUInt16(S), U=0, D=h.length;U<D;U++)r=h[U], F.writeUInt16(r);for(F.writeUInt16(0), H=0, M=A.length;H<M;H++)r=A[H], F.writeUInt16(r);for(V=0, z=s.length;V<z;V++)a=s[V], F.writeUInt16(a);for(G=0, N=x.length;G<N;G++)v=x[G], F.writeUInt16(v);for(Y=0, L=f.length;Y<L;Y++)p=f[Y], F.writeUInt16(p);return{charMap:n,subtable:F.data,maxGlyphID:w+1}}}, t}(),m=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return f(e,l), e.prototype.tag="cmap", e.prototype.parse=function(t){var e,n,r;for(t.pos=this.offset, this.version=t.readUInt16(), n=t.readUInt16(), this.tables=[], this.unicode=null, r=0;0<=n?r<n:n<r;0<=n?++r:--r)e=new p(t,this.offset), this.tables.push(e), e.isUnicode&&null==this.unicode&&(this.unicode=e);return!0}, e.encode=function(t,e){var n,r;return null==e&&(e="macroman"), n=p.encode(t,e), (r=new X).writeUInt16(0), r.writeUInt16(1), n.table=r.data.concat(n.subtable), n}, e}(),g=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return f(e,l), e.prototype.tag="hhea", e.prototype.parse=function(t){return t.pos=this.offset, this.version=t.readInt(), this.ascender=t.readShort(), this.decender=t.readShort(), this.lineGap=t.readShort(), this.advanceWidthMax=t.readShort(), this.minLeftSideBearing=t.readShort(), this.minRightSideBearing=t.readShort(), this.xMaxExtent=t.readShort(), this.caretSlopeRise=t.readShort(), this.caretSlopeRun=t.readShort(), this.caretOffset=t.readShort(), t.pos+=8, this.metricDataFormat=t.readShort(), this.numberOfMetrics=t.readUInt16()}, e}(),y=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return f(e,l), e.prototype.tag="OS/2", e.prototype.parse=function(n){if(n.pos=this.offset, this.version=n.readUInt16(), this.averageCharWidth=n.readShort(), this.weightClass=n.readUInt16(), this.widthClass=n.readUInt16(), this.type=n.readShort(), this.ySubscriptXSize=n.readShort(), this.ySubscriptYSize=n.readShort(), this.ySubscriptXOffset=n.readShort(), this.ySubscriptYOffset=n.readShort(), this.ySuperscriptXSize=n.readShort(), this.ySuperscriptYSize=n.readShort(), this.ySuperscriptXOffset=n.readShort(), this.ySuperscriptYOffset=n.readShort(), this.yStrikeoutSize=n.readShort(), this.yStrikeoutPosition=n.readShort(), this.familyClass=n.readShort(), this.panose=function(){var t,e;for(e=[], t=0;t<10;++t)e.push(n.readByte());return e}(), this.charRange=function(){var t,e;for(e=[], t=0;t<4;++t)e.push(n.readInt());return e}(), this.vendorID=n.readString(4), this.selection=n.readShort(), this.firstCharIndex=n.readShort(), this.lastCharIndex=n.readShort(), 0<this.version&&(this.ascent=n.readShort(), this.descent=n.readShort(), this.lineGap=n.readShort(), this.winAscent=n.readShort(), this.winDescent=n.readShort(), this.codePageRange=function(){var t,e;for(e=[], t=0;t<2;++t)e.push(n.readInt());return e}(), 1<this.version))return this.xHeight=n.readShort(), this.capHeight=n.readShort(), this.defaultChar=n.readShort(), this.breakChar=n.readShort(), this.maxContext=n.readShort()}, e}(),w=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return f(e,l), e.prototype.tag="post", e.prototype.parse=function(r){var t,e,n,i;switch(r.pos=this.offset, this.format=r.readInt(), this.italicAngle=r.readInt(), this.underlinePosition=r.readShort(), this.underlineThickness=r.readShort(), this.isFixedPitch=r.readInt(), this.minMemType42=r.readInt(), this.maxMemType42=r.readInt(), this.minMemType1=r.readInt(), this.maxMemType1=r.readInt(), this.format){case 65536:break;case 131072:for(e=r.readUInt16(), this.glyphNameIndex=[], n=0;0<=e?n<e:e<n;0<=e?++n:--n)this.glyphNameIndex.push(r.readUInt16());for(this.names=[], i=[];r.pos<this.offset+this.length;)t=r.readByte(), i.push(this.names.push(r.readString(t)));return i;case 151552:return e=r.readUInt16(), this.offsets=r.read(e);case 196608:break;case 262144:return this.map=function(){var t,e,n;for(n=[], t=0, e=this.file.maxp.numGlyphs;0<=e?t<e:e<t;0<=e?++t:--t)n.push(r.readUInt32());return n}.call(this)}}, e}(),v=function(t,e){this.raw=t, this.length=t.length, this.platformID=e.platformID, this.encodingID=e.encodingID, this.languageID=e.languageID;},b=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return f(e,l), e.prototype.tag="name", e.prototype.parse=function(t){var e,n,r,i,o,a,s,c,l,h,u,f;for(t.pos=this.offset, t.readShort(), e=t.readShort(), a=t.readShort(), n=[], i=l=0;0<=e?l<e:e<l;i=0<=e?++l:--l)n.push({platformID:t.readShort(),encodingID:t.readShort(),languageID:t.readShort(),nameID:t.readShort(),length:t.readShort(),offset:this.offset+a+t.readShort()});for(s={}, i=h=0, u=n.length;h<u;i=++h)r=n[i], t.pos=r.offset, c=t.readString(r.length), o=new v(c,r), null==s[f=r.nameID]&&(s[f]=[]), s[r.nameID].push(o);return this.strings=s, this.copyright=s[0], this.fontFamily=s[1], this.fontSubfamily=s[2], this.uniqueSubfamily=s[3], this.fontName=s[4], this.version=s[5], this.postscriptName=s[6][0].raw.replace(/[\x00-\x19\x80-\xff]/g,""), this.trademark=s[7], this.manufacturer=s[8], this.designer=s[9], this.description=s[10], this.vendorUrl=s[11], this.designerUrl=s[12], this.license=s[13], this.licenseUrl=s[14], this.preferredFamily=s[15], this.preferredSubfamily=s[17], this.compatibleFull=s[18], this.sampleText=s[19]}, e}(),x=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return f(e,l), e.prototype.tag="maxp", e.prototype.parse=function(t){return t.pos=this.offset, this.version=t.readInt(), this.numGlyphs=t.readUInt16(), this.maxPoints=t.readUInt16(), this.maxContours=t.readUInt16(), this.maxCompositePoints=t.readUInt16(), this.maxComponentContours=t.readUInt16(), this.maxZones=t.readUInt16(), this.maxTwilightPoints=t.readUInt16(), this.maxStorage=t.readUInt16(), this.maxFunctionDefs=t.readUInt16(), this.maxInstructionDefs=t.readUInt16(), this.maxStackElements=t.readUInt16(), this.maxSizeOfInstructions=t.readUInt16(), this.maxComponentElements=t.readUInt16(), this.maxComponentDepth=t.readUInt16()}, e}(),S=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return f(e,l), e.prototype.tag="hmtx", e.prototype.parse=function(n){var t,r,i,e,o,a,s;for(n.pos=this.offset, this.metrics=[], e=0, a=this.file.hhea.numberOfMetrics;0<=a?e<a:a<e;0<=a?++e:--e)this.metrics.push({advance:n.readUInt16(),lsb:n.readInt16()});for(r=this.file.maxp.numGlyphs-this.file.hhea.numberOfMetrics, this.leftSideBearings=function(){var t,e;for(e=[], t=0;0<=r?t<r:r<t;0<=r?++t:--t)e.push(n.readInt16());return e}(), this.widths=function(){var t,e,n,r;for(r=[], t=0, e=(n=this.metrics).length;t<e;t++)i=n[t], r.push(i.advance);return r}.call(this), t=this.widths[this.widths.length-1], s=[], o=0;0<=r?o<r:r<o;0<=r?++o:--o)s.push(this.widths.push(t));return s}, e.prototype.forGlyph=function(t){return t in this.metrics?this.metrics[t]:{advance:this.metrics[this.metrics.length-1].advance,lsb:this.leftSideBearings[t-this.metrics.length]}}, e}(),k=[].slice,_=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return f(e,l), e.prototype.tag="glyf", e.prototype.parse=function(t){return this.cache={}}, e.prototype.glyphFor=function(t){var e,n,r,i,o,a,s,c,l,h;return(t=t)in this.cache?this.cache[t]:(i=this.file.loca, e=this.file.contents, n=i.indexOf(t), 0===(r=i.lengthOf(t))?this.cache[t]=null:(e.pos=this.offset+n, o=(a=new X(e.read(r))).readShort(), c=a.readShort(), h=a.readShort(), s=a.readShort(), l=a.readShort(), this.cache[t]=-1===o?new I(a,c,h,s,l):new C(a,o,c,h,s,l), this.cache[t]))}, e.prototype.encode=function(t,e,n){var r,i,o,a,s;for(o=[], i=[], a=0, s=e.length;a<s;a++)r=t[e[a]], i.push(o.length), r&&(o=o.concat(r.encode(n)));return i.push(o.length), {table:o,offsets:i}}, e}(),C=function(){function t(t,e,n,r,i,o){this.raw=t, this.numberOfContours=e, this.xMin=n, this.yMin=r, this.xMax=i, this.yMax=o, this.compound=!1;}return t.prototype.encode=function(){return this.raw.data}, t}(),I=function(){function t(t,e,n,r,i){var o,a;for(this.raw=t, this.xMin=e, this.yMin=n, this.xMax=r, this.yMax=i, this.compound=!0, this.glyphIDs=[], this.glyphOffsets=[], o=this.raw;a=o.readShort(), this.glyphOffsets.push(o.pos), this.glyphIDs.push(o.readShort()), 32&a;)o.pos+=1&a?4:2, 128&a?o.pos+=8:64&a?o.pos+=4:8&a&&(o.pos+=2);}return t.prototype.encode=function(t){var e,n,r,i,o;for(n=new X(k.call(this.raw.data)), e=r=0, i=(o=this.glyphIDs).length;r<i;e=++r)o[e], n.pos=this.glyphOffsets[e];return n.data}, t}(),A=function(t){function e(){return e.__super__.constructor.apply(this,arguments)}return f(e,l), e.prototype.tag="loca", e.prototype.parse=function(r){var t;return r.pos=this.offset, t=this.file.head.indexToLocFormat, this.offsets=0===t?function(){var t,e,n;for(n=[], t=0, e=this.length;t<e;t+=2)n.push(2*r.readUInt16());return n}.call(this):function(){var t,e,n;for(n=[], t=0, e=this.length;t<e;t+=4)n.push(r.readUInt32());return n}.call(this)}, e.prototype.indexOf=function(t){return this.offsets[t]}, e.prototype.lengthOf=function(t){return this.offsets[t+1]-this.offsets[t]}, e.prototype.encode=function(t,e){for(var n=new Uint32Array(this.offsets.length),r=0,i=0,o=0;o<n.length;++o)if(n[o]=r, i<e.length&&e[i]==o){++i, n[o]=r;var a=this.offsets[o],s=this.offsets[o+1]-a;0<s&&(r+=s);}for(var c=new Array(4*n.length),l=0;l<n.length;++l)c[4*l+3]=255&n[l], c[4*l+2]=(65280&n[l])>>8, c[4*l+1]=(16711680&n[l])>>16, c[4*l]=(4278190080&n[l])>>24;return c}, e}(),T=function(){function t(t){this.font=t, this.subset={}, this.unicodes={}, this.next=33;}return t.prototype.generateCmap=function(){var t,e,n,r,i;for(e in r=this.font.cmap.tables[0].codeMap, t={}, i=this.subset)n=i[e], t[e]=r[n];return t}, t.prototype.glyphsFor=function(t){var e,n,r,i,o,a,s;for(r={}, o=0, a=t.length;o<a;o++)r[i=t[o]]=this.font.glyf.glyphFor(i);for(i in e=[], r)(null!=(n=r[i])?n.compound:void 0)&&e.push.apply(e,n.glyphIDs);if(0<e.length)for(i in s=this.glyphsFor(e))n=s[i], r[i]=n;return r}, t.prototype.encode=function(t){var e,n,r,i,o,a,s,c,l,h,u,f,d,p,g;for(n in e=m.encode(this.generateCmap(),"unicode"), i=this.glyphsFor(t), u={0:0}, g=e.charMap)u[(a=g[n]).old]=a.new;for(f in h=e.maxGlyphID, i)f in u||(u[f]=h++);return c=function(t){var e,n;for(e in n={}, t)n[t[e]]=e;return n}(u), l=Object.keys(c).sort(function(t,e){return t-e}), d=function(){var t,e,n;for(n=[], t=0, e=l.length;t<e;t++)o=l[t], n.push(c[o]);return n}(), r=this.font.glyf.encode(i,d,u), s=this.font.loca.encode(r.offsets,d), p={cmap:this.font.cmap.raw(),glyf:r.table,loca:s,hmtx:this.font.hmtx.raw(),hhea:this.font.hhea.raw(),maxp:this.font.maxp.raw(),post:this.font.post.raw(),name:this.font.name.raw(),head:this.font.head.raw()}, this.font.os2.exists&&(p["OS/2"]=this.font.os2.raw()), this.font.directory.encode(p)}, t}();t.API.PDFObject=function(){var o;function a(){}return o=function(t,e){return(Array(e+1).join("0")+t).slice(-e)}, a.convert=function(r){var i,t,e,n;if(Array.isArray(r))return"["+function(){var t,e,n;for(n=[], t=0, e=r.length;t<e;t++)i=r[t], n.push(a.convert(i));return n}().join(" ")+"]";if("string"==typeof r)return"/"+r;if(null!=r?r.isString:void 0)return"("+r+")";if(r instanceof Date)return"(D:"+o(r.getUTCFullYear(),4)+o(r.getUTCMonth(),2)+o(r.getUTCDate(),2)+o(r.getUTCHours(),2)+o(r.getUTCMinutes(),2)+o(r.getUTCSeconds(),2)+"Z)";if("[object Object]"==={}.toString.call(r)){for(t in e=["<<"], r)n=r[t], e.push("/"+t+" "+a.convert(n));return e.push(">>"), e.join("\n")}return""+r}, a}();}(K), ut="undefined"!=typeof self&&self||"undefined"!=typeof window&&window||"undefined"!=typeof commonjsGlobal&&commonjsGlobal||Function('return typeof this === "object" && this.content')()||Function("return this")(), ft=function(){var l,n,r;function i(t){var e,n,r,i,o,a,s,c,l,h,u,f,d,p;for(this.data=t, this.pos=8, this.palette=[], this.imgData=[], this.transparency={}, this.animation=null, this.text={}, a=null;;){switch(e=this.readUInt32(), l=function(){var t,e;for(e=[], t=0;t<4;++t)e.push(String.fromCharCode(this.data[this.pos++]));return e}.call(this).join("")){case"IHDR":this.width=this.readUInt32(), this.height=this.readUInt32(), this.bits=this.data[this.pos++], this.colorType=this.data[this.pos++], this.compressionMethod=this.data[this.pos++], this.filterMethod=this.data[this.pos++], this.interlaceMethod=this.data[this.pos++];break;case"acTL":this.animation={numFrames:this.readUInt32(),numPlays:this.readUInt32()||1/0,frames:[]};break;case"PLTE":this.palette=this.read(e);break;case"fcTL":a&&this.animation.frames.push(a), this.pos+=4, a={width:this.readUInt32(),height:this.readUInt32(),xOffset:this.readUInt32(),yOffset:this.readUInt32()}, o=this.readUInt16(), i=this.readUInt16()||100, a.delay=1e3*o/i, a.disposeOp=this.data[this.pos++], a.blendOp=this.data[this.pos++], a.data=[];break;case"IDAT":case"fdAT":for("fdAT"===l&&(this.pos+=4, e-=4), t=(null!=a?a.data:void 0)||this.imgData, f=0;0<=e?f<e:e<f;0<=e?++f:--f)t.push(this.data[this.pos++]);break;case"tRNS":switch(this.transparency={}, this.colorType){case 3:if(r=this.palette.length/3, this.transparency.indexed=this.read(e), this.transparency.indexed.length>r)throw new Error("More transparent colors than palette size");if(0<(h=r-this.transparency.indexed.length))for(d=0;0<=h?d<h:h<d;0<=h?++d:--d)this.transparency.indexed.push(255);break;case 0:this.transparency.grayscale=this.read(e)[0];break;case 2:this.transparency.rgb=this.read(e);}break;case"tEXt":s=(u=this.read(e)).indexOf(0), c=String.fromCharCode.apply(String,u.slice(0,s)), this.text[c]=String.fromCharCode.apply(String,u.slice(s+1));break;case"IEND":return a&&this.animation.frames.push(a), this.colors=function(){switch(this.colorType){case 0:case 3:case 4:return 1;case 2:case 6:return 3}}.call(this), this.hasAlphaChannel=4===(p=this.colorType)||6===p, n=this.colors+(this.hasAlphaChannel?1:0), this.pixelBitlength=this.bits*n, this.colorSpace=function(){switch(this.colors){case 1:return"DeviceGray";case 3:return"DeviceRGB"}}.call(this), void(this.imgData=new Uint8Array(this.imgData));default:this.pos+=e;}if(this.pos+=4, this.pos>this.data.length)throw new Error("Incomplete or corrupt PNG file")}}i.load=function(t,e,n){var r;return"function"==typeof e&&(n=e), (r=new XMLHttpRequest).open("GET",t,!0), r.responseType="arraybuffer", r.onload=function(){var t;return t=new i(new Uint8Array(r.response||r.mozResponseArrayBuffer)), "function"==typeof(null!=e?e.getContext:void 0)&&t.render(e), "function"==typeof n?n(t):void 0}, r.send(null)}, i.prototype.read=function(t){var e,n;for(n=[], e=0;0<=t?e<t:t<e;0<=t?++e:--e)n.push(this.data[this.pos++]);return n}, i.prototype.readUInt32=function(){return this.data[this.pos++]<<24|this.data[this.pos++]<<16|this.data[this.pos++]<<8|this.data[this.pos++]}, i.prototype.readUInt16=function(){return this.data[this.pos++]<<8|this.data[this.pos++]}, i.prototype.decodePixels=function(E){var P=this.pixelBitlength/8,O=new Uint8Array(this.width*this.height*P),B=0,j=this;if(null==E&&(E=this.imgData), 0===E.length)return new Uint8Array(0);function t(t,e,n,r){var i,o,a,s,c,l,h,u,f,d,p,g,m,y,w,v,b,x,S,k,_,C=Math.ceil((j.width-t)/n),I=Math.ceil((j.height-e)/r),A=j.width==C&&j.height==I;for(y=P*C, g=A?O:new Uint8Array(y*I), l=E.length, o=m=0;m<I&&B<l;){switch(E[B++]){case 0:for(s=b=0;b<y;s=b+=1)g[o++]=E[B++];break;case 1:for(s=x=0;x<y;s=x+=1)i=E[B++], c=s<P?0:g[o-P], g[o++]=(i+c)%256;break;case 2:for(s=S=0;S<y;s=S+=1)i=E[B++], a=(s-s%P)/P, w=m&&g[(m-1)*y+a*P+s%P], g[o++]=(w+i)%256;break;case 3:for(s=k=0;k<y;s=k+=1)i=E[B++], a=(s-s%P)/P, c=s<P?0:g[o-P], w=m&&g[(m-1)*y+a*P+s%P], g[o++]=(i+Math.floor((c+w)/2))%256;break;case 4:for(s=_=0;_<y;s=_+=1)i=E[B++], a=(s-s%P)/P, c=s<P?0:g[o-P], 0===m?w=v=0:(w=g[(m-1)*y+a*P+s%P], v=a&&g[(m-1)*y+(a-1)*P+s%P]), h=c+w-v, u=Math.abs(h-c), d=Math.abs(h-w), p=Math.abs(h-v), f=u<=d&&u<=p?c:d<=p?w:v, g[o++]=(i+f)%256;break;default:throw new Error("Invalid filter algorithm: "+E[B-1])}if(!A){var T=((e+m*r)*j.width+t)*P,F=m*y;for(s=0;s<C;s+=1){for(var q=0;q<P;q+=1)O[T++]=g[F++];T+=(n-1)*P;}}m++;}}return E=(E=new gt(E)).getBytes(), 1==j.interlaceMethod?(t(0,0,8,8), t(4,0,8,8), t(0,4,4,8), t(2,0,4,4), t(0,2,2,4), t(1,0,2,2), t(0,1,1,2)):t(0,0,1,1), O}, i.prototype.decodePalette=function(){var t,e,n,r,i,o,a,s,c;for(n=this.palette, o=this.transparency.indexed||[], i=new Uint8Array((o.length||0)+n.length), r=0, n.length, e=a=t=0, s=n.length;a<s;e=a+=3)i[r++]=n[e], i[r++]=n[e+1], i[r++]=n[e+2], i[r++]=null!=(c=o[t++])?c:255;return i}, i.prototype.copyToImageData=function(t,e){var n,r,i,o,a,s,c,l,h,u,f;if(r=this.colors, h=null, n=this.hasAlphaChannel, this.palette.length&&(h=null!=(f=this._decodedPalette)?f:this._decodedPalette=this.decodePalette(), r=4, n=!0), l=(i=t.data||t).length, a=h||e, o=s=0, 1===r)for(;o<l;)c=h?4*e[o/4]:s, u=a[c++], i[o++]=u, i[o++]=u, i[o++]=u, i[o++]=n?a[c++]:255, s=c;else for(;o<l;)c=h?4*e[o/4]:s, i[o++]=a[c++], i[o++]=a[c++], i[o++]=a[c++], i[o++]=n?a[c++]:255, s=c;}, i.prototype.decode=function(){var t;return t=new Uint8Array(this.width*this.height*4), this.copyToImageData(t,this.decodePixels()), t};try{n=ut.document.createElement("canvas"), r=n.getContext("2d");}catch(t){return-1}return l=function(t){var e;return r.width=t.width, r.height=t.height, r.clearRect(0,0,t.width,t.height), r.putImageData(t,0,0), (e=new Image).src=n.toDataURL(), e}, i.prototype.decodeFrames=function(t){var e,n,r,i,o,a,s,c;if(this.animation){for(c=[], n=o=0, a=(s=this.animation.frames).length;o<a;n=++o)e=s[n], r=t.createImageData(e.width,e.height), i=this.decodePixels(new Uint8Array(e.data)), this.copyToImageData(r,i), e.imageData=r, c.push(e.image=l(r));return c}}, i.prototype.renderFrame=function(t,e){var n,r,i;return n=(r=this.animation.frames)[e], i=r[e-1], 0===e&&t.clearRect(0,0,this.width,this.height), 1===(null!=i?i.disposeOp:void 0)?t.clearRect(i.xOffset,i.yOffset,i.width,i.height):2===(null!=i?i.disposeOp:void 0)&&t.putImageData(i.imageData,i.xOffset,i.yOffset), 0===n.blendOp&&t.clearRect(n.xOffset,n.yOffset,n.width,n.height), t.drawImage(n.image,n.xOffset,n.yOffset)}, i.prototype.animate=function(n){var r,i,o,a,s,t,c=this;return i=0, t=this.animation, a=t.numFrames, o=t.frames, s=t.numPlays, (r=function(){var t,e;if(t=i++%a, e=o[t], c.renderFrame(n,t), 1<a&&i/a<s)return c.animation._timeout=setTimeout(r,e.delay)})()}, i.prototype.stopAnimation=function(){var t;return clearTimeout(null!=(t=this.animation)?t._timeout:void 0)}, i.prototype.render=function(t){var e,n;return t._png&&t._png.stopAnimation(), t._png=this, t.width=this.width, t.height=this.height, e=t.getContext("2d"), this.animation?(this.decodeFrames(e), this.animate(e)):(n=e.createImageData(this.width,this.height), this.copyToImageData(n,this.decodePixels()), e.putImageData(n,0,0))}, i}(), ut.PNG=ft;
/*
   * Extracted from pdf.js
   * https://github.com/andreasgal/pdf.js
   *
   * Copyright (c) 2011 Mozilla Foundation
   *
   * Contributors: Andreas Gal <gal@mozilla.com>
   *               Chris G Jones <cjones@mozilla.com>
   *               Shaon Barman <shaon.barman@gmail.com>
   *               Vivien Nicolas <21@vingtetun.org>
   *               Justin D'Arcangelo <justindarc@gmail.com>
   *               Yury Delendik
   *
   * 
   */
var pt=function(){function t(){this.pos=0, this.bufferLength=0, this.eof=!1, this.buffer=null;}return t.prototype={ensureBuffer:function(t){var e=this.buffer,n=e?e.byteLength:0;if(t<n)return e;for(var r=512;r<t;)r<<=1;for(var i=new Uint8Array(r),o=0;o<n;++o)i[o]=e[o];return this.buffer=i},getByte:function(){for(var t=this.pos;this.bufferLength<=t;){if(this.eof)return null;this.readBlock();}return this.buffer[this.pos++]},getBytes:function(t){var e=this.pos;if(t){this.ensureBuffer(e+t);for(var n=e+t;!this.eof&&this.bufferLength<n;)this.readBlock();var r=this.bufferLength;r<n&&(n=r);}else{for(;!this.eof;)this.readBlock();n=this.bufferLength;}return this.pos=n, this.buffer.subarray(e,n)},lookChar:function(){for(var t=this.pos;this.bufferLength<=t;){if(this.eof)return null;this.readBlock();}return String.fromCharCode(this.buffer[this.pos])},getChar:function(){for(var t=this.pos;this.bufferLength<=t;){if(this.eof)return null;this.readBlock();}return String.fromCharCode(this.buffer[this.pos++])},makeSubStream:function(t,e,n){for(var r=t+e;this.bufferLength<=r&&!this.eof;)this.readBlock();return new Stream(this.buffer,t,e,n)},skip:function(t){t||(t=1), this.pos+=t;},reset:function(){this.pos=0;}}, t}(),gt=function(){if("undefined"!=typeof Uint32Array){var F=new Uint32Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),q=new Uint32Array([3,4,5,6,7,8,9,10,65547,65549,65551,65553,131091,131095,131099,131103,196643,196651,196659,196667,262211,262227,262243,262259,327811,327843,327875,327907,258,258,258]),E=new Uint32Array([1,2,3,4,65541,65543,131081,131085,196625,196633,262177,262193,327745,327777,393345,393409,459009,459137,524801,525057,590849,591361,657409,658433,724993,727041,794625,798721,868353,876545]),P=[new Uint32Array([459008,524368,524304,524568,459024,524400,524336,590016,459016,524384,524320,589984,524288,524416,524352,590048,459012,524376,524312,589968,459028,524408,524344,590032,459020,524392,524328,59e4,524296,524424,524360,590064,459010,524372,524308,524572,459026,524404,524340,590024,459018,524388,524324,589992,524292,524420,524356,590056,459014,524380,524316,589976,459030,524412,524348,590040,459022,524396,524332,590008,524300,524428,524364,590072,459009,524370,524306,524570,459025,524402,524338,590020,459017,524386,524322,589988,524290,524418,524354,590052,459013,524378,524314,589972,459029,524410,524346,590036,459021,524394,524330,590004,524298,524426,524362,590068,459011,524374,524310,524574,459027,524406,524342,590028,459019,524390,524326,589996,524294,524422,524358,590060,459015,524382,524318,589980,459031,524414,524350,590044,459023,524398,524334,590012,524302,524430,524366,590076,459008,524369,524305,524569,459024,524401,524337,590018,459016,524385,524321,589986,524289,524417,524353,590050,459012,524377,524313,589970,459028,524409,524345,590034,459020,524393,524329,590002,524297,524425,524361,590066,459010,524373,524309,524573,459026,524405,524341,590026,459018,524389,524325,589994,524293,524421,524357,590058,459014,524381,524317,589978,459030,524413,524349,590042,459022,524397,524333,590010,524301,524429,524365,590074,459009,524371,524307,524571,459025,524403,524339,590022,459017,524387,524323,589990,524291,524419,524355,590054,459013,524379,524315,589974,459029,524411,524347,590038,459021,524395,524331,590006,524299,524427,524363,590070,459011,524375,524311,524575,459027,524407,524343,590030,459019,524391,524327,589998,524295,524423,524359,590062,459015,524383,524319,589982,459031,524415,524351,590046,459023,524399,524335,590014,524303,524431,524367,590078,459008,524368,524304,524568,459024,524400,524336,590017,459016,524384,524320,589985,524288,524416,524352,590049,459012,524376,524312,589969,459028,524408,524344,590033,459020,524392,524328,590001,524296,524424,524360,590065,459010,524372,524308,524572,459026,524404,524340,590025,459018,524388,524324,589993,524292,524420,524356,590057,459014,524380,524316,589977,459030,524412,524348,590041,459022,524396,524332,590009,524300,524428,524364,590073,459009,524370,524306,524570,459025,524402,524338,590021,459017,524386,524322,589989,524290,524418,524354,590053,459013,524378,524314,589973,459029,524410,524346,590037,459021,524394,524330,590005,524298,524426,524362,590069,459011,524374,524310,524574,459027,524406,524342,590029,459019,524390,524326,589997,524294,524422,524358,590061,459015,524382,524318,589981,459031,524414,524350,590045,459023,524398,524334,590013,524302,524430,524366,590077,459008,524369,524305,524569,459024,524401,524337,590019,459016,524385,524321,589987,524289,524417,524353,590051,459012,524377,524313,589971,459028,524409,524345,590035,459020,524393,524329,590003,524297,524425,524361,590067,459010,524373,524309,524573,459026,524405,524341,590027,459018,524389,524325,589995,524293,524421,524357,590059,459014,524381,524317,589979,459030,524413,524349,590043,459022,524397,524333,590011,524301,524429,524365,590075,459009,524371,524307,524571,459025,524403,524339,590023,459017,524387,524323,589991,524291,524419,524355,590055,459013,524379,524315,589975,459029,524411,524347,590039,459021,524395,524331,590007,524299,524427,524363,590071,459011,524375,524311,524575,459027,524407,524343,590031,459019,524391,524327,589999,524295,524423,524359,590063,459015,524383,524319,589983,459031,524415,524351,590047,459023,524399,524335,590015,524303,524431,524367,590079]),9],O=[new Uint32Array([327680,327696,327688,327704,327684,327700,327692,327708,327682,327698,327690,327706,327686,327702,327694,0,327681,327697,327689,327705,327685,327701,327693,327709,327683,327699,327691,327707,327687,327703,327695,0]),5];return(t.prototype=Object.create(pt.prototype)).getBits=function(t){for(var e,n=this.codeSize,r=this.codeBuf,i=this.bytes,o=this.bytesPos;n<t;)void 0===(e=i[o++])&&B("Bad encoding in flate stream"), r|=e<<n, n+=8;return e=r&(1<<t)-1, this.codeBuf=r>>t, this.codeSize=n-=t, this.bytesPos=o, e}, t.prototype.getCode=function(t){for(var e=t[0],n=t[1],r=this.codeSize,i=this.codeBuf,o=this.bytes,a=this.bytesPos;r<n;){var s;void 0===(s=o[a++])&&B("Bad encoding in flate stream"), i|=s<<r, r+=8;}var c=e[i&(1<<n)-1],l=c>>16,h=65535&c;return(0==r||r<l||0==l)&&B("Bad encoding in flate stream"), this.codeBuf=i>>l, this.codeSize=r-l, this.bytesPos=a, h}, t.prototype.generateHuffmanTable=function(t){for(var e=t.length,n=0,r=0;r<e;++r)t[r]>n&&(n=t[r]);for(var i=1<<n,o=new Uint32Array(i),a=1,s=0,c=2;a<=n;++a, s<<=1, c<<=1)for(var l=0;l<e;++l)if(t[l]==a){var h=0,u=s;for(r=0;r<a;++r)h=h<<1|1&u, u>>=1;for(r=h;r<i;r+=c)o[r]=a<<16|l;++s;}return[o,n]}, t.prototype.readBlock=function(){function t(t,e,n,r,i){for(var o=t.getBits(n)+r;0<o--;)e[c++]=i;}var e=this.getBits(3);if(1&e&&(this.eof=!0), 0!=(e>>=1)){var n,r;if(1==e)n=P, r=O;else if(2==e){for(var i=this.getBits(5)+257,o=this.getBits(5)+1,a=this.getBits(4)+4,s=Array(F.length),c=0;c<a;)s[F[c++]]=this.getBits(3);for(var l=this.generateHuffmanTable(s),h=0,u=(c=0, i+o),f=new Array(u);c<u;){var d=this.getCode(l);16==d?t(this,f,2,3,h):17==d?t(this,f,3,3,h=0):18==d?t(this,f,7,11,h=0):f[c++]=h=d;}n=this.generateHuffmanTable(f.slice(0,i)), r=this.generateHuffmanTable(f.slice(i,u));}else B("Unknown block type in flate stream");for(var p=(I=this.buffer)?I.length:0,g=this.bufferLength;;){var m=this.getCode(n);if(m<256)p<=g+1&&(p=(I=this.ensureBuffer(g+1)).length), I[g++]=m;else{if(256==m)return void(this.bufferLength=g);var y=(m=q[m-=257])>>16;0<y&&(y=this.getBits(y));h=(65535&m)+y;m=this.getCode(r), 0<(y=(m=E[m])>>16)&&(y=this.getBits(y));var w=(65535&m)+y;p<=g+h&&(p=(I=this.ensureBuffer(g+h)).length);for(var v=0;v<h;++v, ++g)I[g]=I[g-w];}}}else{var b,x=this.bytes,S=this.bytesPos;void 0===(b=x[S++])&&B("Bad block header in flate stream");var k=b;void 0===(b=x[S++])&&B("Bad block header in flate stream"), k|=b<<8, void 0===(b=x[S++])&&B("Bad block header in flate stream");var _=b;void 0===(b=x[S++])&&B("Bad block header in flate stream"), (_|=b<<8)!=(65535&~k)&&B("Bad uncompressed block length in flate stream"), this.codeBuf=0, this.codeSize=0;var C=this.bufferLength,I=this.ensureBuffer(C+k),A=C+k;this.bufferLength=A;for(var T=C;T<A;++T){if(void 0===(b=x[S++])){this.eof=!0;break}I[T]=b;}this.bytesPos=S;}}, t}function B(t){throw new Error(t)}function t(t){var e=0,n=t[e++],r=t[e++];-1!=n&&-1!=r||B("Invalid header in flate stream"), 8!=(15&n)&&B("Unknown compression method in flate stream"), ((n<<8)+r)%31!=0&&B("Bad FCHECK in flate stream"), 32&r&&B("FDICT bit set in flate stream"), this.bytes=t, this.bytesPos=2, this.codeSize=0, this.codeBuf=0, pt.call(this);}}();return function(t){if("object"!=typeof t.console){t.console={};for(var e,n,r=t.console,i=function(){},o=["memory"],a="assert,clear,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn".split(",");e=o.pop();)r[e]||(r[e]={});for(;n=a.pop();)r[n]||(r[n]=i);}var s,c,l,h,u="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";void 0===t.btoa&&(t.btoa=function(t){var e,n,r,i,o,a=0,s=0,c="",l=[];if(!t)return t;for(;e=(o=t.charCodeAt(a++)<<16|t.charCodeAt(a++)<<8|t.charCodeAt(a++))>>18&63, n=o>>12&63, r=o>>6&63, i=63&o, l[s++]=u.charAt(e)+u.charAt(n)+u.charAt(r)+u.charAt(i), a<t.length;);c=l.join("");var h=t.length%3;return(h?c.slice(0,h-3):c)+"===".slice(h||3)}), void 0===t.atob&&(t.atob=function(t){var e,n,r,i,o,a,s=0,c=0,l=[];if(!t)return t;for(t+="";e=(a=u.indexOf(t.charAt(s++))<<18|u.indexOf(t.charAt(s++))<<12|(i=u.indexOf(t.charAt(s++)))<<6|(o=u.indexOf(t.charAt(s++))))>>16&255, n=a>>8&255, r=255&a, l[c++]=64==i?String.fromCharCode(e):64==o?String.fromCharCode(e,n):String.fromCharCode(e,n,r), s<t.length;);return l.join("")}), Array.prototype.map||(Array.prototype.map=function(t){if(null==this||"function"!=typeof t)throw new TypeError;for(var e=Object(this),n=e.length>>>0,r=new Array(n),i=1<arguments.length?arguments[1]:void 0,o=0;o<n;o++)o in e&&(r[o]=t.call(i,e[o],o,e));return r}), Array.isArray||(Array.isArray=function(t){return"[object Array]"===Object.prototype.toString.call(t)}), Array.prototype.forEach||(Array.prototype.forEach=function(t,e){if(null==this||"function"!=typeof t)throw new TypeError;for(var n=Object(this),r=n.length>>>0,i=0;i<r;i++)i in n&&t.call(e,n[i],i,n);}), Object.keys||(Object.keys=(s=Object.prototype.hasOwnProperty, c=!{toString:null}.propertyIsEnumerable("toString"), h=(l=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"]).length, function(t){if("object"!=typeof t&&("function"!=typeof t||null===t))throw new TypeError;var e,n,r=[];for(e in t)s.call(t,e)&&r.push(e);if(c)for(n=0;n<h;n++)s.call(t,l[n])&&r.push(l[n]);return r})), "function"!=typeof Object.assign&&(Object.assign=function(t){if(null==t)throw new TypeError("Cannot convert undefined or null to object");t=Object(t);for(var e=1;e<arguments.length;e++){var n=arguments[e];if(null!=n)for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r]);}return t}), String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")}), String.prototype.trimLeft||(String.prototype.trimLeft=function(){return this.replace(/^\s+/g,"")}), String.prototype.trimRight||(String.prototype.trimRight=function(){return this.replace(/\s+$/g,"")});}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||"undefined"!=typeof commonjsGlobal&&commonjsGlobal||Function('return typeof this === "object" && this.content')()||Function("return this")()), K});
});

var jspdf_min_1 = jspdf_min.jsPDF;
var jspdf_min_2 = jspdf_min.saveAs;

var html2canvas$1 = createCommonjsModule(function (module, exports) {
/*
  html2canvas 0.5.0-beta4 <http://html2canvas.hertzen.com>
  Copyright (c) 2017 Niklas von Hertzen
  2017-06-14 Custom build by Erik Koopmans, featuring latest bugfixes and features

  Released under MIT License
*/

(function(f){{module.exports=f();}})(function(){var define;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof commonjsRequire=="function"&&commonjsRequire;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND", f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r);}return n[o].exports}var i=typeof commonjsRequire=="function"&&commonjsRequire;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function (global){
/*! https://mths.be/punycode v1.4.1 by @mathias */
(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this,typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
},{}],2:[function(_dereq_,module,exports){
var log = _dereq_('./log');

function restoreOwnerScroll(ownerDocument, x, y) {
    if (ownerDocument.defaultView && (x !== ownerDocument.defaultView.pageXOffset || y !== ownerDocument.defaultView.pageYOffset)) {
        ownerDocument.defaultView.scrollTo(x, y);
    }
}

function cloneCanvasContents(canvas, clonedCanvas) {
    try {
        if (clonedCanvas) {
            clonedCanvas.width = canvas.width;
            clonedCanvas.height = canvas.height;
            clonedCanvas.getContext("2d").putImageData(canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height), 0, 0);
        }
    } catch(e) {
        log("Unable to copy canvas content from", canvas, e);
    }
}

function cloneNode(node, javascriptEnabled) {
    var clone = node.nodeType === 3 ? document.createTextNode(node.nodeValue) : node.cloneNode(false);

    var child = node.firstChild;
    while(child) {
        if (javascriptEnabled === true || child.nodeType !== 1 || child.nodeName !== 'SCRIPT') {
            clone.appendChild(cloneNode(child, javascriptEnabled));
        }
        child = child.nextSibling;
    }

    if (node.nodeType === 1) {
        clone._scrollTop = node.scrollTop;
        clone._scrollLeft = node.scrollLeft;
        if (node.nodeName === "CANVAS") {
            cloneCanvasContents(node, clone);
        } else if (node.nodeName === "TEXTAREA" || node.nodeName === "SELECT") {
            clone.value = node.value;
        }
    }

    return clone;
}

function initNode(node) {
    if (node.nodeType === 1) {
        node.scrollTop = node._scrollTop;
        node.scrollLeft = node._scrollLeft;

        var child = node.firstChild;
        while(child) {
            initNode(child);
            child = child.nextSibling;
        }
    }
}

module.exports = function(ownerDocument, containerDocument, width, height, options, x ,y) {
    var documentElement = cloneNode(ownerDocument.documentElement, options.javascriptEnabled);
    var container = containerDocument.createElement("iframe");

    container.className = "html2canvas-container";
    container.style.visibility = "hidden";
    container.style.position = "fixed";
    container.style.left = "-10000px";
    container.style.top = "0px";
    container.style.border = "0";
    container.width = width;
    container.height = height;
    container.scrolling = "no"; // ios won't scroll without it
    containerDocument.body.appendChild(container);

    return new Promise(function(resolve) {
        var documentClone = container.contentWindow.document;

        /* Chrome doesn't detect relative background-images assigned in inline <style> sheets when fetched through getComputedStyle
         if window url is about:blank, we can assign the url to current by writing onto the document
         */
        container.contentWindow.onload = container.onload = function() {
            var interval = setInterval(function() {
                if (documentClone.body.childNodes.length > 0) {
                    initNode(documentClone.documentElement);
                    clearInterval(interval);
                    if (options.type === "view") {
                        container.contentWindow.scrollTo(x, y);
                        if ((/(iPad|iPhone|iPod)/g).test(navigator.userAgent) && (container.contentWindow.scrollY !== y || container.contentWindow.scrollX !== x)) {
                            documentClone.documentElement.style.top = (-y) + "px";
                            documentClone.documentElement.style.left = (-x) + "px";
                            documentClone.documentElement.style.position = 'absolute';
                        }
                    }
                    resolve(container);
                }
            }, 50);
        };

        documentClone.open();
        documentClone.write("<!DOCTYPE html><html></html>");
        // Chrome scrolls the parent document for some reason after the write to the cloned window???
        restoreOwnerScroll(ownerDocument, x, y);
        documentClone.replaceChild(documentClone.adoptNode(documentElement), documentClone.documentElement);
        documentClone.close();
    });
};

},{"./log":13}],3:[function(_dereq_,module,exports){
// http://dev.w3.org/csswg/css-color/

function Color(value) {
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = null;
    var result = this.fromArray(value) ||
        this.namedColor(value) ||
        this.rgb(value) ||
        this.rgba(value) ||
        this.hex6(value) ||
        this.hex3(value);
}

Color.prototype.darken = function(amount) {
    var a = 1 - amount;
    return  new Color([
        Math.round(this.r * a),
        Math.round(this.g * a),
        Math.round(this.b * a),
        this.a
    ]);
};

Color.prototype.isTransparent = function() {
    return this.a === 0;
};

Color.prototype.isBlack = function() {
    return this.r === 0 && this.g === 0 && this.b === 0;
};

Color.prototype.fromArray = function(array) {
    if (Array.isArray(array)) {
        this.r = Math.min(array[0], 255);
        this.g = Math.min(array[1], 255);
        this.b = Math.min(array[2], 255);
        if (array.length > 3) {
            this.a = array[3];
        }
    }

    return (Array.isArray(array));
};

var _hex3 = /^#([a-f0-9]{3})$/i;

Color.prototype.hex3 = function(value) {
    var match = null;
    if ((match = value.match(_hex3)) !== null) {
        this.r = parseInt(match[1][0] + match[1][0], 16);
        this.g = parseInt(match[1][1] + match[1][1], 16);
        this.b = parseInt(match[1][2] + match[1][2], 16);
    }
    return match !== null;
};

var _hex6 = /^#([a-f0-9]{6})$/i;

Color.prototype.hex6 = function(value) {
    var match = null;
    if ((match = value.match(_hex6)) !== null) {
        this.r = parseInt(match[1].substring(0, 2), 16);
        this.g = parseInt(match[1].substring(2, 4), 16);
        this.b = parseInt(match[1].substring(4, 6), 16);
    }
    return match !== null;
};


var _rgb = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;

Color.prototype.rgb = function(value) {
    var match = null;
    if ((match = value.match(_rgb)) !== null) {
        this.r = Number(match[1]);
        this.g = Number(match[2]);
        this.b = Number(match[3]);
    }
    return match !== null;
};

var _rgba = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d?\.?\d+)\s*\)$/;

Color.prototype.rgba = function(value) {
    var match = null;
    if ((match = value.match(_rgba)) !== null) {
        this.r = Number(match[1]);
        this.g = Number(match[2]);
        this.b = Number(match[3]);
        this.a = Number(match[4]);
    }
    return match !== null;
};

Color.prototype.toString = function() {
    return this.a !== null && this.a !== 1 ?
    "rgba(" + [this.r, this.g, this.b, this.a].join(",") + ")" :
    "rgb(" + [this.r, this.g, this.b].join(",") + ")";
};

Color.prototype.namedColor = function(value) {
    value = value.toLowerCase();
    var color = colors[value];
    if (color) {
        this.r = color[0];
        this.g = color[1];
        this.b = color[2];
    } else if (value === "transparent") {
        this.r = this.g = this.b = this.a = 0;
        return true;
    }

    return !!color;
};

Color.prototype.isColor = true;

// JSON.stringify([].slice.call($$('.named-color-table tr'), 1).map(function(row) { return [row.childNodes[3].textContent, row.childNodes[5].textContent.trim().split(",").map(Number)] }).reduce(function(data, row) {data[row[0]] = row[1]; return data}, {}))
var colors = {
    "aliceblue": [240, 248, 255],
    "antiquewhite": [250, 235, 215],
    "aqua": [0, 255, 255],
    "aquamarine": [127, 255, 212],
    "azure": [240, 255, 255],
    "beige": [245, 245, 220],
    "bisque": [255, 228, 196],
    "black": [0, 0, 0],
    "blanchedalmond": [255, 235, 205],
    "blue": [0, 0, 255],
    "blueviolet": [138, 43, 226],
    "brown": [165, 42, 42],
    "burlywood": [222, 184, 135],
    "cadetblue": [95, 158, 160],
    "chartreuse": [127, 255, 0],
    "chocolate": [210, 105, 30],
    "coral": [255, 127, 80],
    "cornflowerblue": [100, 149, 237],
    "cornsilk": [255, 248, 220],
    "crimson": [220, 20, 60],
    "cyan": [0, 255, 255],
    "darkblue": [0, 0, 139],
    "darkcyan": [0, 139, 139],
    "darkgoldenrod": [184, 134, 11],
    "darkgray": [169, 169, 169],
    "darkgreen": [0, 100, 0],
    "darkgrey": [169, 169, 169],
    "darkkhaki": [189, 183, 107],
    "darkmagenta": [139, 0, 139],
    "darkolivegreen": [85, 107, 47],
    "darkorange": [255, 140, 0],
    "darkorchid": [153, 50, 204],
    "darkred": [139, 0, 0],
    "darksalmon": [233, 150, 122],
    "darkseagreen": [143, 188, 143],
    "darkslateblue": [72, 61, 139],
    "darkslategray": [47, 79, 79],
    "darkslategrey": [47, 79, 79],
    "darkturquoise": [0, 206, 209],
    "darkviolet": [148, 0, 211],
    "deeppink": [255, 20, 147],
    "deepskyblue": [0, 191, 255],
    "dimgray": [105, 105, 105],
    "dimgrey": [105, 105, 105],
    "dodgerblue": [30, 144, 255],
    "firebrick": [178, 34, 34],
    "floralwhite": [255, 250, 240],
    "forestgreen": [34, 139, 34],
    "fuchsia": [255, 0, 255],
    "gainsboro": [220, 220, 220],
    "ghostwhite": [248, 248, 255],
    "gold": [255, 215, 0],
    "goldenrod": [218, 165, 32],
    "gray": [128, 128, 128],
    "green": [0, 128, 0],
    "greenyellow": [173, 255, 47],
    "grey": [128, 128, 128],
    "honeydew": [240, 255, 240],
    "hotpink": [255, 105, 180],
    "indianred": [205, 92, 92],
    "indigo": [75, 0, 130],
    "ivory": [255, 255, 240],
    "khaki": [240, 230, 140],
    "lavender": [230, 230, 250],
    "lavenderblush": [255, 240, 245],
    "lawngreen": [124, 252, 0],
    "lemonchiffon": [255, 250, 205],
    "lightblue": [173, 216, 230],
    "lightcoral": [240, 128, 128],
    "lightcyan": [224, 255, 255],
    "lightgoldenrodyellow": [250, 250, 210],
    "lightgray": [211, 211, 211],
    "lightgreen": [144, 238, 144],
    "lightgrey": [211, 211, 211],
    "lightpink": [255, 182, 193],
    "lightsalmon": [255, 160, 122],
    "lightseagreen": [32, 178, 170],
    "lightskyblue": [135, 206, 250],
    "lightslategray": [119, 136, 153],
    "lightslategrey": [119, 136, 153],
    "lightsteelblue": [176, 196, 222],
    "lightyellow": [255, 255, 224],
    "lime": [0, 255, 0],
    "limegreen": [50, 205, 50],
    "linen": [250, 240, 230],
    "magenta": [255, 0, 255],
    "maroon": [128, 0, 0],
    "mediumaquamarine": [102, 205, 170],
    "mediumblue": [0, 0, 205],
    "mediumorchid": [186, 85, 211],
    "mediumpurple": [147, 112, 219],
    "mediumseagreen": [60, 179, 113],
    "mediumslateblue": [123, 104, 238],
    "mediumspringgreen": [0, 250, 154],
    "mediumturquoise": [72, 209, 204],
    "mediumvioletred": [199, 21, 133],
    "midnightblue": [25, 25, 112],
    "mintcream": [245, 255, 250],
    "mistyrose": [255, 228, 225],
    "moccasin": [255, 228, 181],
    "navajowhite": [255, 222, 173],
    "navy": [0, 0, 128],
    "oldlace": [253, 245, 230],
    "olive": [128, 128, 0],
    "olivedrab": [107, 142, 35],
    "orange": [255, 165, 0],
    "orangered": [255, 69, 0],
    "orchid": [218, 112, 214],
    "palegoldenrod": [238, 232, 170],
    "palegreen": [152, 251, 152],
    "paleturquoise": [175, 238, 238],
    "palevioletred": [219, 112, 147],
    "papayawhip": [255, 239, 213],
    "peachpuff": [255, 218, 185],
    "peru": [205, 133, 63],
    "pink": [255, 192, 203],
    "plum": [221, 160, 221],
    "powderblue": [176, 224, 230],
    "purple": [128, 0, 128],
    "rebeccapurple": [102, 51, 153],
    "red": [255, 0, 0],
    "rosybrown": [188, 143, 143],
    "royalblue": [65, 105, 225],
    "saddlebrown": [139, 69, 19],
    "salmon": [250, 128, 114],
    "sandybrown": [244, 164, 96],
    "seagreen": [46, 139, 87],
    "seashell": [255, 245, 238],
    "sienna": [160, 82, 45],
    "silver": [192, 192, 192],
    "skyblue": [135, 206, 235],
    "slateblue": [106, 90, 205],
    "slategray": [112, 128, 144],
    "slategrey": [112, 128, 144],
    "snow": [255, 250, 250],
    "springgreen": [0, 255, 127],
    "steelblue": [70, 130, 180],
    "tan": [210, 180, 140],
    "teal": [0, 128, 128],
    "thistle": [216, 191, 216],
    "tomato": [255, 99, 71],
    "turquoise": [64, 224, 208],
    "violet": [238, 130, 238],
    "wheat": [245, 222, 179],
    "white": [255, 255, 255],
    "whitesmoke": [245, 245, 245],
    "yellow": [255, 255, 0],
    "yellowgreen": [154, 205, 50]
};

module.exports = Color;

},{}],4:[function(_dereq_,module,exports){
var Support = _dereq_('./support');
var CanvasRenderer = _dereq_('./renderers/canvas');
var ImageLoader = _dereq_('./imageloader');
var NodeParser = _dereq_('./nodeparser');
var NodeContainer = _dereq_('./nodecontainer');
var log = _dereq_('./log');
var utils = _dereq_('./utils');
var createWindowClone = _dereq_('./clone');
var loadUrlDocument = _dereq_('./proxy').loadUrlDocument;
var getBounds = utils.getBounds;

var html2canvasNodeAttribute = "data-html2canvas-node";
var html2canvasCloneIndex = 0;

function html2canvas(nodeList, options) {
    var index = html2canvasCloneIndex++;
    options = options || {};
    if (options.logging) {
        log.options.logging = true;
        log.options.start = Date.now();
    }

    options.async = typeof(options.async) === "undefined" ? true : options.async;
    options.allowTaint = typeof(options.allowTaint) === "undefined" ? false : options.allowTaint;
    options.removeContainer = typeof(options.removeContainer) === "undefined" ? true : options.removeContainer;
    options.javascriptEnabled = typeof(options.javascriptEnabled) === "undefined" ? false : options.javascriptEnabled;
    options.imageTimeout = typeof(options.imageTimeout) === "undefined" ? 10000 : options.imageTimeout;
    options.renderer = typeof(options.renderer) === "function" ? options.renderer : CanvasRenderer;
    options.strict = !!options.strict;

    if (typeof(nodeList) === "string") {
        if (typeof(options.proxy) !== "string") {
            return Promise.reject("Proxy must be used when rendering url");
        }
        var width = options.width != null ? options.width : window.innerWidth;
        var height = options.height != null ? options.height : window.innerHeight;
        return loadUrlDocument(absoluteUrl(nodeList), options.proxy, document, width, height, options).then(function(container) {
            return renderWindow(container.contentWindow.document.documentElement, container, options, width, height);
        });
    }

    var node = ((nodeList === undefined) ? [document.documentElement] : ((nodeList.length) ? nodeList : [nodeList]))[0];
    node.setAttribute(html2canvasNodeAttribute + index, index);
    return renderDocument(node.ownerDocument, options, node.ownerDocument.defaultView.innerWidth, node.ownerDocument.defaultView.innerHeight, index).then(function(canvas) {
        if (typeof(options.onrendered) === "function") {
            log("options.onrendered is deprecated, html2canvas returns a Promise containing the canvas");
            options.onrendered(canvas);
        }
        return canvas;
    });
}

html2canvas.CanvasRenderer = CanvasRenderer;
html2canvas.NodeContainer = NodeContainer;
html2canvas.log = log;
html2canvas.utils = utils;

var html2canvasExport = (typeof(document) === "undefined" || typeof(Object.create) !== "function" || typeof(document.createElement("canvas").getContext) !== "function") ? function() {
    return Promise.reject("No canvas support");
} : html2canvas;

module.exports = html2canvasExport;

if (typeof(define) === 'function' && define.amd) {
    define('html2canvas', [], function() {
        return html2canvasExport;
    });
}

function renderDocument(document, options, windowWidth, windowHeight, html2canvasIndex) {
    return createWindowClone(document, document, windowWidth, windowHeight, options, document.defaultView.pageXOffset, document.defaultView.pageYOffset).then(function(container) {
        log("Document cloned");
        var attributeName = html2canvasNodeAttribute + html2canvasIndex;
        var selector = "[" + attributeName + "='" + html2canvasIndex + "']";
        document.querySelector(selector).removeAttribute(attributeName);
        var clonedWindow = container.contentWindow;
        var node = clonedWindow.document.querySelector(selector);
        var oncloneHandler = (typeof(options.onclone) === "function") ? Promise.resolve(options.onclone(clonedWindow.document)) : Promise.resolve(true);
        return oncloneHandler.then(function() {
            return renderWindow(node, container, options, windowWidth, windowHeight);
        });
    });
}

function renderWindow(node, container, options, windowWidth, windowHeight) {
    var clonedWindow = container.contentWindow;
    var support = new Support(clonedWindow.document);
    var imageLoader = new ImageLoader(options, support);
    var bounds = getBounds(node);
    var width = options.type === "view" ? windowWidth : bounds.right + 1;
    var height = options.type === "view" ? windowHeight : bounds.bottom + 1;
    var renderer = new options.renderer(width, height, imageLoader, options, document);
    var parser = new NodeParser(node, renderer, support, imageLoader, options);
    return parser.ready.then(function() {
        log("Finished rendering");
        var canvas;

        if (options.type === "view") {
            canvas = crop(renderer.canvas, {width: renderer.canvas.width, height: renderer.canvas.height, top: 0, left: 0, x: 0, y: 0});
        } else if (node === clonedWindow.document.body || node === clonedWindow.document.documentElement || options.canvas != null) {
            canvas = renderer.canvas;
        } else if (options.scale) {
            var origBounds = {width: options.width != null ? options.width : bounds.width, height: options.height != null ? options.height : bounds.height, top: bounds.top, left: bounds.left, x: 0, y: 0};
            var cropBounds = {};
            for (var key in origBounds) {
                if (origBounds.hasOwnProperty(key)) { cropBounds[key] = origBounds[key] * options.scale; }
            }
            canvas = crop(renderer.canvas, cropBounds);
            canvas.style.width = origBounds.width + 'px';
            canvas.style.height = origBounds.height + 'px';
        } else {
            canvas = crop(renderer.canvas, {width:  options.width != null ? options.width : bounds.width, height: options.height != null ? options.height : bounds.height, top: bounds.top, left: bounds.left, x: 0, y: 0});
        }

        cleanupContainer(container, options);
        return canvas;
    });
}

function cleanupContainer(container, options) {
    if (options.removeContainer) {
        container.parentNode.removeChild(container);
        log("Cleaned up container");
    }
}

function crop(canvas, bounds) {
    var croppedCanvas = document.createElement("canvas");
    var x1 = Math.min(canvas.width - 1, Math.max(0, bounds.left));
    var x2 = Math.min(canvas.width, Math.max(1, bounds.left + bounds.width));
    var y1 = Math.min(canvas.height - 1, Math.max(0, bounds.top));
    var y2 = Math.min(canvas.height, Math.max(1, bounds.top + bounds.height));
    croppedCanvas.width = bounds.width;
    croppedCanvas.height =  bounds.height;
    var width = x2-x1;
    var height = y2-y1;
    log("Cropping canvas at:", "left:", bounds.left, "top:", bounds.top, "width:", width, "height:", height);
    log("Resulting crop with width", bounds.width, "and height", bounds.height, "with x", x1, "and y", y1);
    croppedCanvas.getContext("2d").drawImage(canvas, x1, y1, width, height, bounds.x, bounds.y, width, height);
    return croppedCanvas;
}

function absoluteUrl(url) {
    var link = document.createElement("a");
    link.href = url;
    link.href = link.href;
    return link;
}

},{"./clone":2,"./imageloader":11,"./log":13,"./nodecontainer":14,"./nodeparser":15,"./proxy":16,"./renderers/canvas":20,"./support":22,"./utils":26}],5:[function(_dereq_,module,exports){
var log = _dereq_('./log');
var smallImage = _dereq_('./utils').smallImage;

function DummyImageContainer(src) {
    this.src = src;
    log("DummyImageContainer for", src);
    if (!this.promise || !this.image) {
        log("Initiating DummyImageContainer");
        DummyImageContainer.prototype.image = new Image();
        var image = this.image;
        DummyImageContainer.prototype.promise = new Promise(function(resolve, reject) {
            image.onload = resolve;
            image.onerror = reject;
            image.src = smallImage();
            if (image.complete === true) {
                resolve(image);
            }
        });
    }
}

module.exports = DummyImageContainer;

},{"./log":13,"./utils":26}],6:[function(_dereq_,module,exports){
var smallImage = _dereq_('./utils').smallImage;

function Font(family, size) {
    var container = document.createElement('div'),
        img = document.createElement('img'),
        span = document.createElement('span'),
        sampleText = 'Hidden Text',
        baseline,
        middle;

    container.style.visibility = "hidden";
    container.style.fontFamily = family;
    container.style.fontSize = size;
    container.style.margin = 0;
    container.style.padding = 0;

    document.body.appendChild(container);

    img.src = smallImage();
    img.width = 1;
    img.height = 1;

    img.style.margin = 0;
    img.style.padding = 0;
    img.style.verticalAlign = "baseline";

    span.style.fontFamily = family;
    span.style.fontSize = size;
    span.style.margin = 0;
    span.style.padding = 0;

    span.appendChild(document.createTextNode(sampleText));
    container.appendChild(span);
    container.appendChild(img);
    baseline = (img.offsetTop - span.offsetTop) + 1;

    container.removeChild(span);
    container.appendChild(document.createTextNode(sampleText));

    container.style.lineHeight = "normal";
    img.style.verticalAlign = "super";

    middle = (img.offsetTop-container.offsetTop) + 1;

    document.body.removeChild(container);

    this.baseline = baseline;
    this.lineWidth = 1;
    this.middle = middle;
}

module.exports = Font;

},{"./utils":26}],7:[function(_dereq_,module,exports){
var Font = _dereq_('./font');

function FontMetrics() {
    this.data = {};
}

FontMetrics.prototype.getMetrics = function(family, size) {
    if (this.data[family + "-" + size] === undefined) {
        this.data[family + "-" + size] = new Font(family, size);
    }
    return this.data[family + "-" + size];
};

module.exports = FontMetrics;

},{"./font":6}],8:[function(_dereq_,module,exports){
var utils = _dereq_('./utils');
var getBounds = utils.getBounds;
var loadUrlDocument = _dereq_('./proxy').loadUrlDocument;

function FrameContainer(container, sameOrigin, options) {
    this.image = null;
    this.src = container;
    var self = this;
    var bounds = getBounds(container);
    this.promise = (!sameOrigin ? this.proxyLoad(options.proxy, bounds, options) : new Promise(function(resolve) {
        if (container.contentWindow.document.URL === "about:blank" || container.contentWindow.document.documentElement == null) {
            container.contentWindow.onload = container.onload = function() {
                resolve(container);
            };
        } else {
            resolve(container);
        }
    })).then(function(container) {
        var html2canvas = _dereq_('./core');
        return html2canvas(container.contentWindow.document.documentElement, {type: 'view', width: container.width, height: container.height, proxy: options.proxy, javascriptEnabled: options.javascriptEnabled, removeContainer: options.removeContainer, allowTaint: options.allowTaint, imageTimeout: options.imageTimeout / 2});
    }).then(function(canvas) {
        return self.image = canvas;
    });
}

FrameContainer.prototype.proxyLoad = function(proxy, bounds, options) {
    var container = this.src;
    return loadUrlDocument(container.src, proxy, container.ownerDocument, bounds.width, bounds.height, options);
};

module.exports = FrameContainer;

},{"./core":4,"./proxy":16,"./utils":26}],9:[function(_dereq_,module,exports){
function GradientContainer(imageData) {
    this.src = imageData.value;
    this.colorStops = [];
    this.type = null;
    this.x0 = 0.5;
    this.y0 = 0.5;
    this.x1 = 0.5;
    this.y1 = 0.5;
    this.promise = Promise.resolve(true);
}

GradientContainer.TYPES = {
    LINEAR: 1,
    RADIAL: 2
};

// TODO: support hsl[a], negative %/length values
// TODO: support <angle> (e.g. -?\d{1,3}(?:\.\d+)deg, etc. : https://developer.mozilla.org/docs/Web/CSS/angle )
GradientContainer.REGEXP_COLORSTOP = /^\s*(rgba?\(\s*\d{1,3},\s*\d{1,3},\s*\d{1,3}(?:,\s*[0-9\.]+)?\s*\)|[a-z]{3,20}|#[a-f0-9]{3,6})(?:\s+(\d{1,3}(?:\.\d+)?)(%|px)?)?(?:\s|$)/i;

module.exports = GradientContainer;

},{}],10:[function(_dereq_,module,exports){
function ImageContainer(src, cors) {
    this.src = src;
    this.image = new Image();
    var self = this;
    this.tainted = null;
    this.promise = new Promise(function(resolve, reject) {
        self.image.onload = resolve;
        self.image.onerror = reject;
        if (cors) {
            self.image.crossOrigin = "anonymous";
        }
        self.image.src = src;
        if (self.image.complete === true) {
            resolve(self.image);
        }
    });
}

module.exports = ImageContainer;

},{}],11:[function(_dereq_,module,exports){
var log = _dereq_('./log');
var ImageContainer = _dereq_('./imagecontainer');
var DummyImageContainer = _dereq_('./dummyimagecontainer');
var ProxyImageContainer = _dereq_('./proxyimagecontainer');
var FrameContainer = _dereq_('./framecontainer');
var SVGContainer = _dereq_('./svgcontainer');
var SVGNodeContainer = _dereq_('./svgnodecontainer');
var LinearGradientContainer = _dereq_('./lineargradientcontainer');
var WebkitGradientContainer = _dereq_('./webkitgradientcontainer');
var bind = _dereq_('./utils').bind;

function ImageLoader(options, support) {
    this.link = null;
    this.options = options;
    this.support = support;
    this.origin = this.getOrigin(window.location.href);
}

ImageLoader.prototype.findImages = function(nodes) {
    var images = [];
    nodes.reduce(function(imageNodes, container) {
        switch(container.node.nodeName) {
        case "IMG":
            return imageNodes.concat([{
                args: [container.node.src],
                method: "url"
            }]);
        case "svg":
        case "IFRAME":
            return imageNodes.concat([{
                args: [container.node],
                method: container.node.nodeName
            }]);
        }
        return imageNodes;
    }, []).forEach(this.addImage(images, this.loadImage), this);
    return images;
};

ImageLoader.prototype.findBackgroundImage = function(images, container) {
    container.parseBackgroundImages().filter(this.hasImageBackground).forEach(this.addImage(images, this.loadImage), this);
    return images;
};

ImageLoader.prototype.addImage = function(images, callback) {
    return function(newImage) {
        newImage.args.forEach(function(image) {
            if (!this.imageExists(images, image)) {
                images.splice(0, 0, callback.call(this, newImage));
                log('Added image #' + (images.length), typeof(image) === "string" ? image.substring(0, 100) : image);
            }
        }, this);
    };
};

ImageLoader.prototype.hasImageBackground = function(imageData) {
    return imageData.method !== "none";
};

ImageLoader.prototype.loadImage = function(imageData) {
    if (imageData.method === "url") {
        var src = imageData.args[0];
        if (this.isSVG(src) && !this.support.svg && !this.options.allowTaint) {
            return new SVGContainer(src);
        } else if (src.match(/data:image\/.*;base64,/i)) {
            return new ImageContainer(src.replace(/url\(['"]{0,}|['"]{0,}\)$/ig, ''), false);
        } else if (this.isSameOrigin(src) || this.options.allowTaint === true || this.isSVG(src)) {
            return new ImageContainer(src, false);
        } else if (this.support.cors && !this.options.allowTaint && this.options.useCORS) {
            return new ImageContainer(src, true);
        } else if (this.options.proxy) {
            return new ProxyImageContainer(src, this.options.proxy);
        } else {
            return new DummyImageContainer(src);
        }
    } else if (imageData.method === "linear-gradient") {
        return new LinearGradientContainer(imageData);
    } else if (imageData.method === "gradient") {
        return new WebkitGradientContainer(imageData);
    } else if (imageData.method === "svg") {
        return new SVGNodeContainer(imageData.args[0], this.support.svg);
    } else if (imageData.method === "IFRAME") {
        return new FrameContainer(imageData.args[0], this.isSameOrigin(imageData.args[0].src), this.options);
    } else {
        return new DummyImageContainer(imageData);
    }
};

ImageLoader.prototype.isSVG = function(src) {
    return src.substring(src.length - 3).toLowerCase() === "svg" || SVGContainer.prototype.isInline(src);
};

ImageLoader.prototype.imageExists = function(images, src) {
    return images.some(function(image) {
        return image.src === src;
    });
};

ImageLoader.prototype.isSameOrigin = function(url) {
    return (this.getOrigin(url) === this.origin);
};

ImageLoader.prototype.getOrigin = function(url) {
    var link = this.link || (this.link = document.createElement("a"));
    link.href = url;
    link.href = link.href; // IE9, LOL! - http://jsfiddle.net/niklasvh/2e48b/
    return link.protocol + link.hostname + link.port;
};

ImageLoader.prototype.getPromise = function(container) {
    return this.timeout(container, this.options.imageTimeout)['catch'](function() {
        var dummy = new DummyImageContainer(container.src);
        return dummy.promise.then(function(image) {
            container.image = image;
        });
    });
};

ImageLoader.prototype.get = function(src) {
    var found = null;
    return this.images.some(function(img) {
        return (found = img).src === src;
    }) ? found : null;
};

ImageLoader.prototype.fetch = function(nodes) {
    this.images = nodes.reduce(bind(this.findBackgroundImage, this), this.findImages(nodes));
    this.images.forEach(function(image, index) {
        image.promise.then(function() {
            log("Succesfully loaded image #"+ (index+1), image);
        }, function(e) {
            log("Failed loading image #"+ (index+1), image, e);
        });
    });
    this.ready = Promise.all(this.images.map(this.getPromise, this));
    log("Finished searching images");
    return this;
};

ImageLoader.prototype.timeout = function(container, timeout) {
    var timer;
    var promise = Promise.race([container.promise, new Promise(function(res, reject) {
        timer = setTimeout(function() {
            log("Timed out loading image", container);
            reject(container);
        }, timeout);
    })]).then(function(container) {
        clearTimeout(timer);
        return container;
    });
    promise['catch'](function() {
        clearTimeout(timer);
    });
    return promise;
};

module.exports = ImageLoader;

},{"./dummyimagecontainer":5,"./framecontainer":8,"./imagecontainer":10,"./lineargradientcontainer":12,"./log":13,"./proxyimagecontainer":17,"./svgcontainer":23,"./svgnodecontainer":24,"./utils":26,"./webkitgradientcontainer":27}],12:[function(_dereq_,module,exports){
var GradientContainer = _dereq_('./gradientcontainer');
var Color = _dereq_('./color');

function LinearGradientContainer(imageData) {
    GradientContainer.apply(this, arguments);
    this.type = GradientContainer.TYPES.LINEAR;

    var hasDirection = LinearGradientContainer.REGEXP_DIRECTION.test( imageData.args[0] ) ||
        !GradientContainer.REGEXP_COLORSTOP.test( imageData.args[0] );

    if (hasDirection) {
        imageData.args[0].split(/\s+/).reverse().forEach(function(position, index) {
            switch(position) {
            case "left":
                this.x0 = 0;
                this.x1 = 1;
                break;
            case "top":
                this.y0 = 0;
                this.y1 = 1;
                break;
            case "right":
                this.x0 = 1;
                this.x1 = 0;
                break;
            case "bottom":
                this.y0 = 1;
                this.y1 = 0;
                break;
            case "to":
                var y0 = this.y0;
                var x0 = this.x0;
                this.y0 = this.y1;
                this.x0 = this.x1;
                this.x1 = x0;
                this.y1 = y0;
                break;
            case "center":
                break; // centered by default
            // Firefox internally converts position keywords to percentages:
            // http://www.w3.org/TR/2010/WD-CSS2-20101207/colors.html#propdef-background-position
            default: // percentage or absolute length
                // TODO: support absolute start point positions (e.g., use bounds to convert px to a ratio)
                var ratio = parseFloat(position, 10) * 1e-2;
                if (isNaN(ratio)) { // invalid or unhandled value
                    break;
                }
                if (index === 0) {
                    this.y0 = ratio;
                    this.y1 = 1 - this.y0;
                } else {
                    this.x0 = ratio;
                    this.x1 = 1 - this.x0;
                }
                break;
            }
        }, this);
    } else {
        this.y0 = 0;
        this.y1 = 1;
    }

    this.colorStops = imageData.args.slice(hasDirection ? 1 : 0).map(function(colorStop) {
        var colorStopMatch = colorStop.match(GradientContainer.REGEXP_COLORSTOP);
        var value = +colorStopMatch[2];
        var unit = value === 0 ? "%" : colorStopMatch[3]; // treat "0" as "0%"
        return {
            color: new Color(colorStopMatch[1]),
            // TODO: support absolute stop positions (e.g., compute gradient line length & convert px to ratio)
            stop: unit === "%" ? value / 100 : null
        };
    });

    if (this.colorStops[0].stop === null) {
        this.colorStops[0].stop = 0;
    }

    if (this.colorStops[this.colorStops.length - 1].stop === null) {
        this.colorStops[this.colorStops.length - 1].stop = 1;
    }

    // calculates and fills-in explicit stop positions when omitted from rule
    this.colorStops.forEach(function(colorStop, index) {
        if (colorStop.stop === null) {
            this.colorStops.slice(index).some(function(find, count) {
                if (find.stop !== null) {
                    colorStop.stop = ((find.stop - this.colorStops[index - 1].stop) / (count + 1)) + this.colorStops[index - 1].stop;
                    return true;
                } else {
                    return false;
                }
            }, this);
        }
    }, this);
}

LinearGradientContainer.prototype = Object.create(GradientContainer.prototype);

// TODO: support <angle> (e.g. -?\d{1,3}(?:\.\d+)deg, etc. : https://developer.mozilla.org/docs/Web/CSS/angle )
LinearGradientContainer.REGEXP_DIRECTION = /^\s*(?:to|left|right|top|bottom|center|\d{1,3}(?:\.\d+)?%?)(?:\s|$)/i;

module.exports = LinearGradientContainer;

},{"./color":3,"./gradientcontainer":9}],13:[function(_dereq_,module,exports){
var logger = function() {
    if (logger.options.logging && window.console && window.console.log) {
        Function.prototype.bind.call(window.console.log, (window.console)).apply(window.console, [(Date.now() - logger.options.start) + "ms", "html2canvas:"].concat([].slice.call(arguments, 0)));
    }
};

logger.options = {logging: false};
module.exports = logger;

},{}],14:[function(_dereq_,module,exports){
var Color = _dereq_('./color');
var utils = _dereq_('./utils');
var getBounds = utils.getBounds;
var parseBackgrounds = utils.parseBackgrounds;
var offsetBounds = utils.offsetBounds;

function NodeContainer(node, parent) {
    this.node = node;
    this.parent = parent;
    this.stack = null;
    this.bounds = null;
    this.borders = null;
    this.clip = [];
    this.backgroundClip = [];
    this.offsetBounds = null;
    this.visible = null;
    this.computedStyles = null;
    this.colors = {};
    this.styles = {};
    this.backgroundImages = null;
    this.transformData = null;
    this.transformMatrix = null;
    this.isPseudoElement = false;
    this.opacity = null;
}

NodeContainer.prototype.cloneTo = function(stack) {
    stack.visible = this.visible;
    stack.borders = this.borders;
    stack.bounds = this.bounds;
    stack.clip = this.clip;
    stack.backgroundClip = this.backgroundClip;
    stack.computedStyles = this.computedStyles;
    stack.styles = this.styles;
    stack.backgroundImages = this.backgroundImages;
    stack.opacity = this.opacity;
};

NodeContainer.prototype.getOpacity = function() {
    return this.opacity === null ? (this.opacity = this.cssFloat('opacity')) : this.opacity;
};

NodeContainer.prototype.assignStack = function(stack) {
    this.stack = stack;
    stack.children.push(this);
};

NodeContainer.prototype.isElementVisible = function() {
    return this.node.nodeType === Node.TEXT_NODE ? this.parent.visible : (
        this.css('display') !== "none" &&
        this.css('visibility') !== "hidden" &&
        !this.node.hasAttribute("data-html2canvas-ignore") &&
        (this.node.nodeName !== "INPUT" || this.node.getAttribute("type") !== "hidden")
    );
};

NodeContainer.prototype.css = function(attribute) {
    if (!this.computedStyles) {
        this.computedStyles = this.isPseudoElement ? this.parent.computedStyle(this.before ? ":before" : ":after") : this.computedStyle(null);
    }

    return this.styles[attribute] || (this.styles[attribute] = this.computedStyles[attribute]);
};

NodeContainer.prototype.prefixedCss = function(attribute) {
    var prefixes = ["webkit", "moz", "ms", "o"];
    var value = this.css(attribute);
    if (value === undefined) {
        prefixes.some(function(prefix) {
            value = this.css(prefix + attribute.substr(0, 1).toUpperCase() + attribute.substr(1));
            return value !== undefined;
        }, this);
    }
    return value === undefined ? null : value;
};

NodeContainer.prototype.computedStyle = function(type) {
    return this.node.ownerDocument.defaultView.getComputedStyle(this.node, type);
};

NodeContainer.prototype.cssInt = function(attribute) {
    var value = parseInt(this.css(attribute), 10);
    return (isNaN(value)) ? 0 : value; // borders in old IE are throwing 'medium' for demo.html
};

NodeContainer.prototype.color = function(attribute) {
    return this.colors[attribute] || (this.colors[attribute] = new Color(this.css(attribute)));
};

NodeContainer.prototype.cssFloat = function(attribute) {
    var value = parseFloat(this.css(attribute));
    return (isNaN(value)) ? 0 : value;
};

NodeContainer.prototype.fontWeight = function() {
    var weight = this.css("fontWeight");
    switch(parseInt(weight, 10)){
    case 401:
        weight = "bold";
        break;
    case 400:
        weight = "normal";
        break;
    }
    return weight;
};

NodeContainer.prototype.parseClip = function() {
    var matches = this.css('clip').match(this.CLIP);
    if (matches) {
        return {
            top: parseInt(matches[1], 10),
            right: parseInt(matches[2], 10),
            bottom: parseInt(matches[3], 10),
            left: parseInt(matches[4], 10)
        };
    }
    return null;
};

NodeContainer.prototype.parseBackgroundImages = function() {
    return this.backgroundImages || (this.backgroundImages = parseBackgrounds(this.css("backgroundImage")));
};

NodeContainer.prototype.cssList = function(property, index) {
    var value = (this.css(property) || '').split(',');
    value = value[index || 0] || value[0] || 'auto';
    value = value.trim().split(' ');
    if (value.length === 1) {
        value = [value[0], isPercentage(value[0]) ? 'auto' : value[0]];
    }
    return value;
};

NodeContainer.prototype.parseBackgroundSize = function(bounds, image, index) {
    var size = this.cssList("backgroundSize", index);
    var width, height;

    if (isPercentage(size[0])) {
        width = bounds.width * parseFloat(size[0]) / 100;
    } else if (/contain|cover/.test(size[0])) {
        var targetRatio = bounds.width / bounds.height, currentRatio = image.width / image.height;
        return (targetRatio < currentRatio ^ size[0] === 'contain') ?  {width: bounds.height * currentRatio, height: bounds.height} : {width: bounds.width, height: bounds.width / currentRatio};
    } else {
        width = parseInt(size[0], 10);
    }

    if (size[0] === 'auto' && size[1] === 'auto') {
        height = image.height;
    } else if (size[1] === 'auto') {
        height = width / image.width * image.height;
    } else if (isPercentage(size[1])) {
        height =  bounds.height * parseFloat(size[1]) / 100;
    } else {
        height = parseInt(size[1], 10);
    }

    if (size[0] === 'auto') {
        width = height / image.height * image.width;
    }

    return {width: width, height: height};
};

NodeContainer.prototype.parseBackgroundPosition = function(bounds, image, index, backgroundSize) {
    var position = this.cssList('backgroundPosition', index);
    var left, top;

    if (isPercentage(position[0])){
        left = (bounds.width - (backgroundSize || image).width) * (parseFloat(position[0]) / 100);
    } else {
        left = parseInt(position[0], 10);
    }

    if (position[1] === 'auto') {
        top = left / image.width * image.height;
    } else if (isPercentage(position[1])){
        top =  (bounds.height - (backgroundSize || image).height) * parseFloat(position[1]) / 100;
    } else {
        top = parseInt(position[1], 10);
    }

    if (position[0] === 'auto') {
        left = top / image.height * image.width;
    }

    return {left: left, top: top};
};

NodeContainer.prototype.parseBackgroundRepeat = function(index) {
    return this.cssList("backgroundRepeat", index)[0];
};

NodeContainer.prototype.parseTextShadows = function() {
    var textShadow = this.css("textShadow");
    var results = [];

    if (textShadow && textShadow !== 'none') {
        var shadows = textShadow.match(this.TEXT_SHADOW_PROPERTY);
        for (var i = 0; shadows && (i < shadows.length); i++) {
            var s = shadows[i].match(this.TEXT_SHADOW_VALUES);
            results.push({
                color: new Color(s[0]),
                offsetX: s[1] ? parseFloat(s[1].replace('px', '')) : 0,
                offsetY: s[2] ? parseFloat(s[2].replace('px', '')) : 0,
                blur: s[3] ? s[3].replace('px', '') : 0
            });
        }
    }
    return results;
};

NodeContainer.prototype.parseTransform = function() {
    if (!this.transformData) {
        if (this.hasTransform()) {
            var offset = this.parseBounds();
            var origin = this.prefixedCss("transformOrigin").split(" ").map(removePx).map(asFloat);
            origin[0] += offset.left;
            origin[1] += offset.top;
            this.transformData = {
                origin: origin,
                matrix: this.parseTransformMatrix()
            };
        } else {
            this.transformData = {
                origin: [0, 0],
                matrix: [1, 0, 0, 1, 0, 0]
            };
        }
    }
    return this.transformData;
};

NodeContainer.prototype.parseTransformMatrix = function() {
    if (!this.transformMatrix) {
        var transform = this.prefixedCss("transform");
        var matrix = transform ? parseMatrix(transform.match(this.MATRIX_PROPERTY)) : null;
        this.transformMatrix = matrix ? matrix : [1, 0, 0, 1, 0, 0];
    }
    return this.transformMatrix;
};

NodeContainer.prototype.inverseTransform = function() {
    var transformData = this.parseTransform();
    return { origin: transformData.origin, matrix: matrixInverse(transformData.matrix) };
};

NodeContainer.prototype.parseBounds = function() {
    return this.bounds || (this.bounds = this.hasTransform() ? offsetBounds(this.node) : getBounds(this.node));
};

NodeContainer.prototype.hasTransform = function() {
    return this.parseTransformMatrix().join(",") !== "1,0,0,1,0,0" || (this.parent && this.parent.hasTransform());
};

NodeContainer.prototype.getValue = function() {
    var value = this.node.value || "";
    if (this.node.tagName === "SELECT") {
        value = selectionValue(this.node);
    } else if (this.node.type === "password") {
        value = Array(value.length + 1).join('\u2022'); // jshint ignore:line
    }
    return value.length === 0 ? (this.node.placeholder || "") : value;
};

NodeContainer.prototype.MATRIX_PROPERTY = /(matrix|matrix3d)\((.+)\)/;
NodeContainer.prototype.TEXT_SHADOW_PROPERTY = /((rgba|rgb)\([^\)]+\)(\s-?\d+px){0,})/g;
NodeContainer.prototype.TEXT_SHADOW_VALUES = /(-?\d+px)|(#.+)|(rgb\(.+\))|(rgba\(.+\))/g;
NodeContainer.prototype.CLIP = /^rect\((\d+)px,? (\d+)px,? (\d+)px,? (\d+)px\)$/;

function selectionValue(node) {
    var option = node.options[node.selectedIndex || 0];
    return option ? (option.text || "") : "";
}

function parseMatrix(match) {
    if (match && match[1] === "matrix") {
        return match[2].split(",").map(function(s) {
            return parseFloat(s.trim());
        });
    } else if (match && match[1] === "matrix3d") {
        var matrix3d = match[2].split(",").map(function(s) {
          return parseFloat(s.trim());
        });
        return [matrix3d[0], matrix3d[1], matrix3d[4], matrix3d[5], matrix3d[12], matrix3d[13]];
    }
}

function matrixInverse(m) {
    // This is programmed specifically for transform matrices, which have a fixed structure.
    var a = m[0], b = m[2], c = m[4], d = m[1], e = m[3], f = m[5];
    var det = a*e - b*d;
    var M = [e, -d, -b, a, b*f-c*e, c*d-a*f].map(function(val) { return val/det; });
    return M;
}

function isPercentage(value) {
    return value.toString().indexOf("%") !== -1;
}

function removePx(str) {
    return str.replace("px", "");
}

function asFloat(str) {
    return parseFloat(str);
}

module.exports = NodeContainer;

},{"./color":3,"./utils":26}],15:[function(_dereq_,module,exports){
var log = _dereq_('./log');
var punycode = _dereq_('punycode');
var NodeContainer = _dereq_('./nodecontainer');
var TextContainer = _dereq_('./textcontainer');
var PseudoElementContainer = _dereq_('./pseudoelementcontainer');
var FontMetrics = _dereq_('./fontmetrics');
var Color = _dereq_('./color');
var StackingContext = _dereq_('./stackingcontext');
var utils = _dereq_('./utils');
var bind = utils.bind;
var getBounds = utils.getBounds;
var parseBackgrounds = utils.parseBackgrounds;
var offsetBounds = utils.offsetBounds;

function NodeParser(element, renderer, support, imageLoader, options) {
    log("Starting NodeParser");
    this.renderer = renderer;
    this.options = options;
    this.range = null;
    this.support = support;
    this.renderQueue = [];
    this.stack = new StackingContext(true, 1, element.ownerDocument, null);
    var parent = new NodeContainer(element, null);
    if (options.background) {
        renderer.rectangle(0, 0, renderer.width, renderer.height, new Color(options.background));
    }
    if (element === element.ownerDocument.documentElement) {
        // http://www.w3.org/TR/css3-background/#special-backgrounds
        var canvasBackground = new NodeContainer(parent.color('backgroundColor').isTransparent() ? element.ownerDocument.body : element.ownerDocument.documentElement, null);
        renderer.rectangle(0, 0, renderer.width, renderer.height, canvasBackground.color('backgroundColor'));
    }
    parent.visibile = parent.isElementVisible();
    this.createPseudoHideStyles(element.ownerDocument);
    this.disableAnimations(element.ownerDocument);
    this.nodes = flatten([parent].concat(this.getChildren(parent)).filter(function(container) {
        return container.visible = container.isElementVisible();
    }).map(this.getPseudoElements, this));
    this.fontMetrics = new FontMetrics();
    log("Fetched nodes, total:", this.nodes.length);
    log("Calculate overflow clips");
    this.calculateOverflowClips();
    log("Start fetching images");
    this.images = imageLoader.fetch(this.nodes.filter(isElement));
    this.ready = this.images.ready.then(bind(function() {
        log("Images loaded, starting parsing");
        log("Creating stacking contexts");
        this.createStackingContexts();
        log("Sorting stacking contexts");
        this.sortStackingContexts(this.stack);
        this.parse(this.stack);
        log("Render queue created with " + this.renderQueue.length + " items");
        return new Promise(bind(function(resolve) {
            if (!options.async) {
                this.renderQueue.forEach(this.paint, this);
                resolve();
            } else if (typeof(options.async) === "function") {
                options.async.call(this, this.renderQueue, resolve);
            } else if (this.renderQueue.length > 0){
                this.renderIndex = 0;
                this.asyncRenderer(this.renderQueue, resolve);
            } else {
                resolve();
            }
        }, this));
    }, this));
}

NodeParser.prototype.calculateOverflowClips = function() {
    this.nodes.forEach(function(container) {
        if (isElement(container)) {
            if (isPseudoElement(container)) {
                container.appendToDOM();
            }
            container.borders = this.parseBorders(container);
            var clip = (container.css('overflow') === "hidden") ? [container.borders.clip] : [];
            var cssClip = container.parseClip();
            if (cssClip && ["absolute", "fixed"].indexOf(container.css('position')) !== -1) {
                clip.push([["rect",
                        container.bounds.left + cssClip.left,
                        container.bounds.top + cssClip.top,
                        cssClip.right - cssClip.left,
                        cssClip.bottom - cssClip.top
                ]]);
            }
            container.clip = hasParentClip(container) ? container.parent.clip.concat(clip) : clip;
            container.backgroundClip = (container.css('overflow') !== "hidden") ? container.clip.concat([container.borders.clip]) : container.clip;
            if (isPseudoElement(container)) {
                container.cleanDOM();
            }
        } else if (isTextNode(container)) {
            container.clip = hasParentClip(container) ? container.parent.clip : [];
        }
        if (!isPseudoElement(container)) {
            container.bounds = null;
        }
    }, this);
};

function hasParentClip(container) {
    return container.parent && container.parent.clip.length;
}

NodeParser.prototype.asyncRenderer = function(queue, resolve, asyncTimer) {
    asyncTimer = asyncTimer || Date.now();
    this.paint(queue[this.renderIndex++]);
    if (queue.length === this.renderIndex) {
        resolve();
    } else if (asyncTimer + 20 > Date.now()) {
        this.asyncRenderer(queue, resolve, asyncTimer);
    } else {
        setTimeout(bind(function() {
            this.asyncRenderer(queue, resolve);
        }, this), 0);
    }
};

NodeParser.prototype.createPseudoHideStyles = function(document) {
    this.createStyles(document, '.' + PseudoElementContainer.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE + ':before { content: "" !important; display: none !important; }' +
        '.' + PseudoElementContainer.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER + ':after { content: "" !important; display: none !important; }');
};

NodeParser.prototype.disableAnimations = function(document) {
    this.createStyles(document, '* { -webkit-animation: none !important; -moz-animation: none !important; -o-animation: none !important; animation: none !important; ' +
        '-webkit-transition: none !important; -moz-transition: none !important; -o-transition: none !important; transition: none !important;}');
};

NodeParser.prototype.createStyles = function(document, styles) {
    var hidePseudoElements = document.createElement('style');
    hidePseudoElements.innerHTML = styles;
    document.body.appendChild(hidePseudoElements);
};

NodeParser.prototype.getPseudoElements = function(container) {
    var nodes = [[container]];
    if (container.node.nodeType === Node.ELEMENT_NODE) {
        var before = this.getPseudoElement(container, ":before");
        var after = this.getPseudoElement(container, ":after");

        if (before) {
            nodes.push(before);
        }

        if (after) {
            nodes.push(after);
        }
    }
    return flatten(nodes);
};

function toCamelCase(str) {
    return str.replace(/(\-[a-z])/g, function(match){
        return match.toUpperCase().replace('-','');
    });
}

NodeParser.prototype.getPseudoElement = function(container, type) {
    var style = container.computedStyle(type);
    if(!style || !style.content || style.content === "none" || style.content === "-moz-alt-content" || style.display === "none") {
        return null;
    }

    var content = stripQuotes(style.content);
    var isImage = content.substr(0, 3) === 'url';
    var pseudoNode = document.createElement(isImage ? 'img' : 'html2canvaspseudoelement');
    var pseudoContainer = new PseudoElementContainer(pseudoNode, container, type);

    for (var i = style.length-1; i >= 0; i--) {
        var property = toCamelCase(style.item(i));
        pseudoNode.style[property] = style[property];
    }

    pseudoNode.className = PseudoElementContainer.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE + " " + PseudoElementContainer.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER;

    if (isImage) {
        pseudoNode.src = parseBackgrounds(content)[0].args[0];
        return [pseudoContainer];
    } else {
        var text = document.createTextNode(content);
        pseudoNode.appendChild(text);
        return [pseudoContainer, new TextContainer(text, pseudoContainer)];
    }
};


NodeParser.prototype.getChildren = function(parentContainer) {
    return flatten([].filter.call(parentContainer.node.childNodes, renderableNode).map(function(node) {
        var container = [node.nodeType === Node.TEXT_NODE ? new TextContainer(node, parentContainer) : new NodeContainer(node, parentContainer)].filter(nonIgnoredElement);
        return node.nodeType === Node.ELEMENT_NODE && container.length && node.tagName !== "TEXTAREA" ? (container[0].isElementVisible() ? container.concat(this.getChildren(container[0])) : []) : container;
    }, this));
};

NodeParser.prototype.newStackingContext = function(container, hasOwnStacking) {
    var stack = new StackingContext(hasOwnStacking, container.getOpacity(), container.node, container.parent);
    container.cloneTo(stack);
    var parentStack = hasOwnStacking ? stack.getParentStack(this) : stack.parent.stack;
    parentStack.contexts.push(stack);
    container.stack = stack;
};

NodeParser.prototype.createStackingContexts = function() {
    this.nodes.forEach(function(container) {
        if (isElement(container) && (this.isRootElement(container) || hasOpacity(container) || isPositionedForStacking(container) || this.isBodyWithTransparentRoot(container) || container.hasTransform())) {
            this.newStackingContext(container, true);
        } else if (isElement(container) && ((isPositioned(container) && zIndex0(container)) || isInlineBlock(container) || isFloating(container))) {
            this.newStackingContext(container, false);
        } else {
            container.assignStack(container.parent.stack);
        }
    }, this);
};

NodeParser.prototype.isBodyWithTransparentRoot = function(container) {
    return container.node.nodeName === "BODY" && container.parent.color('backgroundColor').isTransparent();
};

NodeParser.prototype.isRootElement = function(container) {
    return container.parent === null;
};

NodeParser.prototype.sortStackingContexts = function(stack) {
    stack.contexts.sort(zIndexSort(stack.contexts.slice(0)));
    stack.contexts.forEach(this.sortStackingContexts, this);
};

NodeParser.prototype.parseTextBounds = function(container) {
    return function(text, index, textList) {
        if (container.parent.css("textDecoration").substr(0, 4) !== "none" || text.trim().length !== 0) {
            if (this.support.rangeBounds && !container.parent.hasTransform()) {
                var offset = textList.slice(0, index).join("").length;
                return this.getRangeBounds(container.node, offset, text.length);
            } else if (container.node && typeof(container.node.data) === "string") {
                var replacementNode = container.node.splitText(text.length);
                var bounds = this.getWrapperBounds(container.node, container.parent.hasTransform());
                container.node = replacementNode;
                return bounds;
            }
        } else if(!this.support.rangeBounds || container.parent.hasTransform()){
            container.node = container.node.splitText(text.length);
        }
        return {};
    };
};

NodeParser.prototype.getWrapperBounds = function(node, transform) {
    var wrapper = node.ownerDocument.createElement('html2canvaswrapper');
    var parent = node.parentNode,
        backupText = node.cloneNode(true);

    wrapper.appendChild(node.cloneNode(true));
    parent.replaceChild(wrapper, node);
    var bounds = transform ? offsetBounds(wrapper) : getBounds(wrapper);
    parent.replaceChild(backupText, wrapper);
    return bounds;
};

NodeParser.prototype.getRangeBounds = function(node, offset, length) {
    var range = this.range || (this.range = node.ownerDocument.createRange());
    range.setStart(node, offset);
    range.setEnd(node, offset + length);
    return range.getBoundingClientRect();
};

function ClearTransform() {}

NodeParser.prototype.parse = function(stack) {
    // http://www.w3.org/TR/CSS21/visuren.html#z-index
    var negativeZindex = stack.contexts.filter(negativeZIndex); // 2. the child stacking contexts with negative stack levels (most negative first).
    var descendantElements = stack.children.filter(isElement);
    var descendantNonFloats = descendantElements.filter(not(isFloating));
    var nonInlineNonPositionedDescendants = descendantNonFloats.filter(not(isPositioned)).filter(not(inlineLevel)); // 3 the in-flow, non-inline-level, non-positioned descendants.
    var nonPositionedFloats = descendantElements.filter(not(isPositioned)).filter(isFloating); // 4. the non-positioned floats.
    var inFlow = descendantNonFloats.filter(not(isPositioned)).filter(inlineLevel); // 5. the in-flow, inline-level, non-positioned descendants, including inline tables and inline blocks.
    var stackLevel0 = stack.contexts.concat(descendantNonFloats.filter(isPositioned)).filter(zIndex0); // 6. the child stacking contexts with stack level 0 and the positioned descendants with stack level 0.
    var text = stack.children.filter(isTextNode).filter(hasText);
    var positiveZindex = stack.contexts.filter(positiveZIndex); // 7. the child stacking contexts with positive stack levels (least positive first).
    negativeZindex.concat(nonInlineNonPositionedDescendants).concat(nonPositionedFloats)
        .concat(inFlow).concat(stackLevel0).concat(text).concat(positiveZindex).forEach(function(container) {
            this.renderQueue.push(container);
            if (isStackingContext(container)) {
                this.parse(container);
                this.renderQueue.push(new ClearTransform());
            }
        }, this);
};

NodeParser.prototype.paint = function(container) {
    try {
        if (container instanceof ClearTransform) {
            this.renderer.ctx.restore();
        } else if (isTextNode(container)) {
            if (isPseudoElement(container.parent)) {
                container.parent.appendToDOM();
            }
            this.paintText(container);
            if (isPseudoElement(container.parent)) {
                container.parent.cleanDOM();
            }
        } else {
            this.paintNode(container);
        }
    } catch(e) {
        log(e);
        if (this.options.strict) {
            throw e;
        }
    }
};

NodeParser.prototype.paintNode = function(container) {
    if (isStackingContext(container)) {
        this.renderer.setOpacity(container.opacity);
        this.renderer.ctx.save();
        if (container.hasTransform()) {
            this.renderer.setTransform(container.parseTransform());
        }
    }

    if (container.node.nodeName === "INPUT" && container.node.type === "checkbox") {
        this.paintCheckbox(container);
    } else if (container.node.nodeName === "INPUT" && container.node.type === "radio") {
        this.paintRadio(container);
    } else {
        this.paintElement(container);
    }
};

NodeParser.prototype.paintElement = function(container) {
    var bounds = container.parseBounds();
    this.renderer.clip(container.backgroundClip, function() {
        this.renderer.renderBackground(container, bounds, container.borders.borders.map(getWidth));
    }, this, container);

    this.renderer.mask(container.backgroundClip, function() {
        this.renderer.renderShadows(container, container.borders.clip);
    }, this, container);

    this.renderer.clip(container.clip, function() {
        this.renderer.renderBorders(container.borders.borders);
    }, this, container);

    this.renderer.clip(container.backgroundClip, function() {
        switch (container.node.nodeName) {
        case "svg":
        case "IFRAME":
            var imgContainer = this.images.get(container.node);
            if (imgContainer) {
                this.renderer.renderImage(container, bounds, container.borders, imgContainer);
            } else {
                log("Error loading <" + container.node.nodeName + ">", container.node);
            }
            break;
        case "IMG":
            var imageContainer = this.images.get(container.node.src);
            if (imageContainer) {
                this.renderer.renderImage(container, bounds, container.borders, imageContainer);
            } else {
                log("Error loading <img>", container.node.src);
            }
            break;
        case "CANVAS":
            this.renderer.renderImage(container, bounds, container.borders, {image: container.node});
            break;
        case "SELECT":
        case "INPUT":
        case "TEXTAREA":
            this.paintFormValue(container);
            break;
        }
    }, this, container);
};

NodeParser.prototype.paintCheckbox = function(container) {
    var b = container.parseBounds();

    var size = Math.min(b.width, b.height);
    var bounds = {width: size - 1, height: size - 1, top: b.top, left: b.left};
    var r = [3, 3];
    var radius = [r, r, r, r];
    var borders = [1,1,1,1].map(function(w) {
        return {color: new Color('#A5A5A5'), width: w};
    });

    var borderPoints = calculateCurvePoints(bounds, radius, borders);

    this.renderer.clip(container.backgroundClip, function() {
        this.renderer.rectangle(bounds.left + 1, bounds.top + 1, bounds.width - 2, bounds.height - 2, new Color("#DEDEDE"));
        this.renderer.renderBorders(calculateBorders(borders, bounds, borderPoints, radius));
        if (container.node.checked) {
            this.renderer.font(new Color('#424242'), 'normal', 'normal', 'bold', (size - 3) + "px", 'arial');
            this.renderer.text("\u2714", bounds.left + size / 6, bounds.top + size - 1);
        }
    }, this, container);
};

NodeParser.prototype.paintRadio = function(container) {
    var bounds = container.parseBounds();

    var size = Math.min(bounds.width, bounds.height) - 2;

    this.renderer.clip(container.backgroundClip, function() {
        this.renderer.circleStroke(bounds.left + 1, bounds.top + 1, size, new Color('#DEDEDE'), 1, new Color('#A5A5A5'));
        if (container.node.checked) {
            this.renderer.circle(Math.ceil(bounds.left + size / 4) + 1, Math.ceil(bounds.top + size / 4) + 1, Math.floor(size / 2), new Color('#424242'));
        }
    }, this, container);
};

NodeParser.prototype.paintFormValue = function(container) {
    var value = container.getValue();
    if (value.length > 0) {
        var document = container.node.ownerDocument;
        var wrapper = document.createElement('html2canvaswrapper');
        var properties = ['lineHeight', 'textAlign', 'fontFamily', 'fontWeight', 'fontSize', 'color',
            'paddingLeft', 'paddingTop', 'paddingRight', 'paddingBottom',
            'width', 'height', 'borderLeftStyle', 'borderTopStyle', 'borderLeftWidth', 'borderTopWidth',
            'boxSizing', 'whiteSpace', 'wordWrap'];

        properties.forEach(function(property) {
            try {
                wrapper.style[property] = container.css(property);
            } catch(e) {
                // Older IE has issues with "border"
                log("html2canvas: Parse: Exception caught in renderFormValue: " + e.message);
            }
        });
        var bounds = container.parseBounds();
        wrapper.style.position = "fixed";
        wrapper.style.left = bounds.left + "px";
        wrapper.style.top = bounds.top + "px";
        wrapper.textContent = value;
        document.body.appendChild(wrapper);
        this.paintText(new TextContainer(wrapper.firstChild, container));
        document.body.removeChild(wrapper);
    }
};

NodeParser.prototype.paintText = function(container) {
    container.applyTextTransform();
    var characters = punycode.ucs2.decode(container.node.data);
    var wordRendering = (!this.options.letterRendering || noLetterSpacing(container)) && !hasUnicode(container.node.data);
    var textList = wordRendering ? getWords(characters) : characters.map(function(character) {
        return punycode.ucs2.encode([character]);
    });
    if (!wordRendering) {
        container.parent.node.style.fontVariantLigatures = 'none';
    }

    var weight = container.parent.fontWeight();
    var size = container.parent.css('fontSize');
    var family = container.parent.css('fontFamily');
    var shadows = container.parent.parseTextShadows();

    this.renderer.font(container.parent.color('color'), container.parent.css('fontStyle'), container.parent.css('fontVariant'), weight, size, family);
    if (shadows.length) {
        // TODO: support multiple text shadows
        this.renderer.fontShadow(shadows[0].color, shadows[0].offsetX, shadows[0].offsetY, shadows[0].blur);
    } else {
        this.renderer.clearShadow();
    }

    this.renderer.clip(container.parent.clip, function() {
        textList.map(this.parseTextBounds(container), this).forEach(function(bounds, index) {
            if (bounds) {
                this.renderer.text(textList[index], bounds.left, bounds.bottom);
                this.renderTextDecoration(container.parent, bounds, this.fontMetrics.getMetrics(family, size));
            }
        }, this);
    }, this, container.parent);
};

NodeParser.prototype.renderTextDecoration = function(container, bounds, metrics) {
    switch(container.css("textDecoration").split(" ")[0]) {
    case "underline":
        // Draws a line at the baseline of the font
        // TODO As some browsers display the line as more than 1px if the font-size is big, need to take that into account both in position and size
        this.renderer.rectangle(bounds.left, Math.round(bounds.top + metrics.baseline + metrics.lineWidth), bounds.width, 1, container.color("color"));
        break;
    case "overline":
        this.renderer.rectangle(bounds.left, Math.round(bounds.top), bounds.width, 1, container.color("color"));
        break;
    case "line-through":
        // TODO try and find exact position for line-through
        this.renderer.rectangle(bounds.left, Math.ceil(bounds.top + metrics.middle + metrics.lineWidth), bounds.width, 1, container.color("color"));
        break;
    }
};

var borderColorTransforms = {
    inset: [
        ["darken", 0.60],
        ["darken", 0.10],
        ["darken", 0.10],
        ["darken", 0.60]
    ]
};

NodeParser.prototype.parseBorders = function(container) {
    var nodeBounds = container.parseBounds();
    var radius = getBorderRadiusData(container);
    var borders = ["Top", "Right", "Bottom", "Left"].map(function(side, index) {
        var style = container.css('border' + side + 'Style');
        var color = container.color('border' + side + 'Color');
        if (style === "inset" && color.isBlack()) {
            color = new Color([255, 255, 255, color.a]); // this is wrong, but
        }
        var colorTransform = borderColorTransforms[style] ? borderColorTransforms[style][index] : null;
        return {
            width: container.cssInt('border' + side + 'Width'),
            color: colorTransform ? color[colorTransform[0]](colorTransform[1]) : color,
            style: style,
            pathArgs: null,
            args: null
        };
    });
    var borderPoints = calculateCurvePoints(nodeBounds, radius, borders);

    return {
        clip: this.parseBackgroundClip(container, borderPoints, borders, radius, nodeBounds),
        borders: calculateBorders(borders, nodeBounds, borderPoints, radius)
    };
};

function calculateBorders(borders, nodeBounds, borderPoints, radius) {
    var pathBounds = {
        top: nodeBounds.top + borders[0].width/2,
        right: nodeBounds.right - borders[1].width/2,
        bottom: nodeBounds.bottom - borders[2].width/2,
        left: nodeBounds.left + borders[3].width/2
    };
    return borders.map(function(border, borderSide) {
        if (border.width > 0) {
            var bx = nodeBounds.left;
            var by = nodeBounds.top;
            var bw = nodeBounds.width;
            var bh = nodeBounds.height - (borders[2].width);

            switch(borderSide) {
            case 0:
                // top border
                bh = borders[0].width;
                border.args = drawSide({
                        c1: [bx, by],
                        c2: [bx + bw, by],
                        c3: [bx + bw - borders[1].width, by + bh],
                        c4: [bx + borders[3].width, by + bh]
                    }, radius[0], radius[1],
                    borderPoints.topLeftOuter, borderPoints.topLeftInner, borderPoints.topRightOuter, borderPoints.topRightInner);
                border.pathArgs = drawSidePath({
                        c1: [pathBounds.left, pathBounds.top],
                        c2: [pathBounds.right, pathBounds.top]
                    }, radius[0], radius[1],
                    borderPoints.topLeft, borderPoints.topRight);
                break;
            case 1:
                // right border
                bx = nodeBounds.left + nodeBounds.width - (borders[1].width);
                bw = borders[1].width;

                border.args = drawSide({
                        c1: [bx + bw, by],
                        c2: [bx + bw, by + bh + borders[2].width],
                        c3: [bx, by + bh],
                        c4: [bx, by + borders[0].width]
                    }, radius[1], radius[2],
                    borderPoints.topRightOuter, borderPoints.topRightInner, borderPoints.bottomRightOuter, borderPoints.bottomRightInner);
                border.pathArgs = drawSidePath({
                        c1: [pathBounds.right, pathBounds.top],
                        c2: [pathBounds.right, pathBounds.bottom]
                    }, radius[1], radius[2],
                    borderPoints.topRight, borderPoints.bottomRight);
                break;
            case 2:
                // bottom border
                by = (by + nodeBounds.height) - (borders[2].width);
                bh = borders[2].width;
                border.args = drawSide({
                        c1: [bx + bw, by + bh],
                        c2: [bx, by + bh],
                        c3: [bx + borders[3].width, by],
                        c4: [bx + bw - borders[3].width, by]
                    }, radius[2], radius[3],
                    borderPoints.bottomRightOuter, borderPoints.bottomRightInner, borderPoints.bottomLeftOuter, borderPoints.bottomLeftInner);
                border.pathArgs = drawSidePath({
                        c1: [pathBounds.right, pathBounds.bottom],
                        c2: [pathBounds.left, pathBounds.bottom]
                    }, radius[2], radius[3],
                    borderPoints.bottomRight, borderPoints.bottomLeft);
                break;
            case 3:
                // left border
                bw = borders[3].width;
                border.args = drawSide({
                        c1: [bx, by + bh + borders[2].width],
                        c2: [bx, by],
                        c3: [bx + bw, by + borders[0].width],
                        c4: [bx + bw, by + bh]
                    }, radius[3], radius[0],
                    borderPoints.bottomLeftOuter, borderPoints.bottomLeftInner, borderPoints.topLeftOuter, borderPoints.topLeftInner);
                border.pathArgs = drawSidePath({
                        c1: [pathBounds.left, pathBounds.bottom],
                        c2: [pathBounds.left, pathBounds.top]
                    }, radius[3], radius[0],
                    borderPoints.bottomLeft, borderPoints.topLeft);
                break;
            }
        }
        return border;
    });
}

NodeParser.prototype.parseBackgroundClip = function(container, borderPoints, borders, radius, bounds) {
    var backgroundClip = container.css('backgroundClip'),
        borderArgs = [];

    switch(backgroundClip) {
    case "content-box":
    case "padding-box":
        parseCorner(borderArgs, radius[0], radius[1], borderPoints.topLeftInner, borderPoints.topRightInner, bounds.left + borders[3].width, bounds.top + borders[0].width);
        parseCorner(borderArgs, radius[1], radius[2], borderPoints.topRightInner, borderPoints.bottomRightInner, bounds.left + bounds.width - borders[1].width, bounds.top + borders[0].width);
        parseCorner(borderArgs, radius[2], radius[3], borderPoints.bottomRightInner, borderPoints.bottomLeftInner, bounds.left + bounds.width - borders[1].width, bounds.top + bounds.height - borders[2].width);
        parseCorner(borderArgs, radius[3], radius[0], borderPoints.bottomLeftInner, borderPoints.topLeftInner, bounds.left + borders[3].width, bounds.top + bounds.height - borders[2].width);
        break;

    default:
        parseCorner(borderArgs, radius[0], radius[1], borderPoints.topLeftOuter, borderPoints.topRightOuter, bounds.left, bounds.top);
        parseCorner(borderArgs, radius[1], radius[2], borderPoints.topRightOuter, borderPoints.bottomRightOuter, bounds.left + bounds.width, bounds.top);
        parseCorner(borderArgs, radius[2], radius[3], borderPoints.bottomRightOuter, borderPoints.bottomLeftOuter, bounds.left + bounds.width, bounds.top + bounds.height);
        parseCorner(borderArgs, radius[3], radius[0], borderPoints.bottomLeftOuter, borderPoints.topLeftOuter, bounds.left, bounds.top + bounds.height);
        break;
    }

    return borderArgs;
};

function getCurvePoints(x, y, r1, r2) {
    var kappa = 4 * ((Math.sqrt(2) - 1) / 3);
    var ox = (r1) * kappa, // control point offset horizontal
        oy = (r2) * kappa, // control point offset vertical
        xm = x + r1, // x-middle
        ym = y + r2; // y-middle
    return {
        topLeft: bezierCurve({x: x, y: ym}, {x: x, y: ym - oy}, {x: xm - ox, y: y}, {x: xm, y: y}),
        topRight: bezierCurve({x: x, y: y}, {x: x + ox,y: y}, {x: xm, y: ym - oy}, {x: xm, y: ym}),
        bottomRight: bezierCurve({x: xm, y: y}, {x: xm, y: y + oy}, {x: x + ox, y: ym}, {x: x, y: ym}),
        bottomLeft: bezierCurve({x: xm, y: ym}, {x: xm - ox, y: ym}, {x: x, y: y + oy}, {x: x, y:y})
    };
}

function calculateCurvePoints(bounds, borderRadius, borders) {
    var x = bounds.left,
        y = bounds.top,
        width = bounds.width,
        height = bounds.height,

        tlh = borderRadius[0][0] < width / 2 ? borderRadius[0][0] : width / 2,
        tlv = borderRadius[0][1] < height / 2 ? borderRadius[0][1] : height / 2,
        trh = borderRadius[1][0] < width / 2 ? borderRadius[1][0] : width / 2,
        trv = borderRadius[1][1] < height / 2 ? borderRadius[1][1] : height / 2,
        brh = borderRadius[2][0] < width / 2 ? borderRadius[2][0] : width / 2,
        brv = borderRadius[2][1] < height / 2 ? borderRadius[2][1] : height / 2,
        blh = borderRadius[3][0] < width / 2 ? borderRadius[3][0] : width / 2,
        blv = borderRadius[3][1] < height / 2 ? borderRadius[3][1] : height / 2;

    var topWidth = width - trh,
        rightHeight = height - brv,
        bottomWidth = width - brh,
        leftHeight = height - blv;

    return {
        topLeft: getCurvePoints(x + borders[3].width/2, y + borders[0].width/2, Math.max(0, tlh - borders[3].width/2), Math.max(0, tlv - borders[0].width/2)).topLeft.subdivide(0.5),
        topRight: getCurvePoints(x + Math.min(topWidth, width + borders[3].width/2), y + borders[0].width/2, (topWidth > width + borders[3].width/2) ? 0 :trh - borders[3].width/2, trv - borders[0].width/2).topRight.subdivide(0.5),
        bottomRight: getCurvePoints(x + Math.min(bottomWidth, width - borders[3].width/2), y + Math.min(rightHeight, height + borders[0].width/2), Math.max(0, brh - borders[1].width/2),  brv - borders[2].width/2).bottomRight.subdivide(0.5),
        bottomLeft: getCurvePoints(x + borders[3].width/2, y + leftHeight, Math.max(0, blh - borders[3].width/2), blv - borders[2].width/2).bottomLeft.subdivide(0.5),

        topLeftOuter: getCurvePoints(x, y, tlh, tlv).topLeft.subdivide(0.5),
        topLeftInner: getCurvePoints(x + borders[3].width, y + borders[0].width, Math.max(0, tlh - borders[3].width), Math.max(0, tlv - borders[0].width)).topLeft.subdivide(0.5),
        topRightOuter: getCurvePoints(x + topWidth, y, trh, trv).topRight.subdivide(0.5),
        topRightInner: getCurvePoints(x + Math.min(topWidth, width + borders[3].width), y + borders[0].width, (topWidth > width + borders[3].width) ? 0 :trh - borders[3].width, trv - borders[0].width).topRight.subdivide(0.5),
        bottomRightOuter: getCurvePoints(x + bottomWidth, y + rightHeight, brh, brv).bottomRight.subdivide(0.5),
        bottomRightInner: getCurvePoints(x + Math.min(bottomWidth, width - borders[3].width), y + Math.min(rightHeight, height + borders[0].width), Math.max(0, brh - borders[1].width),  brv - borders[2].width).bottomRight.subdivide(0.5),
        bottomLeftOuter: getCurvePoints(x, y + leftHeight, blh, blv).bottomLeft.subdivide(0.5),
        bottomLeftInner: getCurvePoints(x + borders[3].width, y + leftHeight, Math.max(0, blh - borders[3].width), blv - borders[2].width).bottomLeft.subdivide(0.5)
    };
}

function bezierCurve(start, startControl, endControl, end) {
    var lerp = function (a, b, t) {
        return {
            x: a.x + (b.x - a.x) * t,
            y: a.y + (b.y - a.y) * t
        };
    };

    return {
        start: start,
        startControl: startControl,
        endControl: endControl,
        end: end,
        subdivide: function(t) {
            var ab = lerp(start, startControl, t),
                bc = lerp(startControl, endControl, t),
                cd = lerp(endControl, end, t),
                abbc = lerp(ab, bc, t),
                bccd = lerp(bc, cd, t),
                dest = lerp(abbc, bccd, t);
            return [bezierCurve(start, ab, abbc, dest), bezierCurve(dest, bccd, cd, end)];
        },
        curveTo: function(borderArgs) {
            borderArgs.push(["bezierCurve", startControl.x, startControl.y, endControl.x, endControl.y, end.x, end.y]);
        },
        curveToReversed: function(borderArgs) {
            borderArgs.push(["bezierCurve", endControl.x, endControl.y, startControl.x, startControl.y, start.x, start.y]);
        }
    };
}

function drawSide(borderData, radius1, radius2, outer1, inner1, outer2, inner2) {
    var borderArgs = [];

    if (radius1[0] > 0 || radius1[1] > 0) {
        borderArgs.push(["line", outer1[1].start.x, outer1[1].start.y]);
        outer1[1].curveTo(borderArgs);
    } else {
        borderArgs.push([ "line", borderData.c1[0], borderData.c1[1]]);
    }

    if (radius2[0] > 0 || radius2[1] > 0) {
        borderArgs.push(["line", outer2[0].start.x, outer2[0].start.y]);
        outer2[0].curveTo(borderArgs);
        borderArgs.push(["line", inner2[0].end.x, inner2[0].end.y]);
        inner2[0].curveToReversed(borderArgs);
    } else {
        borderArgs.push(["line", borderData.c2[0], borderData.c2[1]]);
        borderArgs.push(["line", borderData.c3[0], borderData.c3[1]]);
    }

    if (radius1[0] > 0 || radius1[1] > 0) {
        borderArgs.push(["line", inner1[1].end.x, inner1[1].end.y]);
        inner1[1].curveToReversed(borderArgs);
    } else {
        borderArgs.push(["line", borderData.c4[0], borderData.c4[1]]);
    }

    return borderArgs;
}

function drawSidePath(borderData, radius1, radius2, curve1, curve2) {
    var borderArgs = [];
    if (radius1[0] > 0 || radius1[1] > 0) {
        borderArgs.push(["line", curve1[1].start.x, curve1[1].start.y]);
        curve1[1].curveTo(borderArgs);
    } else {
        borderArgs.push([ "line", borderData.c1[0], borderData.c1[1]]);
    }
    if (radius2[0] > 0 || radius2[1] > 0) {
        borderArgs.push(["line", curve2[0].start.x, curve2[0].start.y]);
        curve2[0].curveTo(borderArgs);
    } else {
        borderArgs.push([ "line", borderData.c2[0], borderData.c2[1]]);
    }

    return borderArgs;
}

function parseCorner(borderArgs, radius1, radius2, corner1, corner2, x, y) {
    if (radius1[0] > 0 || radius1[1] > 0) {
        borderArgs.push(["line", corner1[0].start.x, corner1[0].start.y]);
        corner1[0].curveTo(borderArgs);
        corner1[1].curveTo(borderArgs);
    } else {
        borderArgs.push(["line", x, y]);
    }

    if (radius2[0] > 0 || radius2[1] > 0) {
        borderArgs.push(["line", corner2[0].start.x, corner2[0].start.y]);
    }
}

function negativeZIndex(container) {
    return container.cssInt("zIndex") < 0;
}

function positiveZIndex(container) {
    return container.cssInt("zIndex") > 0;
}

function zIndex0(container) {
    return container.cssInt("zIndex") === 0;
}

function inlineLevel(container) {
    return ["inline", "inline-block", "inline-table"].indexOf(container.css("display")) !== -1;
}

function isStackingContext(container) {
    return (container instanceof StackingContext);
}

function hasText(container) {
    return container.node.data.trim().length > 0;
}

function noLetterSpacing(container) {
    return (/^(normal|none|0px)$/.test(container.parent.css("letterSpacing")));
}

function getBorderRadiusData(container) {
    return ["TopLeft", "TopRight", "BottomRight", "BottomLeft"].map(function(side) {
        var value = container.css('border' + side + 'Radius');
        var arr = value.split(" ");
        if (arr.length <= 1) {
            arr[1] = arr[0];
        }
        return arr.map(asInt);
    });
}

function renderableNode(node) {
    return (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE);
}

function isPositionedForStacking(container) {
    var position = container.css("position");
    var zIndex = (["absolute", "relative", "fixed"].indexOf(position) !== -1) ? container.css("zIndex") : "auto";
    return zIndex !== "auto";
}

function isPositioned(container) {
    return container.css("position") !== "static";
}

function isFloating(container) {
    return container.css("float") !== "none";
}

function isInlineBlock(container) {
    return ["inline-block", "inline-table"].indexOf(container.css("display")) !== -1;
}

function not(callback) {
    var context = this;
    return function() {
        return !callback.apply(context, arguments);
    };
}

function isElement(container) {
    return container.node.nodeType === Node.ELEMENT_NODE;
}

function isPseudoElement(container) {
    return container.isPseudoElement === true;
}

function isTextNode(container) {
    return container.node.nodeType === Node.TEXT_NODE;
}

function zIndexSort(contexts) {
    return function(a, b) {
        return (a.cssInt("zIndex") + (contexts.indexOf(a) / contexts.length)) - (b.cssInt("zIndex") + (contexts.indexOf(b) / contexts.length));
    };
}

function hasOpacity(container) {
    return container.getOpacity() < 1;
}

function asInt(value) {
    return parseInt(value, 10);
}

function getWidth(border) {
    return border.width;
}

function nonIgnoredElement(nodeContainer) {
    return (nodeContainer.node.nodeType !== Node.ELEMENT_NODE || ["SCRIPT", "HEAD", "TITLE", "OBJECT", "BR", "OPTION"].indexOf(nodeContainer.node.nodeName) === -1);
}

function flatten(arrays) {
    return [].concat.apply([], arrays);
}

function stripQuotes(content) {
    var first = content.substr(0, 1);
    return (first === content.substr(content.length - 1) && first.match(/'|"/)) ? content.substr(1, content.length - 2) : content;
}

function getWords(characters) {
    var words = [], i = 0, onWordBoundary = false, word;
    while(characters.length) {
        if (isWordBoundary(characters[i]) === onWordBoundary) {
            word = characters.splice(0, i);
            if (word.length) {
                words.push(punycode.ucs2.encode(word));
            }
            onWordBoundary =! onWordBoundary;
            i = 0;
        } else {
            i++;
        }

        if (i >= characters.length) {
            word = characters.splice(0, i);
            if (word.length) {
                words.push(punycode.ucs2.encode(word));
            }
        }
    }
    return words;
}

function isWordBoundary(characterCode) {
    return [
        32, // <space>
        13, // \r
        10, // \n
        9, // \t
        45 // -
    ].indexOf(characterCode) !== -1;
}

function hasUnicode(string) {
    return (/[^\u0000-\u00ff]/).test(string);
}

module.exports = NodeParser;

},{"./color":3,"./fontmetrics":7,"./log":13,"./nodecontainer":14,"./pseudoelementcontainer":18,"./stackingcontext":21,"./textcontainer":25,"./utils":26,"punycode":1}],16:[function(_dereq_,module,exports){
var XHR = _dereq_('./xhr');
var utils = _dereq_('./utils');
var log = _dereq_('./log');
var createWindowClone = _dereq_('./clone');
var decode64 = utils.decode64;

function Proxy(src, proxyUrl, document) {
    var supportsCORS = ('withCredentials' in new XMLHttpRequest());
    if (!proxyUrl) {
        return Promise.reject("No proxy configured");
    }
    var callback = createCallback(supportsCORS);
    var url = createProxyUrl(proxyUrl, src, callback);

    return supportsCORS ? XHR(url) : (jsonp(document, url, callback).then(function(response) {
        return decode64(response.content);
    }));
}
var proxyCount = 0;

function ProxyURL(src, proxyUrl, document) {
    var supportsCORSImage = ('crossOrigin' in new Image());
    var callback = createCallback(supportsCORSImage);
    var url = createProxyUrl(proxyUrl, src, callback);
    return (supportsCORSImage ? Promise.resolve(url) : jsonp(document, url, callback).then(function(response) {
        return "data:" + response.type + ";base64," + response.content;
    }));
}

function jsonp(document, url, callback) {
    return new Promise(function(resolve, reject) {
        var s = document.createElement("script");
        var cleanup = function() {
            delete window.html2canvas.proxy[callback];
            document.body.removeChild(s);
        };
        window.html2canvas.proxy[callback] = function(response) {
            cleanup();
            resolve(response);
        };
        s.src = url;
        s.onerror = function(e) {
            cleanup();
            reject(e);
        };
        document.body.appendChild(s);
    });
}

function createCallback(useCORS) {
    return !useCORS ? "html2canvas_" + Date.now() + "_" + (++proxyCount) + "_" + Math.round(Math.random() * 100000) : "";
}

function createProxyUrl(proxyUrl, src, callback) {
    return proxyUrl + "?url=" + encodeURIComponent(src) + (callback.length ? "&callback=html2canvas.proxy." + callback : "");
}

function documentFromHTML(src) {
    return function(html) {
        var parser = new DOMParser(), doc;
        try {
            doc = parser.parseFromString(html, "text/html");
        } catch(e) {
            log("DOMParser not supported, falling back to createHTMLDocument");
            doc = document.implementation.createHTMLDocument("");
            try {
                doc.open();
                doc.write(html);
                doc.close();
            } catch(ee) {
                log("createHTMLDocument write not supported, falling back to document.body.innerHTML");
                doc.body.innerHTML = html; // ie9 doesnt support writing to documentElement
            }
        }

        var b = doc.querySelector("base");
        if (!b || !b.href.host) {
            var base = doc.createElement("base");
            base.href = src;
            doc.head.insertBefore(base, doc.head.firstChild);
        }

        return doc;
    };
}

function loadUrlDocument(src, proxy, document, width, height, options) {
    return new Proxy(src, proxy, window.document).then(documentFromHTML(src)).then(function(doc) {
        return createWindowClone(doc, document, width, height, options, 0, 0);
    });
}

exports.Proxy = Proxy;
exports.ProxyURL = ProxyURL;
exports.loadUrlDocument = loadUrlDocument;

},{"./clone":2,"./log":13,"./utils":26,"./xhr":28}],17:[function(_dereq_,module,exports){
var ProxyURL = _dereq_('./proxy').ProxyURL;

function ProxyImageContainer(src, proxy) {
    var link = document.createElement("a");
    link.href = src;
    src = link.href;
    this.src = src;
    this.image = new Image();
    var self = this;
    this.promise = new Promise(function(resolve, reject) {
        self.image.crossOrigin = "Anonymous";
        self.image.onload = resolve;
        self.image.onerror = reject;

        new ProxyURL(src, proxy, document).then(function(url) {
            self.image.src = url;
        })['catch'](reject);
    });
}

module.exports = ProxyImageContainer;

},{"./proxy":16}],18:[function(_dereq_,module,exports){
var NodeContainer = _dereq_('./nodecontainer');

function PseudoElementContainer(node, parent, type) {
    NodeContainer.call(this, node, parent);
    this.isPseudoElement = true;
    this.before = type === ":before";
}

PseudoElementContainer.prototype.cloneTo = function(stack) {
    PseudoElementContainer.prototype.cloneTo.call(this, stack);
    stack.isPseudoElement = true;
    stack.before = this.before;
};

PseudoElementContainer.prototype = Object.create(NodeContainer.prototype);

PseudoElementContainer.prototype.appendToDOM = function() {
    if (this.before) {
        this.parent.node.insertBefore(this.node, this.parent.node.firstChild);
    } else {
        this.parent.node.appendChild(this.node);
    }
    this.parent.node.className += " " + this.getHideClass();
};

PseudoElementContainer.prototype.cleanDOM = function() {
    this.node.parentNode.removeChild(this.node);
    this.parent.node.className = this.parent.node.className.replace(this.getHideClass(), "");
};

PseudoElementContainer.prototype.getHideClass = function() {
    return this["PSEUDO_HIDE_ELEMENT_CLASS_" + (this.before ? "BEFORE" : "AFTER")];
};

PseudoElementContainer.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE = "___html2canvas___pseudoelement_before";
PseudoElementContainer.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER = "___html2canvas___pseudoelement_after";

module.exports = PseudoElementContainer;

},{"./nodecontainer":14}],19:[function(_dereq_,module,exports){
var log = _dereq_('./log');

function Renderer(width, height, images, options, document) {
    this.width = width;
    this.height = height;
    this.images = images;
    this.options = options;
    this.document = document;
}

Renderer.prototype.renderImage = function(container, bounds, borderData, imageContainer) {
    var paddingLeft = container.cssInt('paddingLeft'),
        paddingTop = container.cssInt('paddingTop'),
        paddingRight = container.cssInt('paddingRight'),
        paddingBottom = container.cssInt('paddingBottom'),
        borders = borderData.borders;

    var width = bounds.width - (borders[1].width + borders[3].width + paddingLeft + paddingRight);
    var height = bounds.height - (borders[0].width + borders[2].width + paddingTop + paddingBottom);
    this.drawImage(
        imageContainer,
        0,
        0,
        imageContainer.image.width || width,
        imageContainer.image.height || height,
        bounds.left + paddingLeft + borders[3].width,
        bounds.top + paddingTop + borders[0].width,
        width,
        height
    );
};

Renderer.prototype.renderBackground = function(container, bounds, borderData) {
    if (bounds.height > 0 && bounds.width > 0) {
        this.renderBackgroundColor(container, bounds);
        this.renderBackgroundImage(container, bounds, borderData);
    }
};

Renderer.prototype.renderBackgroundColor = function(container, bounds) {
    var color = container.color("backgroundColor");
    if (!color.isTransparent()) {
        this.rectangle(bounds.left, bounds.top, bounds.width, bounds.height, color);
    }
};

Renderer.prototype.renderShadows = function(container, shape) {
    var boxShadow = container.css('boxShadow');
    if (boxShadow !== 'none') {
        var shadows = boxShadow.split(/,(?![^(]*\))/);
        this.shadow(shape, shadows);
    }
};

Renderer.prototype.renderBorders = function(borders) {
    borders.forEach(this.renderBorder, this);
};

Renderer.prototype.renderBorder = function(data) {
    if (!data.color.isTransparent() && data.args !== null) {
        if (data.style === 'dashed' || data.style === 'dotted') {
            var dash = (data.style === 'dashed') ? 3 : data.width;
            this.ctx.setLineDash([dash]);
            this.path(data.pathArgs);
            this.ctx.strokeStyle = data.color;
            this.ctx.lineWidth = data.width;
            this.ctx.stroke();
        } else {
            this.drawShape(data.args, data.color);
        }
    }
};

Renderer.prototype.renderBackgroundImage = function(container, bounds, borderData) {
    var backgroundImages = container.parseBackgroundImages();
    backgroundImages.reverse().forEach(function(backgroundImage, index, arr) {
        switch(backgroundImage.method) {
        case "url":
            var image = this.images.get(backgroundImage.args[0]);
            if (image) {
                this.renderBackgroundRepeating(container, bounds, image, arr.length - (index+1), borderData);
            } else {
                log("Error loading background-image", backgroundImage.args[0]);
            }
            break;
        case "linear-gradient":
        case "gradient":
            var gradientImage = this.images.get(backgroundImage.value);
            if (gradientImage) {
                this.renderBackgroundGradient(gradientImage, bounds, borderData);
            } else {
                log("Error loading background-image", backgroundImage.args[0]);
            }
            break;
        case "none":
            break;
        default:
            log("Unknown background-image type", backgroundImage.args[0]);
        }
    }, this);
};

Renderer.prototype.renderBackgroundRepeating = function(container, bounds, imageContainer, index, borderData) {
    var size = container.parseBackgroundSize(bounds, imageContainer.image, index);
    var position = container.parseBackgroundPosition(bounds, imageContainer.image, index, size);
    var repeat = container.parseBackgroundRepeat(index);
    switch (repeat) {
    case "repeat-x":
    case "repeat no-repeat":
        this.backgroundRepeatShape(imageContainer, position, size, bounds, bounds.left + borderData[3], bounds.top + position.top + borderData[0], 99999, size.height, borderData);
        break;
    case "repeat-y":
    case "no-repeat repeat":
        this.backgroundRepeatShape(imageContainer, position, size, bounds, bounds.left + position.left + borderData[3], bounds.top + borderData[0], size.width, 99999, borderData);
        break;
    case "no-repeat":
        this.backgroundRepeatShape(imageContainer, position, size, bounds, bounds.left + position.left + borderData[3], bounds.top + position.top + borderData[0], size.width, size.height, borderData);
        break;
    default:
        this.renderBackgroundRepeat(imageContainer, position, size, {top: bounds.top, left: bounds.left}, borderData[3], borderData[0]);
        break;
    }
};

module.exports = Renderer;

},{"./log":13}],20:[function(_dereq_,module,exports){
var Renderer = _dereq_('../renderer');
var LinearGradientContainer = _dereq_('../lineargradientcontainer');
var log = _dereq_('../log');

function CanvasRenderer(width, height) {
    Renderer.apply(this, arguments);
    this.canvas = this.options.canvas || this.document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    if (!this.options.canvas) {
        if (this.options.dpi) {
            this.options.scale = this.options.dpi / 96;   // 1 CSS inch = 96px.
        }
        if (this.options.scale) {
            this.canvas.style.width = width + 'px';
            this.canvas.style.height = height + 'px';
            this.canvas.width = Math.floor(width * this.options.scale);
            this.canvas.height = Math.floor(height * this.options.scale);
            this.ctx.scale(this.options.scale, this.options.scale);
        } else {
            this.canvas.width = width;
            this.canvas.height = height;
        }
    }
    this.taintCtx = this.document.createElement("canvas").getContext("2d");
    this.ctx.textBaseline = "bottom";
    this.variables = {};
    log("Initialized CanvasRenderer with size", width, "x", height);
}

CanvasRenderer.prototype = Object.create(Renderer.prototype);

CanvasRenderer.prototype.setFillStyle = function(fillStyle) {
    this.ctx.fillStyle = typeof(fillStyle) === "object" && !!fillStyle.isColor ? fillStyle.toString() : fillStyle;
    return this.ctx;
};

CanvasRenderer.prototype.rectangle = function(left, top, width, height, color) {
    this.setFillStyle(color).fillRect(left, top, width, height);
};

CanvasRenderer.prototype.circle = function(left, top, size, color) {
    this.setFillStyle(color);
    this.ctx.beginPath();
    this.ctx.arc(left + size / 2, top + size / 2, size / 2, 0, Math.PI*2, true);
    this.ctx.closePath();
    this.ctx.fill();
};

CanvasRenderer.prototype.circleStroke = function(left, top, size, color, stroke, strokeColor) {
    this.circle(left, top, size, color);
    this.ctx.strokeStyle = strokeColor.toString();
    this.ctx.stroke();
};

CanvasRenderer.prototype.shadow = function(shape, shadows) {
    var parseShadow = function(str) {
        var propertyFilters = { color: /^(#|rgb|hsl|(?!(inset|initial|inherit))\D+)/i, inset: /^inset/i, px: /px$/i };
        var pxPropertyNames = [ 'x', 'y', 'blur', 'spread' ];
        var properties = str.split(/ (?![^(]*\))/);
        var info = {};
        for (var key in propertyFilters) {
            info[key] = properties.filter(propertyFilters[key].test.bind(propertyFilters[key]));
            info[key] = info[key].length === 0 ? null : info[key].length === 1 ? info[key][0] : info[key];
        }
        for (var i=0; i<info.px.length; i++) {
            info[pxPropertyNames[i]] = parseInt(info.px[i]);
        }
        return info;
    };
    var drawShadow = function(shadow) {
        var info = parseShadow(shadow);
        if (!info.inset) {
            context.shadowOffsetX = info.x;
            context.shadowOffsetY = info.y;
            context.shadowColor = info.color;
            context.shadowBlur = info.blur;
            context.fill();
        }
    };
    var context = this.setFillStyle('white');
    context.save();
    this.shape(shape);
    shadows.forEach(drawShadow, this);
    context.restore();
};

CanvasRenderer.prototype.drawShape = function(shape, color) {
    this.shape(shape);
    this.setFillStyle(color).fill();
};

CanvasRenderer.prototype.taints = function(imageContainer) {
    if (imageContainer.tainted === null) {
        this.taintCtx.drawImage(imageContainer.image, 0, 0);
        try {
            this.taintCtx.getImageData(0, 0, 1, 1);
            imageContainer.tainted = false;
        } catch(e) {
            this.taintCtx = document.createElement("canvas").getContext("2d");
            imageContainer.tainted = true;
        }
    }

    return imageContainer.tainted;
};

CanvasRenderer.prototype.drawImage = function(imageContainer, sx, sy, sw, sh, dx, dy, dw, dh) {
    if (!this.taints(imageContainer) || this.options.allowTaint) {
        this.ctx.drawImage(imageContainer.image, sx, sy, sw, sh, dx, dy, dw, dh);
    }
};

CanvasRenderer.prototype.clip = function(shapes, callback, context, container) {
    this.ctx.save();
    if (container && container.hasTransform()) {
        this.setTransform(container.inverseTransform());
        shapes.filter(hasEntries).forEach(function(shape) {
            this.shape(shape).clip();
        }, this);
        this.setTransform(container.parseTransform());
    } else {
        shapes.filter(hasEntries).forEach(function(shape) {
            this.shape(shape).clip();
        }, this);
    }
    callback.call(context);
    this.ctx.restore();
};

CanvasRenderer.prototype.mask = function(shapes, callback, context, container) {
    var borderClip = shapes[shapes.length-1];
    if (borderClip && borderClip.length) {
        var canvasBorderCCW = ["rect", this.canvas.width, 0, -this.canvas.width, this.canvas.height];
        var maskShape = [canvasBorderCCW].concat(borderClip).concat([borderClip[0]]);
        shapes = shapes.slice(0,-1).concat([maskShape]);
    }
    this.clip(shapes, callback, context, container);
};

CanvasRenderer.prototype.shape = function(shape) {
    this.ctx.beginPath();
    shape.forEach(function(point, index) {
        if (point[0] === "rect") {
            this.ctx.rect.apply(this.ctx, point.slice(1));
        } else {
            this.ctx[(index === 0) ? "moveTo" : point[0] + "To" ].apply(this.ctx, point.slice(1));
        }
    }, this);
    this.ctx.closePath();
    return this.ctx;
};

CanvasRenderer.prototype.path = function(shape) {
    this.ctx.beginPath();
    shape.forEach(function(point, index) {
        if (point[0] === "rect") {
            this.ctx.rect.apply(this.ctx, point.slice(1));
        } else {
            this.ctx[(index === 0) ? "moveTo" : point[0] + "To" ].apply(this.ctx, point.slice(1));
        }
    }, this);
    return this.ctx;
};

CanvasRenderer.prototype.font = function(color, style, variant, weight, size, family) {
    variant = /^(normal|small-caps)$/i.test(variant) ? variant : '';
    this.setFillStyle(color).font = [style, variant, weight, size, family].join(" ").split(",")[0];
};

CanvasRenderer.prototype.fontShadow = function(color, offsetX, offsetY, blur) {
    this.setVariable("shadowColor", color.toString())
        .setVariable("shadowOffsetY", offsetX)
        .setVariable("shadowOffsetX", offsetY)
        .setVariable("shadowBlur", blur);
};

CanvasRenderer.prototype.clearShadow = function() {
    this.setVariable("shadowColor", "rgba(0,0,0,0)");
};

CanvasRenderer.prototype.setOpacity = function(opacity) {
    this.ctx.globalAlpha = opacity;
};

CanvasRenderer.prototype.setTransform = function(transform) {
    this.ctx.translate(transform.origin[0], transform.origin[1]);
    this.ctx.transform.apply(this.ctx, transform.matrix);
    this.ctx.translate(-transform.origin[0], -transform.origin[1]);
};

CanvasRenderer.prototype.setVariable = function(property, value) {
    if (this.variables[property] !== value) {
        this.variables[property] = this.ctx[property] = value;
    }

    return this;
};

CanvasRenderer.prototype.text = function(text, left, bottom) {
    this.ctx.fillText(text, left, bottom);
};

CanvasRenderer.prototype.backgroundRepeatShape = function(imageContainer, backgroundPosition, size, bounds, left, top, width, height, borderData) {
    var shape = [
        ["line", Math.round(left), Math.round(top)],
        ["line", Math.round(left + width), Math.round(top)],
        ["line", Math.round(left + width), Math.round(height + top)],
        ["line", Math.round(left), Math.round(height + top)]
    ];
    this.clip([shape], function() {
        this.renderBackgroundRepeat(imageContainer, backgroundPosition, size, bounds, borderData[3], borderData[0]);
    }, this);
};

CanvasRenderer.prototype.renderBackgroundRepeat = function(imageContainer, backgroundPosition, size, bounds, borderLeft, borderTop) {
    var offsetX = Math.round(bounds.left + backgroundPosition.left + borderLeft), offsetY = Math.round(bounds.top + backgroundPosition.top + borderTop);
    this.setFillStyle(this.ctx.createPattern(this.resizeImage(imageContainer, size), "repeat"));
    this.ctx.translate(offsetX, offsetY);
    this.ctx.fill();
    this.ctx.translate(-offsetX, -offsetY);
};

CanvasRenderer.prototype.renderBackgroundGradient = function(gradientImage, bounds) {
    if (gradientImage instanceof LinearGradientContainer) {
        var gradient = this.ctx.createLinearGradient(
            bounds.left + bounds.width * gradientImage.x0,
            bounds.top + bounds.height * gradientImage.y0,
            bounds.left +  bounds.width * gradientImage.x1,
            bounds.top +  bounds.height * gradientImage.y1);
        gradientImage.colorStops.forEach(function(colorStop) {
            gradient.addColorStop(colorStop.stop, colorStop.color.toString());
        });
        this.rectangle(bounds.left, bounds.top, bounds.width, bounds.height, gradient);
    }
};

CanvasRenderer.prototype.resizeImage = function(imageContainer, size) {
    var image = imageContainer.image;
    if(image.width === size.width && image.height === size.height) {
        return image;
    }

    var ctx, canvas = document.createElement('canvas');
    canvas.width = size.width;
    canvas.height = size.height;
    ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, size.width, size.height );
    return canvas;
};

function hasEntries(array) {
    return array.length > 0;
}

module.exports = CanvasRenderer;

},{"../lineargradientcontainer":12,"../log":13,"../renderer":19}],21:[function(_dereq_,module,exports){
var NodeContainer = _dereq_('./nodecontainer');

function StackingContext(hasOwnStacking, opacity, element, parent) {
    NodeContainer.call(this, element, parent);
    this.ownStacking = hasOwnStacking;
    this.contexts = [];
    this.children = [];
    this.opacity = (this.parent ? this.parent.stack.opacity : 1) * opacity;
}

StackingContext.prototype = Object.create(NodeContainer.prototype);

StackingContext.prototype.getParentStack = function(context) {
    var parentStack = (this.parent) ? this.parent.stack : null;
    return parentStack ? (parentStack.ownStacking ? parentStack : parentStack.getParentStack(context)) : context.stack;
};

module.exports = StackingContext;

},{"./nodecontainer":14}],22:[function(_dereq_,module,exports){
function Support(document) {
    this.rangeBounds = this.testRangeBounds(document);
    this.cors = this.testCORS();
    this.svg = this.testSVG();
}

Support.prototype.testRangeBounds = function(document) {
    var range, testElement, rangeBounds, rangeHeight, support = false;

    if (document.createRange) {
        range = document.createRange();
        if (range.getBoundingClientRect) {
            testElement = document.createElement('boundtest');
            testElement.style.height = "123px";
            testElement.style.display = "block";
            document.body.appendChild(testElement);

            range.selectNode(testElement);
            rangeBounds = range.getBoundingClientRect();
            rangeHeight = rangeBounds.height;

            if (rangeHeight === 123) {
                support = true;
            }
            document.body.removeChild(testElement);
        }
    }

    return support;
};

Support.prototype.testCORS = function() {
    return typeof((new Image()).crossOrigin) !== "undefined";
};

Support.prototype.testSVG = function() {
    var img = new Image();
    var canvas = document.createElement("canvas");
    var ctx =  canvas.getContext("2d");
    img.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>";

    try {
        ctx.drawImage(img, 0, 0);
        canvas.toDataURL();
    } catch(e) {
        return false;
    }
    return true;
};

module.exports = Support;

},{}],23:[function(_dereq_,module,exports){
var XHR = _dereq_('./xhr');
var decode64 = _dereq_('./utils').decode64;

function SVGContainer(src) {
    this.src = src;
    this.image = null;
    var self = this;

    this.promise = this.hasFabric().then(function() {
        return (self.isInline(src) ? Promise.resolve(self.inlineFormatting(src)) : XHR(src));
    }).then(function(svg) {
        return new Promise(function(resolve) {
            window.html2canvas.svg.fabric.loadSVGFromString(svg, self.createCanvas.call(self, resolve));
        });
    });
}

SVGContainer.prototype.hasFabric = function() {
    return !window.html2canvas.svg || !window.html2canvas.svg.fabric ? Promise.reject(new Error("html2canvas.svg.js is not loaded, cannot render svg")) : Promise.resolve();
};

SVGContainer.prototype.inlineFormatting = function(src) {
    return (/^data:image\/svg\+xml;base64,/.test(src)) ? this.decode64(this.removeContentType(src)) : this.removeContentType(src);
};

SVGContainer.prototype.removeContentType = function(src) {
    return src.replace(/^data:image\/svg\+xml(;base64)?,/,'');
};

SVGContainer.prototype.isInline = function(src) {
    return (/^data:image\/svg\+xml/i.test(src));
};

SVGContainer.prototype.createCanvas = function(resolve) {
    var self = this;
    return function (objects, options) {
        var canvas = new window.html2canvas.svg.fabric.StaticCanvas('c');
        self.image = canvas.lowerCanvasEl;
        canvas
            .setWidth(options.width)
            .setHeight(options.height)
            .add(window.html2canvas.svg.fabric.util.groupSVGElements(objects, options))
            .renderAll();
        resolve(canvas.lowerCanvasEl);
    };
};

SVGContainer.prototype.decode64 = function(str) {
    return (typeof(window.atob) === "function") ? window.atob(str) : decode64(str);
};

module.exports = SVGContainer;

},{"./utils":26,"./xhr":28}],24:[function(_dereq_,module,exports){
var SVGContainer = _dereq_('./svgcontainer');

function SVGNodeContainer(node, _native) {
    this.src = node;
    this.image = null;
    var self = this;

    this.promise = _native ? new Promise(function(resolve, reject) {
        self.image = new Image();
        self.image.onload = resolve;
        self.image.onerror = reject;
        self.image.src = "data:image/svg+xml," + (new XMLSerializer()).serializeToString(node);
        if (self.image.complete === true) {
            resolve(self.image);
        }
    }) : this.hasFabric().then(function() {
        return new Promise(function(resolve) {
            window.html2canvas.svg.fabric.parseSVGDocument(node, self.createCanvas.call(self, resolve));
        });
    });
}

SVGNodeContainer.prototype = Object.create(SVGContainer.prototype);

module.exports = SVGNodeContainer;

},{"./svgcontainer":23}],25:[function(_dereq_,module,exports){
var NodeContainer = _dereq_('./nodecontainer');

function TextContainer(node, parent) {
    NodeContainer.call(this, node, parent);
}

TextContainer.prototype = Object.create(NodeContainer.prototype);

TextContainer.prototype.applyTextTransform = function() {
    this.node.data = this.transform(this.parent.css("textTransform"));
};

TextContainer.prototype.transform = function(transform) {
    var text = this.node.data;
    switch(transform){
        case "lowercase":
            return text.toLowerCase();
        case "capitalize":
            return text.replace(/(^|\s|:|-|\(|\))([a-z])/g, capitalize);
        case "uppercase":
            return text.toUpperCase();
        default:
            return text;
    }
};

function capitalize(m, p1, p2) {
    if (m.length > 0) {
        return p1 + p2.toUpperCase();
    }
}

module.exports = TextContainer;

},{"./nodecontainer":14}],26:[function(_dereq_,module,exports){
exports.smallImage = function smallImage() {
    return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
};

exports.bind = function(callback, context) {
    return function() {
        return callback.apply(context, arguments);
    };
};

/*
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */

exports.decode64 = function(base64) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var len = base64.length, i, encoded1, encoded2, encoded3, encoded4, byte1, byte2, byte3;

    var output = "";

    for (i = 0; i < len; i+=4) {
        encoded1 = chars.indexOf(base64[i]);
        encoded2 = chars.indexOf(base64[i+1]);
        encoded3 = chars.indexOf(base64[i+2]);
        encoded4 = chars.indexOf(base64[i+3]);

        byte1 = (encoded1 << 2) | (encoded2 >> 4);
        byte2 = ((encoded2 & 15) << 4) | (encoded3 >> 2);
        byte3 = ((encoded3 & 3) << 6) | encoded4;
        if (encoded3 === 64) {
            output += String.fromCharCode(byte1);
        } else if (encoded4 === 64 || encoded4 === -1) {
            output += String.fromCharCode(byte1, byte2);
        } else{
            output += String.fromCharCode(byte1, byte2, byte3);
        }
    }

    return output;
};

exports.getBounds = function(node) {
    if (node.getBoundingClientRect) {
        var clientRect = node.getBoundingClientRect();
        var width = node.offsetWidth == null ? clientRect.width : node.offsetWidth;
        return {
            top: clientRect.top,
            bottom: clientRect.bottom || (clientRect.top + clientRect.height),
            right: clientRect.left + width,
            left: clientRect.left,
            width:  width,
            height: node.offsetHeight == null ? clientRect.height : node.offsetHeight
        };
    }
    return {};
};

exports.offsetBounds = function(node) {
    var parent = node.offsetParent ? exports.offsetBounds(node.offsetParent) : {top: 0, left: 0};

    return {
        top: node.offsetTop + parent.top,
        bottom: node.offsetTop + node.offsetHeight + parent.top,
        right: node.offsetLeft + parent.left + node.offsetWidth,
        left: node.offsetLeft + parent.left,
        width: node.offsetWidth,
        height: node.offsetHeight
    };
};

exports.parseBackgrounds = function(backgroundImage) {
    var whitespace = ' \r\n\t',
        method, definition, prefix, prefix_i, block, results = [],
        mode = 0, numParen = 0, quote, args;
    var appendResult = function() {
        if(method) {
            if (definition.substr(0, 1) === '"') {
                definition = definition.substr(1, definition.length - 2);
            }
            if (definition) {
                args.push(definition);
            }
            if (method.substr(0, 1) === '-' && (prefix_i = method.indexOf('-', 1 ) + 1) > 0) {
                prefix = method.substr(0, prefix_i);
                method = method.substr(prefix_i);
            }
            results.push({
                prefix: prefix,
                method: method.toLowerCase(),
                value: block,
                args: args,
                image: null
            });
        }
        args = [];
        method = prefix = definition = block = '';
    };
    args = [];
    method = prefix = definition = block = '';
    backgroundImage.split("").forEach(function(c) {
        if (mode === 0 && whitespace.indexOf(c) > -1) {
            return;
        }
        switch(c) {
        case '"':
            if(!quote) {
                quote = c;
            } else if(quote === c) {
                quote = null;
            }
            break;
        case '(':
            if(quote) {
                break;
            } else if(mode === 0) {
                mode = 1;
                block += c;
                return;
            } else {
                numParen++;
            }
            break;
        case ')':
            if (quote) {
                break;
            } else if(mode === 1) {
                if(numParen === 0) {
                    mode = 0;
                    block += c;
                    appendResult();
                    return;
                } else {
                    numParen--;
                }
            }
            break;

        case ',':
            if (quote) {
                break;
            } else if(mode === 0) {
                appendResult();
                return;
            } else if (mode === 1) {
                if (numParen === 0 && !method.match(/^url$/i)) {
                    args.push(definition);
                    definition = '';
                    block += c;
                    return;
                }
            }
            break;
        }

        block += c;
        if (mode === 0) {
            method += c;
        } else {
            definition += c;
        }
    });

    appendResult();
    return results;
};

},{}],27:[function(_dereq_,module,exports){
var GradientContainer = _dereq_('./gradientcontainer');

function WebkitGradientContainer(imageData) {
    GradientContainer.apply(this, arguments);
    this.type = imageData.args[0] === "linear" ? GradientContainer.TYPES.LINEAR : GradientContainer.TYPES.RADIAL;
}

WebkitGradientContainer.prototype = Object.create(GradientContainer.prototype);

module.exports = WebkitGradientContainer;

},{"./gradientcontainer":9}],28:[function(_dereq_,module,exports){
function XHR(url) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);

        xhr.onload = function() {
            if (xhr.status === 200) {
                resolve(xhr.responseText);
            } else {
                reject(new Error(xhr.statusText));
            }
        };

        xhr.onerror = function() {
            reject(new Error("Network Error"));
        };

        xhr.send();
    });
}

module.exports = XHR;

},{}]},{},[4])(4)
});
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





















var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

// Determine the type of a variable/object.
var objType = function objType(obj) {
  var type = typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
  if (type === 'undefined') return 'undefined';else if (type === 'string' || obj instanceof String) return 'string';else if (type === 'number' || obj instanceof Number) return 'number';else if (type === 'function' || obj instanceof Function) return 'function';else if (!!obj && obj.constructor === Array) return 'array';else if (obj && obj.nodeType === 1) return 'element';else if (type === 'object') return 'object';else return 'unknown';
};

// Create an HTML element with optional className, innerHTML, and style.
var createElement = function createElement(tagName, opt) {
  var el = document.createElement(tagName);
  if (opt.className) el.className = opt.className;
  if (opt.innerHTML) {
    el.innerHTML = opt.innerHTML;
    var scripts = el.getElementsByTagName('script');
    for (var i = scripts.length; i-- > 0; null) {
      scripts[i].parentNode.removeChild(scripts[i]);
    }
  }
  for (var key in opt.style) {
    el.style[key] = opt.style[key];
  }
  return el;
};

// Deep-clone a node and preserve contents/properties.
var cloneNode = function cloneNode(node, javascriptEnabled) {
  // Recursively clone the node.
  var clone = node.nodeType === 3 ? document.createTextNode(node.nodeValue) : node.cloneNode(false);
  for (var child = node.firstChild; child; child = child.nextSibling) {
    if (javascriptEnabled === true || child.nodeType !== 1 || child.nodeName !== 'SCRIPT') {
      clone.appendChild(cloneNode(child, javascriptEnabled));
    }
  }

  if (node.nodeType === 1) {
    // Preserve contents/properties of special nodes.
    if (node.nodeName === 'CANVAS') {
      clone.width = node.width;
      clone.height = node.height;
      clone.getContext('2d').drawImage(node, 0, 0);
    } else if (node.nodeName === 'TEXTAREA' || node.nodeName === 'SELECT') {
      clone.value = node.value;
    }

    // Preserve the node's scroll position when it loads.
    clone.addEventListener('load', function () {
      clone.scrollTop = node.scrollTop;
      clone.scrollLeft = node.scrollLeft;
    }, true);
  }

  // Return the cloned node.
  return clone;
};

// Convert units using the conversion value 'k' from jsPDF.
var unitConvert = function unitConvert(obj, k) {
  var newObj = {};
  for (var key in obj) {
    newObj[key] = obj[key] * 72 / 96 / k;
  }
  return newObj;
};

/* ----- CONSTRUCTOR ----- */

var Worker = function Worker(opt) {
  // Create the root parent for the proto chain, and the starting Worker.
  var root = _extends(Worker.convert(Promise.resolve()), JSON.parse(JSON.stringify(Worker.template)));
  var self = Worker.convert(Promise.resolve(), root);

  // Set progress, optional settings, and return.
  self = self.setProgress(1, Worker, 1, [Worker]);
  self = self.set(opt);
  return self;
};

// Boilerplate for subclassing Promise.
Worker.prototype = Object.create(Promise.prototype);
Worker.prototype.constructor = Worker;

// Converts/casts promises into Workers.
Worker.convert = function convert(promise, inherit) {
  // Uses prototypal inheritance to receive changes made to ancestors' properties.
  promise.__proto__ = inherit || Worker.prototype;
  return promise;
};

Worker.template = {
  prop: {
    src: null,
    container: null,
    overlay: null,
    canvas: null,
    img: null,
    pdf: null,
    pageSize: null
  },
  progress: {
    val: 0,
    state: null,
    n: 0,
    stack: []
  },
  opt: {
    filename: 'file.pdf',
    margin: [0, 0, 0, 0],
    image: { type: 'jpeg', quality: 0.95 },
    enableLinks: true,
    html2canvas: {},
    jsPDF: {}
  }
};

/* ----- FROM / TO ----- */

Worker.prototype.from = function from(src, type) {
  function getType(src) {
    switch (objType(src)) {
      case 'string':
        return 'string';
      case 'element':
        return src.nodeName.toLowerCase === 'canvas' ? 'canvas' : 'element';
      default:
        return 'unknown';
    }
  }

  return this.then(function from_main() {
    type = type || getType(src);
    switch (type) {
      case 'string':
        return this.set({ src: createElement('div', { innerHTML: src }) });
      case 'element':
        return this.set({ src: src });
      case 'canvas':
        return this.set({ canvas: src });
      case 'img':
        return this.set({ img: src });
      default:
        return this.error('Unknown source type.');
    }
  });
};

Worker.prototype.to = function to(target) {
  // Route the 'to' request to the appropriate method.
  switch (target) {
    case 'container':
      return this.toContainer();
    case 'canvas':
      return this.toCanvas();
    case 'img':
      return this.toImg();
    case 'pdf':
      return this.toPdf();
    default:
      return this.error('Invalid target.');
  }
};

Worker.prototype.toContainer = function toContainer() {
  // Set up function prerequisites.
  var prereqs = [function checkSrc() {
    return this.prop.src || this.error('Cannot duplicate - no source HTML.');
  }, function checkPageSize() {
    return this.prop.pageSize || this.setPageSize();
  }];

  return this.thenList(prereqs).then(function toContainer_main() {
    // Define the CSS styles for the container and its overlay parent.
    var overlayCSS = {
      position: 'fixed', overflow: 'hidden', zIndex: 1000,
      left: 0, right: 0, bottom: 0, top: 0,
      backgroundColor: 'rgba(0,0,0,0.8)'
    };
    var containerCSS = {
      position: 'absolute', width: this.prop.pageSize.inner.width + this.prop.pageSize.unit,
      left: 0, right: 0, top: 0, height: 'auto', margin: 'auto',
      backgroundColor: 'white'
    };

    // Set the overlay to hidden (could be changed in the future to provide a print preview).
    overlayCSS.opacity = 0;

    // Create and attach the elements.
    var source = cloneNode(this.prop.src, this.opt.html2canvas.javascriptEnabled);
    this.prop.overlay = createElement('div', { className: 'html2pdf__overlay', style: overlayCSS });
    this.prop.container = createElement('div', { className: 'html2pdf__container', style: containerCSS });
    this.prop.container.appendChild(source);
    this.prop.overlay.appendChild(this.prop.container);
    document.body.appendChild(this.prop.overlay);
  });
};

Worker.prototype.toPages = function toPages() {
  var rows = this.prop.container.querySelectorAll('.report-row');
  var new_container = document.createElement('div');
  var page_num = 0;

  var pages = new Array();
  Array.prototype.forEach.call(rows, function rows_loop(row, i) {
    if (pages[page_num] == undefined) {
      pages[page_num] = document.createElement('div');
      pages[page_num].className = "pdf-report pdf-page page-" + page_num;
    }
    var row_copy = row.cloneNode(true);
    pages[page_num].appendChild(row_copy);
    if (row.classList.contains('end-page')) page_num++;
  }, this);

  Array.prototype.forEach.call(pages, function pages_loop(page, i) {
    new_container.appendChild(page);
  }, this);

  this.prop.container.innerHTML = new_container.innerHTML;
};

Worker.prototype.toCanvas = function toCanvas() {
  // Set up function prerequisites.
  var prereqs = [function checkContainer() {
    return document.body.contains(this.prop.container) || this.toContainer();
  }];

  // Fulfill prereqs then create the canvas.
  var canvas_array = [];
  return this.thenList(prereqs).then(function toCanvas_main() {
    // Handle old-fashioned 'onrendered' argument.
    var options = _extends({}, this.opt.html2canvas);
    delete options.onrendered;

    this.toPages();

    var canvas_pages = this.prop.container.querySelectorAll('.pdf-page');
    // Array.prototype.forEach.call(canvas_pages, function canvas_page_loop(page, i) {
    //   canvas_array[i] = html2canvas(page, options);
    // }, this);

    // return Promise.all(canvas_array).then(function (data) {
    //   return data;
    // });

    // return new Promise(function(resolve, reject){
    //     console.log('die');
    // });

    return new Promise(function (resolve, reject) {
      var chain = Promise.resolve();
      var real_count = 0;
      for (var i = 0; i < canvas_pages.length; i++) {
        chain = chain.then(function () {
          return html2canvas$1(canvas_pages[real_count], options).then(function (canvas) {
            canvas_array[real_count] = canvas;
            if (real_count === canvas_pages.length - 1) resolve(canvas_array);
            real_count++;
          });
        });
      }
    });

    //return html2canvas(this.prop.container, options);
  }).then(function toCanvas_post(canvas) {
    // Handle old-fashioned 'onrendered' argument.
    var onRendered = this.opt.html2canvas.onrendered || function () {};
    onRendered(canvas);

    this.prop.canvas = canvas;
    document.body.removeChild(this.prop.overlay);
  });
};

Worker.prototype.toImg = function toImg() {
  // Set up function prerequisites.
  var prereqs = [function checkCanvas() {
    return this.prop.canvas || this.toCanvas();
  }];

  // Fulfill prereqs then create the image.
  return this.thenList(prereqs).then(function toImg_main() {
    var imgData = this.prop.canvas.toDataURL('image/' + this.opt.image.type, this.opt.image.quality);
    this.prop.img = document.createElement('img');
    this.prop.img.src = imgData;
  });
};

Worker.prototype.toPdf = function toPdf() {
  // Set up function prerequisites.
  var prereqs = [function checkCanvas() {
    return this.prop.canvas || this.toCanvas();
  }];

  // Fulfill prereqs then create the image.
  return this.thenList(prereqs).then(function toPdf_main() {
    // Create local copies of frequently used properties.
    var canvas = this.prop.canvas;
    var opt = this.opt;

    // Calculate the number of pages.
    var nPages = canvas.length;

    // Define pageHeight separately so it can be trimmed on the final page.
    var pageHeight = this.prop.pageSize.inner.height;

    // Initialize the PDF.
    this.prop.pdf = this.prop.pdf || new jspdf_min(opt.jsPDF);

    for (var page = 0; page < nPages; page++) {
      // Create a one-page canvas to split up the full image.
      var pxPageHeight = Math.floor(canvas[page].width * this.prop.pageSize.inner.ratio);
      var pageCanvas = document.createElement('canvas');
      var pageCtx = pageCanvas.getContext('2d');
      pageCanvas.width = canvas[page].width;
      pageCanvas.height = pxPageHeight;
      pageCanvas.height = canvas[page].height % pxPageHeight;
      pageHeight = pageCanvas.height * this.prop.pageSize.inner.width / pageCanvas.width;

      // Display the page.
      var w = pageCanvas.width;
      var h = pageCanvas.height;
      pageCtx.fillStyle = 'white';
      pageCtx.fillRect(0, 0, w, h);
      pageCtx.drawImage(canvas[page], 0, 0, w, h, 0, 0, w, h);

      // Add the page to the PDF.
      if (page) this.prop.pdf.addPage();
      var imgData = pageCanvas.toDataURL('image/' + opt.image.type, opt.image.quality);
      this.prop.pdf.addImage(imgData, opt.image.type, opt.margin[1], opt.margin[0], this.prop.pageSize.inner.width, pageHeight);
    }
  });
};

/* ----- OUTPUT / SAVE ----- */

Worker.prototype.output = function output(type, options, src) {
  // Redirect requests to the correct function (outputPdf / outputImg).
  src = src || 'pdf';
  if (src.toLowerCase() === 'img' || src.toLowerCase() === 'image') {
    return this.outputImg(type, options);
  } else {
    return this.outputPdf(type, options);
  }
};

Worker.prototype.outputPdf = function outputPdf(type, options) {
  // Set up function prerequisites.
  var prereqs = [function checkPdf() {
    return this.prop.pdf || this.toPdf();
  }];

  // Fulfill prereqs then perform the appropriate output.
  return this.thenList(prereqs).then(function outputPdf_main() {
    /* Currently implemented output types:
     *    https://rawgit.com/MrRio/jsPDF/master/docs/jspdf.js.html#line992
     *  save(options), arraybuffer, blob, bloburi/bloburl,
     *  datauristring/dataurlstring, dataurlnewwindow, datauri/dataurl
     */
    return this.prop.pdf.output(type, options);
  });
};

Worker.prototype.outputImg = function outputImg(type, options) {
  // Set up function prerequisites.
  var prereqs = [function checkImg() {
    return this.prop.img || this.toImg();
  }];

  // Fulfill prereqs then perform the appropriate output.
  return this.thenList(prereqs).then(function outputImg_main() {
    switch (type) {
      case undefined:
      case 'img':
        return this.prop.img;
      case 'datauristring':
      case 'dataurlstring':
        return this.prop.img.src;
      case 'datauri':
      case 'dataurl':
        return document.location.href = this.prop.img.src;
      default:
        throw 'Image output type "' + type + '" is not supported.';
    }
  });
};

Worker.prototype.save = function save(filename) {
  // Set up function prerequisites.
  var prereqs = [function checkPdf() {
    return this.prop.pdf || this.toPdf();
  }];

  // Fulfill prereqs, update the filename (if provided), and save the PDF.
  return this.thenList(prereqs).set(filename ? { filename: filename } : null).then(function save_main() {
    return this.prop.pdf;
  });
};

/* ----- SET / GET ----- */

Worker.prototype.set = function set$$1(opt) {
  // TODO: Implement ordered pairs?

  // Silently ignore invalid or empty input.
  if (objType(opt) !== 'object') {
    return this;
  }

  // Build an array of setter functions to queue.
  var fns = Object.keys(opt || {}).map(function (key) {
    if (key in Worker.template.prop) {
      // Set pre-defined properties.
      return function set_prop() {
        this.prop[key] = opt[key];
      };
    } else {
      switch (key) {
        case 'margin':
          return this.setMargin.bind(this, opt.margin);
        case 'jsPDF':
          return function set_jsPDF() {
            this.opt.jsPDF = opt.jsPDF;return this.setPageSize();
          };
        case 'pageSize':
          return this.setPageSize.bind(this, opt.pageSize);
        default:
          // Set any other properties in opt.
          return function set_opt() {
            this.opt[key] = opt[key];
          };
      }
    }
  }, this);

  // Set properties within the promise chain.
  return this.then(function set_main() {
    return this.thenList(fns);
  });
};

Worker.prototype.get = function get$$1(key, cbk) {
  return this.then(function get_main() {
    // Fetch the requested property, either as a predefined prop or in opt.
    var val = key in Worker.template.prop ? this.prop[key] : this.opt[key];
    return cbk ? cbk(val) : val;
  });
};

Worker.prototype.setMargin = function setMargin(margin) {
  return this.then(function setMargin_main() {
    // Parse the margin property.
    switch (objType(margin)) {
      case 'number':
        margin = [margin, margin, margin, margin];
      case 'array':
        if (margin.length === 2) {
          margin = [margin[0], margin[1], margin[0], margin[1]];
        }
        if (margin.length === 4) {
          break;
        }
      default:
        return this.error('Invalid margin array.');
    }

    // Set the margin property, then update pageSize.
    this.opt.margin = margin;
  }).then(this.setPageSize);
};

Worker.prototype.setPageSize = function setPageSize(pageSize) {
  function toPx(val, k) {
    return Math.floor(val * k / 72 * 96);
  }

  return this.then(function setPageSize_main() {
    // Retrieve page-size based on jsPDF settings, if not explicitly provided.
    pageSize = pageSize || jspdf_min.getPageSize(this.opt.jsPDF);

    // Add 'inner' field if not present.
    if (!pageSize.hasOwnProperty('inner')) {
      pageSize.inner = {
        width: pageSize.width - this.opt.margin[1] - this.opt.margin[3],
        height: pageSize.height - this.opt.margin[0] - this.opt.margin[2]
      };
      pageSize.inner.px = {
        width: toPx(pageSize.inner.width, pageSize.k),
        height: toPx(pageSize.inner.height, pageSize.k)
      };
      pageSize.inner.ratio = pageSize.inner.height / pageSize.inner.width;
    }

    // Attach pageSize to this.
    this.prop.pageSize = pageSize;
  });
};

Worker.prototype.setProgress = function setProgress(val, state, n, stack) {
  // Immediately update all progress values.
  if (val != null) this.progress.val = val;
  if (state != null) this.progress.state = state;
  if (n != null) this.progress.n = n;
  if (stack != null) this.progress.stack = stack;
  this.progress.ratio = this.progress.val / this.progress.state;

  // Return this for command chaining.
  return this;
};

Worker.prototype.updateProgress = function updateProgress(val, state, n, stack) {
  // Immediately update all progress values, using setProgress.
  return this.setProgress(val ? this.progress.val + val : null, state ? state : null, n ? this.progress.n + n : null, stack ? this.progress.stack.concat(stack) : null);
};

/* ----- PROMISE MAPPING ----- */

Worker.prototype.then = function then(onFulfilled, onRejected) {
  // Wrap `this` for encapsulation.
  var self = this;

  return this.thenCore(onFulfilled, onRejected, function then_main(onFulfilled, onRejected) {
    // Update progress while queuing, calling, and resolving `then`.
    self.updateProgress(null, null, 1, [onFulfilled]);
    return Promise.prototype.then.call(this, function then_pre(val) {
      self.updateProgress(null, onFulfilled);
      return val;
    }).then(onFulfilled, onRejected).then(function then_post(val) {
      self.updateProgress(1);
      return val;
    });
  });
};

Worker.prototype.thenCore = function thenCore(onFulfilled, onRejected, thenBase) {
  // Handle optional thenBase parameter.
  thenBase = thenBase || Promise.prototype.then;

  // Wrap `this` for encapsulation and bind it to the promise handlers.
  var self = this;
  if (onFulfilled) {
    onFulfilled = onFulfilled.bind(self);
  }
  if (onRejected) {
    onRejected = onRejected.bind(self);
  }

  // Cast self into a Promise to avoid polyfills recursively defining `then`.
  var isNative = Promise.toString().indexOf('[native code]') !== -1 && Promise.name === 'Promise';
  var selfPromise = isNative ? self : Worker.convert(_extends({}, self), Promise.prototype);

  // Return the promise, after casting it into a Worker and preserving props.
  var returnVal = thenBase.call(selfPromise, onFulfilled, onRejected);
  return Worker.convert(returnVal, self.__proto__);
};

Worker.prototype.thenExternal = function thenExternal(onFulfilled, onRejected) {
  // Call `then` and return a standard promise (exits the Worker chain).
  return Promise.prototype.then.call(this, onFulfilled, onRejected);
};

Worker.prototype.thenList = function thenList(fns) {
  // Queue a series of promise 'factories' into the promise chain.
  var self = this;
  fns.forEach(function thenList_forEach(fn) {
    self = self.thenCore(fn);
  });
  return self;
};

Worker.prototype['catch'] = function (onRejected) {
  // Bind `this` to the promise handler, call `catch`, and return a Worker.
  if (onRejected) {
    onRejected = onRejected.bind(this);
  }
  var returnVal = Promise.prototype['catch'].call(this, onRejected);
  return Worker.convert(returnVal, this);
};

Worker.prototype.catchExternal = function catchExternal(onRejected) {
  // Call `catch` and return a standard promise (exits the Worker chain).
  return Promise.prototype['catch'].call(this, onRejected);
};

Worker.prototype.error = function error(msg) {
  // Throw the error in the Promise chain.
  return this.then(function error_main() {
    throw new Error(msg);
  });
};

/* ----- ALIASES ----- */

Worker.prototype.using = Worker.prototype.set;
Worker.prototype.saveAs = Worker.prototype.save;
Worker.prototype.export = Worker.prototype.output;
Worker.prototype.run = Worker.prototype.then;

// Import dependencies.
// Get dimensions of a PDF page, as determined by jsPDF.
jspdf_min.getPageSize = function (orientation, unit, format) {
  // Decode options object
  if ((typeof orientation === 'undefined' ? 'undefined' : _typeof(orientation)) === 'object') {
    var options = orientation;
    orientation = options.orientation;
    unit = options.unit || unit;
    format = options.format || format;
  }

  // Default options
  unit = unit || 'mm';
  format = format || 'a4';
  orientation = ('' + (orientation || 'P')).toLowerCase();
  var format_as_string = ('' + format).toLowerCase();

  // Size in pt of various paper formats
  var pageFormats = {
    'a0': [2383.94, 3370.39], 'a1': [1683.78, 2383.94],
    'a2': [1190.55, 1683.78], 'a3': [841.89, 1190.55],
    'a4': [595.28, 841.89], 'a5': [419.53, 595.28],
    'a6': [297.64, 419.53], 'a7': [209.76, 297.64],
    'a8': [147.40, 209.76], 'a9': [104.88, 147.40],
    'a10': [73.70, 104.88], 'b0': [2834.65, 4008.19],
    'b1': [2004.09, 2834.65], 'b2': [1417.32, 2004.09],
    'b3': [1000.63, 1417.32], 'b4': [708.66, 1000.63],
    'b5': [498.90, 708.66], 'b6': [354.33, 498.90],
    'b7': [249.45, 354.33], 'b8': [175.75, 249.45],
    'b9': [124.72, 175.75], 'b10': [87.87, 124.72],
    'c0': [2599.37, 3676.54], 'c1': [1836.85, 2599.37],
    'c2': [1298.27, 1836.85], 'c3': [918.43, 1298.27],
    'c4': [649.13, 918.43], 'c5': [459.21, 649.13],
    'c6': [323.15, 459.21], 'c7': [229.61, 323.15],
    'c8': [161.57, 229.61], 'c9': [113.39, 161.57],
    'c10': [79.37, 113.39], 'dl': [311.81, 623.62],
    'letter': [612, 792],
    'government-letter': [576, 756],
    'legal': [612, 1008],
    'junior-legal': [576, 360],
    'ledger': [1224, 792],
    'tabloid': [792, 1224],
    'credit-card': [153, 243]
  };

  // Unit conversion
  switch (unit) {
    case 'pt':
      var k = 1;break;
    case 'mm':
      var k = 72 / 25.4;break;
    case 'cm':
      var k = 72 / 2.54;break;
    case 'in':
      var k = 72;break;
    case 'px':
      var k = 72 / 96;break;
    case 'pc':
      var k = 12;break;
    case 'em':
      var k = 12;break;
    case 'ex':
      var k = 6;break;
    default:
      throw 'Invalid unit: ' + unit;
  }

  // Dimensions are stored as user units and converted to points on output
  if (pageFormats.hasOwnProperty(format_as_string)) {
    var pageHeight = pageFormats[format_as_string][1] / k;
    var pageWidth = pageFormats[format_as_string][0] / k;
  } else {
    try {
      var pageHeight = format[1];
      var pageWidth = format[0];
    } catch (err) {
      throw new Error('Invalid format: ' + format);
    }
  }

  // Handle page orientation
  if (orientation === 'p' || orientation === 'portrait') {
    orientation = 'p';
    if (pageWidth > pageHeight) {
      var tmp = pageWidth;
      pageWidth = pageHeight;
      pageHeight = tmp;
    }
  } else if (orientation === 'l' || orientation === 'landscape') {
    orientation = 'l';
    if (pageHeight > pageWidth) {
      var tmp = pageWidth;
      pageWidth = pageHeight;
      pageHeight = tmp;
    }
  } else {
    throw 'Invalid orientation: ' + orientation;
  }

  // Return information (k is the unit conversion ratio from pts)
  var info = { 'width': pageWidth, 'height': pageHeight, 'unit': unit, 'k': k };
  return info;
};

var orig = {
  toContainer: Worker.prototype.toContainer
};

Worker.prototype.toContainer = function toContainer() {
  return orig.toContainer.call(this).then(function toContainer_pagebreak() {
    // Enable page-breaks.
    var pageBreaks = this.prop.container.querySelectorAll('.html2pdf__page-break');
    var pxPageHeight = this.prop.pageSize.inner.px.height;
    Array.prototype.forEach.call(pageBreaks, function pageBreak_loop(el) {
      el.style.display = 'block';
      var clientRect = el.getBoundingClientRect();
      el.style.height = pxPageHeight - clientRect.top % pxPageHeight + 'px';
    }, this);

    // Enable smart page-breaks.
    var pageBreaks = this.prop.container.querySelectorAll('.html2pdf__smart-page-break');
    Array.prototype.forEach.call(pageBreaks, function smartPageBreak_loop(el, i) {
      el.style.display = 'block';
      var clientRect = el.getBoundingClientRect();
      var space_left = pxPageHeight - clientRect.top % pxPageHeight;
      var next_break = pageBreaks[i + 1];
      if (next_break) {
        var parent = next_break.parentElement;
        if (parent.offsetHeight + 100 < space_left) space_left = 0;
        if (space_left) el.parentElement.parentElement.classList.add('end-page');
        el.style.height = space_left + 'px';
      }
    }, this);
  });
};

// Add hyperlink functionality to the PDF creation.

// Main link array, and refs to original functions.
var linkInfo = [];
var orig$1 = {
  toContainer: Worker.prototype.toContainer,
  toPdf: Worker.prototype.toPdf
};

Worker.prototype.toContainer = function toContainer() {
  return orig$1.toContainer.call(this).then(function toContainer_hyperlink() {
    // Retrieve hyperlink info if the option is enabled.
    if (this.opt.enableLinks) {
      // Find all anchor tags and get the container's bounds for reference.
      var container = this.prop.container;
      var links = container.querySelectorAll('a');
      var containerRect = unitConvert(container.getBoundingClientRect(), this.prop.pageSize.k);
      linkInfo = [];

      // Loop through each anchor tag.
      Array.prototype.forEach.call(links, function (link) {
        // Treat each client rect as a separate link (for text-wrapping).
        var clientRects = link.getClientRects();
        for (var i = 0; i < clientRects.length; i++) {
          var clientRect = unitConvert(clientRects[i], this.prop.pageSize.k);
          clientRect.left -= containerRect.left;
          clientRect.top -= containerRect.top;

          var page = Math.floor(clientRect.top / this.prop.pageSize.inner.height) + 1;
          var top = this.opt.margin[0] + clientRect.top % this.prop.pageSize.inner.height;
          var left = this.opt.margin[1] + clientRect.left;

          linkInfo.push({ page: page, top: top, left: left, clientRect: clientRect, link: link });
        }
      }, this);
    }
  });
};

Worker.prototype.toPdf = function toPdf() {
  return orig$1.toPdf.call(this).then(function toPdf_hyperlink() {
    // Add hyperlinks if the option is enabled.
    if (this.opt.enableLinks) {
      // Attach each anchor tag based on info from toContainer().
      linkInfo.forEach(function (l) {
        this.prop.pdf.setPage(l.page);
        this.prop.pdf.link(l.left, l.top, l.clientRect.width, l.clientRect.height, { url: l.link.href });
      }, this);

      // Reset the active page of the PDF to the final page.
      var nPages = this.prop.pdf.internal.getNumberOfPages();
      this.prop.pdf.setPage(nPages);
    }
  });
};

/**
 * Generate a PDF from an HTML element or string using html2canvas and jsPDF.
 *
 * @param {Element|string} source The source element or HTML string.
 * @param {Object=} opt An object of optional settings: 'margin', 'filename',
 *    'image' ('type' and 'quality'), and 'html2canvas' / 'jspdf', which are
 *    sent as settings to their corresponding functions.
 */
var html2pdf = function html2pdf(src, opt) {
  // Create a new worker with the given options.
  var worker = new html2pdf.Worker(opt);

  if (src) {
    // If src is specified, perform the traditional 'simple' operation.
    return worker.from(src).save();
  } else {
    // Otherwise, return the worker for new Promise-based operation.
    return worker;
  }
};
html2pdf.Worker = Worker;

return html2pdf;

})));
