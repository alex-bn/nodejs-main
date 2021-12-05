const fs = require('fs');

const dataFile = `${__dirname}./../dev-data/data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(dataFile));

// middleware stack: checking for invalid IDs
exports.checkID = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);

  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid Id',
    });
  }
  next();
};

// middleware stack: checking for request parameters
exports.checkBody = (req, res, next) => {
  console.log('Checking for req.name and req.price..');
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'Fail',
      message: 'Bad request: missing name or price',
    });
  }
  next();
};

// request handler
exports.getAllTours = (req, res) => {
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

exports.getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'Success',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  // eslint-disable-next-line prefer-object-spread
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(dataFile, JSON.stringify(tours), () => {
    res.status(201).json({
      status: 'Success',
      data: {
        tours: newTour,
      },
    });
  });
};

exports.updateTour = (req, res) => {
  const id = +req.params.id;
  const tour = tours.find((el) => el.id === id);
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const updatedTour = { ...tour, ...req.body };
  // eslint-disable-next-line no-shadow
  const updatedTours = tours.map((tour) =>
    tour.id === updatedTour.id ? updatedTour : tour
  );
  fs.writeFile(dataFile, JSON.stringify(updatedTours), (err) => {
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

exports.deleteTour = (req, res) => {
  // eslint-disable-next-line radix
  const id = parseInt(req.params.id);
  const tour = tours.find((t) => t.id === id);

  const updatedTours = tours.filter((t) => t.id !== tour.id);
  fs.writeFile(dataFile, JSON.stringify(updatedTours), () => {
    res.status(204).json({
      status: 'Success',
      data: null,
    });
  });
};
