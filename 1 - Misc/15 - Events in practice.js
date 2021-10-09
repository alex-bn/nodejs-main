const EventEmitter = require('events');
const http = require('http');

class Sales extends EventEmitter {
  constructor() {
    super();
  }
}

const myEmitter = new Sales();

// THE OBSERVER PATTERN //

// Observer 1:
myEmitter.on('newSale', () => {
  console.log('There was a new sale');
});

// Observer 2:
myEmitter.on('newSale', () => {
  console.log('Customer name jonas');
});

// Observer 3:
myEmitter.on('newSale', stock => {
  console.log(`There are now ${stock} items left in stock`);
});

// Emits the event:
myEmitter.emit('newSale', 9);

///////////////////
// Create server
const server = http.createServer();

// Listening to events
server.on('request', (req, res) => {
  console.log(req.url);
  console.log('Listener 1: request received');
  res.end('Request received');
});

server.on('request', (req, res) => {
  console.log('Listener 2: another request');
});

server.on('close', () => {
  console.log('Server closed');
});

// Start the sever
server.listen(8000, '127.0.0.1', () => {
  console.log('Server is waiting for requests on port 8000...');
});
