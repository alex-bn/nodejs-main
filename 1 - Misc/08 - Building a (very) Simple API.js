const fs = require('fs');
const http = require('http');
const url = require('url');

/////////////////////////////////////////////////////////////////////
// SERVER & BASIC ROUTING & a (VERY) SIMPLE API //

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathName = req.url;

  if (pathName === '/' || pathName === '/overview') {
    res.end('This will be the OVERVIEW page');
  } else if (pathName === '/product') {
    res.end('This will be the PRODUCT page');
  } else if (pathName === '/api') {
    //
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);
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
