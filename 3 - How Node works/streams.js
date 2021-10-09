const server = require('http').createServer();
const fs = require('fs');

// Problem: read a serve the data inside a large file(test-file.txt)

server.on('request', (req, res) => {
  // // Solution 1 -> not scalable for a production environment
  // fs.readFile('test-file.txt', (err, data) => {
  //   if (err) console.log(err);
  //   res.end(data);
  // });
  //
  // // Solution 2: streams
  // const readable = fs.createReadStream('test-file.txt');
  // readable.on('data', chunk => {
  //   res.write(chunk);
  // });
  // readable.on('end', () => {
  //   res.end();
  // });
  // readable.on('error', err => {
  //   console.log(err);
  //   res.statusCode = 500;
  //   res.end('File not found!');
  // });
  //
  // Solution 3: avoiding the back pressure -> the response cannot send the data nearly as fast as it is receiving from the file.
  const readable = fs.createReadStream('test-file.txt');
  readable.pipe(res);
  // readableSource.pipe(writeableDestination)
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Server listening on 8000...');
});
