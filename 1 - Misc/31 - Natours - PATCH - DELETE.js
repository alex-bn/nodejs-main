const fs = require('fs');
const express = require('express');

const app = express();

// middleware - > a function that can modify the incoming request data, stands between the request and the response, in the middle
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// GET request
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'Success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

// GET request + URL parameter
app.get('/api/v1/tours/:id', (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1; // convert id to a number(from a string)
  const tour = tours.find(el => el.id === id);

  // if (id > tours.length) {
  if (!tour) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'Success',
    data: {
      tour,
    },
  });
});

// POST request
app.post('/api/v1/tours', (req, res) => {
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      res.status(201).json({
        status: 'Success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

// PATCH
app.patch('/api/v1/tours/:id', (req, res) => {
  // Dummy patch request
  // if (req.params.id * 1 > tours.length) {
  //   return res.status(404).json({
  //     status: 'Fail',
  //     message: 'Invalid Id',
  //   });
  // }

  // res.status(200).json({
  //   status: 'Success',
  //   data: {
  //     tour: '<Updated tour here>',
  //   },
  // });

  const id = +req.params.id;
  const tour = tours.find(el => el.id === id);

  // if id is not found
  if (!tour) {
    return res.status(404).json({
      status: 'Failed',
      message: 'Invalid Id',
    });
  }

  // if id is found
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
});

// DELETE
app.delete('/api/v1/tours/:id', (req, res) => {
  // // Dummy delete request
  // if (req.params.id * 1 > tours.length) {
  //   return res.status(404).json({
  //     status: 'Fail',
  //     message: 'Invalid Id',
  //   });
  // }

  // res.status(204).json({
  //   status: 'Success',
  //   data: null,
  // });

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
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});
