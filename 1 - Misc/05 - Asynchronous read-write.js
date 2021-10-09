const fs = require('fs');

// Non-blocking asynchronous way

fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
  // in case of error:
  if (err) return console.log('ERROR🥽');

  console.log(1, 'Reading first file..');
  fs.readFile(`./txta/${data1}.txt`, 'utf-8', (err, data2) => {
    console.log(2, data2);
    fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
      console.log(3, data3);

      fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err =>
        console.log(4, 'Your file has been written 🎈')
      );
    });
  });
});

console.log(5, 'Reading files..');
