const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

// Windows: SET NODE_ENV=development & nodemon server.js
// Linux: NODE_ENV=development nodemon server.js

// console.log(app.get('env'));
// console.log(process.env);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
