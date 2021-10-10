const fs = require('fs');
const http = require('http');
const url = require('url');

/////////////////////////////////////////////////////////////////////
// SIMPLE SERVER & BASIC ROUTING//

const server = http.createServer((req, res) => {
  const pathName = req.url;

  if (pathName === '/' || pathName === '/overview') {
    res.end('This will be the OVERVIEW page');
  } else if (pathName === '/product') {
    res.end('This will be the PRODUCT page');
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page not found.</h1>');
  }
});
// res.end('Hello from the node server!');

server.listen(8081, 'localhost', () => {
  console.log('Server is listening on port 8081..');
});
