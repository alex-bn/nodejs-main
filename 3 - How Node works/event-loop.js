const fs = require('fs');
const crypto = require('crypto');

const start = Date.now();
process.env.UV_THREADPOOL_SIZE = 4;

setTimeout(() => console.log(1, 'Timer 1 finished'), 0);
setImmediate(() => console.log(2, 'Immediate 1 finished'));

fs.readFile('test-file.txt', () => {
  console.log(3, 'I/O finished');
  console.log(4, '------------------');

  setTimeout(() => console.log(5, 'Timer 2 finished'), 0);
  setTimeout(() => console.log(6, 'Timer 3 finished'), 3000);
  setImmediate(() => console.log(7, 'Immediate 2 finished'));

  process.nextTick(() => {
    console.log(8, 'Process.nextTick');
  });

  // Not Blocking
  crypto.pbkdf2('password', 'salt', 100000, 4096, 'sha512', () => {
    console.log(Date.now() - start, 'Password encrypted');
  });
  crypto.pbkdf2('password', 'salt', 100000, 4096, 'sha512', () => {
    console.log(Date.now() - start, 'Password encrypted');
  });
  crypto.pbkdf2('password', 'salt', 100000, 4096, 'sha512', () => {
    console.log(Date.now() - start, 'Password encrypted');
  });
  crypto.pbkdf2('password', 'salt', 100000, 4096, 'sha512', () => {
    console.log(Date.now() - start, 'Password encrypted');
  });

  // Blocking
  crypto.pbkdf2Sync('password', 'salt', 100000, 4096, 'sha512');
  console.log(Date.now() - start, 'Password encrypted');
  crypto.pbkdf2Sync('password', 'salt', 100000, 4096, 'sha512');
  console.log(Date.now() - start, 'Password encrypted');
  crypto.pbkdf2Sync('password', 'salt', 100000, 4096, 'sha512');
  console.log(Date.now() - start, 'Password encrypted');
  crypto.pbkdf2Sync('password', 'salt', 100000, 4096, 'sha512');
  console.log(Date.now() - start, 'Password encrypted');
});

console.log(9, 'Hello from the top-level code');
