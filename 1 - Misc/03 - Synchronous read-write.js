const fs = require('fs');

// // Blocking, synchronous way
// // If the encoding option is specified then this function returns a string. Otherwise it returns a buffer.

const textIn = fs.readFileSync('./txt/input.txt', 'utf8');
console.log(textIn);

const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;

fs.writeFileSync('./txt/output.txt', textOut);
console.log('File written');
