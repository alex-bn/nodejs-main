const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

/////////////////////////////////////////////////////////////////////
// FILES //

// // Blocking, synchronous way
// // If the encoding option is specified then this function returns a string. Otherwise it returns a buffer.

// const textIn = fs.readFileSync('./txt/input.txt', 'utf8');
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;

// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written');

// // Non-blocking asynchronous way

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   // in case of error:
//   if (err) return console.log('ERROR🥽');

//   console.log(1, 'Reading first file..');
//   fs.readFile(`./txta/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(2, data2);
//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       console.log(3, data3);

//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err =>
//         console.log(4, 'Your file has been written 🎈')
//       );
//     });
//   });
// });

// console.log(5, 'Reading files..');

/////////////////////////////////////////////////////////////////////
// SERVER & BASIC ROUTING & a SIMPLE API //

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-Type': 'text/html' });

    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);

    // Product page
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);

    // Not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h2>Error: Page not found!</h2>');
  }
});

server.listen(8081, 'localhost', () => {
  console.log('Server is listening on port 8081..');
});
