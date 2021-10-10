const fs = require('fs');
const superagent = require('superagent');

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

// 4 // Async/Await

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
  }
};
getDogPic();
