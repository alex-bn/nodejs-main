const fs = require('fs');
const superagent = require('superagent');

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

const getDogPic = async () => {
  try {
    // 1
    const data = await readFilePromise(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);
    // 2
    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);
    // 3
    await writeFilePromise('dog-img.txt', res.body.message);
    console.log('Image saved to file.');
  } catch (error) {
    // 4
    console.log(error);
    throw error;
  }
  return '2: READY 🚲'; // adding a new return value will return in fact another promise, which will need to be consumed in order to extract the returned value, see solutions
};

// Solution 1: getting the error from the rest of the promises in case there is one:
/*
console.log('1: Will get pitbull pics');
getDogPic()
  .then(x => {
    console.log(x);
    console.log('3: Done getting the pics!');
  })
  .catch(err => {
    console.log('ERROR: 🎃');
  });
*/

// an async function automatically returns a promise and the value that we return from an async function will be the resolved value of that promise
// Solution 2: immediately invoked function expression IIFE
(async () => {
  //
  try {
    console.log('1: Will get pitbull pics');
    const x = await getDogPic();
    console.log(x);
    console.log('3: Done getting the pics!');
  } catch (error) {
    console.log('ERROR: 🎃');
  }
})();
