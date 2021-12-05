const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

// 1) MIDDLEWAREs

// Parse HTTP request body
app.use(express.json());

// logging middleware
app.use(morgan('dev'));
// https://www.npmjs.com/package/morgan#write-logs-to-a-file

// simple middleware function
app.use((req, res, next) => {
  console.log('Hello from the middleware function 👍');
  next();
});

// middleware that adds the request time
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//
const dataFile = `${__dirname}/dev-data/data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(dataFile));

// 2) Route handlers
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'Success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid Id',
    });
  }
  res.status(200).json({
    status: 'Success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(dataFile, JSON.stringify(tours), err => {
    res.status(201).json({
      status: 'Success',
      data: {
        tours: newTour,
      },
    });
  });
};

const updateTour = (req, res) => {
  const id = +req.params.id;
  const tour = tours.find(el => el.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'Failed',
      message: 'Invalid Id',
    });
  }
  const updatedTour = { ...tour, ...req.body };
  const updatedTours = tours.map(tour => {
    return tour.id === updatedTour.id ? updatedTour : tour;
  });
  fs.writeFile(dataFile, JSON.stringify(updatedTours), err => {
    if (err) {
      return res.status(501).json({
        status: 'Failed',
        message: 'Something went wrong ...',
      });
    }
  });
  res.status(200).json({
    status: 'Success',
    data: {
      data: {
        tour: updatedTour,
      },
    },
  });
};

const deleteTour = (req, res) => {
  const id = parseInt(req.params.id);
  const tour = tours.find(t => t.id === id);
  if (!tour) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid Id',
    });
  }
  const updatedTours = tours.filter(t => t.id !== tour.id);
  fs.writeFile(dataFile, JSON.stringify(updatedTours), err => {
    res.status(204).json({
      status: 'Success',
      data: null,
    });
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined',
  });
};

// 3) Routes

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);

// If placed here the middleware will apply only for the routes below
// app.use((req, res, next) => {
//   console.log('Hello from the middleware function 👍');
//   next();
// });

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.route('/api/v1/users').get(getAllUsers).post(createUser);
app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

// 4) Start server
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
