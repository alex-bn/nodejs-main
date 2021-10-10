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

    // 2 // Waiting for multiple Promises Simultaneously:
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
