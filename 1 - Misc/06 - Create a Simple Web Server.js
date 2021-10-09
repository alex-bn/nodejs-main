const fs = require('fs');
const http = require('http');

///////////////////////////
// Simple Web Server //

const server = http.createServer((req, res) => {
  res.end('Hello from node simple web server');
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Server is listening on port 8000..');
});
