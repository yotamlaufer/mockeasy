MockEasy
---

MockEasy is a simple yet powerful mocking library for NodeJS.
 
A good use case for this library is mocking data access objects in tests, negating the use of a database. 

Example
---

```js
// math.js
exports.increment = function(value, callback) {
  callback(null, value++);
}
```

```js
// test.js
const mockeasy = require('mockeasy');
const mockedMath = mockeasy.stub(require('./math'));

mockedMath.increment.one(function(value, callback) {
  callback(null, 100);
});

console.log(mockedMath.increment());
// 100

console.log(mockedMath.increment());
// throws error
```



