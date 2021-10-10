const fs = require('fs');
const superagent = require('superagent');

// Promisify readFile & writeFile functions -> returns a promise and only receives a file name, no callback

const readFilePromise = file => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject('I could not find that file 😥');
      resolve(data);
    });
  });
};

const writeFilePromise = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, err => {
      if (err) reject('Could not write to file 😱');
      resolve('Successfully written file!');
    });
  });
};

readFilePromise(`${__dirname}/dog.txt`)
  .then(data => {
    console.log(`Breed: ${data}`);
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then(res => {
    console.log(res.body.message);
    return writeFilePromise('dog-img.txt', res.body.message);
  })
  .then(() => console.log('Image saved to file.'))
  .catch(err => {
    console.log(err.message);
  });
