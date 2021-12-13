const Tour = require('../models/tourModel');

// request handler functions
exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    // BUILD THE QUERY
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObj = { ...req.query };
    // filtering
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // API ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    console.log(JSON.parse(queryStr));
    // { difficulty: 'easy', duration: { $gte: 5} } -> mongodb query
    // { difficulty: 'easy', duration: { gte: '5' } } -> req.query object
    // gte, gt, lte, lt
    const query = Tour.find(JSON.parse(queryStr));

    // EXECUTE THE QUERY
    const tours = await query;

    // SEND RESPONSE
    res.status(200).json({
      requestedAt: req.requestTime,
      status: 'Success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err.message,
    });
  }
};
