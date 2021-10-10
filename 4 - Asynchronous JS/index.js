const fs = require('fs');
const superagent = require('superagent');

// 1 // Asynchronous with Callbacks:

// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//   console.log(`Breed: ${data}`);

//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .end((err, res) => {
//       if (err) return console.log(err.message);
//       console.log(res.body.message);

//       fs.writeFile('dog-img.txt', res.body.message, err => {
//         if (err) return console.log(err.message);
//         console.log('Pitbull saved to file');
//       });
//     });
// });

// 2 // Asynchronous with Promises / consuming:

// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//   console.log(`Breed: ${data}`);

//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .then(res => {
//       console.log(res.body.message);

//       fs.writeFile('dog-img.txt', res.body.message, err => {
//         if (err) return console.log(err.message);
//         console.log('Pitbull saved to file');
//       });
//     })
//     .catch(err => {
//       console.log(err.message);
//     });
// });

// 3 // Promisify readFile & writeFile functions -> returns a promise and only receives a file name, no callback

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

// readFilePromise(`${__dirname}/dog.txt`)
//   .then(data => {
//     console.log(`Breed: ${data}`);
//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   })
//   .then(res => {
//     console.log(res.body.message);
//     return writeFilePromise('dog-img.txt', res.body.message);
//   })
//   .then(() => console.log('Image saved to file.'))
//   .catch(err => {
//     console.log(err.message);
//   });

// 4 // Async/Await

// const getDogPic = async () => {
//   try {
//     // 1
//     const data = await readFilePromise(`${__dirname}/dog.txt`);
//     console.log(`Breed: ${data}`);
//     // 2
//     const res = await superagent.get(
//       `https://dog.ceo/api/breed/${data}/images/random`
//     );
//     console.log(res.body.message);
//     // 3
//     await writeFilePromise('dog-img.txt', res.body.message);
//     console.log('Image saved to file.');
//   } catch (error) {
//     // 4
//     console.log(error);
//     throw error;
//   }
//   return '2: READY 🚲'; // adding a new return value will return in fact another promise, which will need to be consumed in order to extract the returned value
// };

// Solution 1: to getting the error from the rest of the promises in case there is one:
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

// // an async function automatically returns a promise and the value that we return from an async function will be the resolved value of that promise
// // Solution 2: immediately invoked function expression IIFE
// (async () => {
//   //
//   try {
//     console.log('1: Will get pitbull pics');
//     const x = await getDogPic();
//     console.log(x);
//     console.log('3: Done getting the pics!');
//   } catch (error) {
//     console.log('ERROR: 🎃');
//   }
// })();

// 5 // Waiting for multiple Promises Simultaneously:

const getDogPic = async () => {
  try {
    // 1
    const data = await readFilePromise(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);
    // 2
    const res1Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res2Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res3Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const all = await Promise.all([res1Pro, res2Pro, res3Pro]);
    const images = all.map(el => el.body.message);
    console.log(images);

    // 3
    await writeFilePromise('dog-img.txt', images.join('\n'));
    console.log('Image saved to file.');
  } catch (error) {
    // 4
    console.log(error);
    throw error;
  }
  return '2: READY 🚲';
};

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
