// shows if the next bits of code are actually in a wrapper function

console.log(arguments);
console.log(require('module').wrapper);
/*
will return:

[
  '(function (exports, require, module, __filename, __dirname) { ',
  '\n});'
]

*/

// module.exports
const C = require('./test-module-1');
const calc1 = new C();
console.log(calc1.add(2, 8));

// exports
const calc2 = require('./test-module-2');
console.log(calc2.add(2, 8));
console.log(calc2.multiply(2, 8));
console.log(calc2.divide(2, 8));

// destructuring
const { add, multiply, divide } = require('./test-module-2');
console.log(add(9, 8));
console.log(multiply(9, 8));
console.log(divide(9, 8));

// caching
require('./test-module-3')();
require('./test-module-3')();
require('./test-module-3')();
