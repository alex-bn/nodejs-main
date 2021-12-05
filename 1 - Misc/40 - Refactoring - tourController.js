const fs = require('fs');

const dataFile = `${__dirname}./../dev-data/data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(dataFile));

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

exports.createTour = (req, res) => {
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

exports.updateTour = (req, res) => {
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

exports.deleteTour = (req, res) => {
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
