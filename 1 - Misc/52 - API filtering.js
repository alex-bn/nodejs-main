const Tour = require('../models/tourModel');

// request handler functions
exports.getAllTours = async (req, res) => {
  try {
    // API FILTERING
    console.log(req.query);

    // getting the results from mongodb:

    // 1) hardcoded as a mongodb query
    // const tours = await Tour.find({ duration: 5, difficulty: 'easy' });

    // 2) hardcoded as a mongoose query
    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // 3) implementing query with a way of excluding certain parameters/fields that we gonna use later
    // BUILD THE QUERY
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObj = { ...req.query };
    // create array with excluded fields
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);
    const query = Tour.find(queryObj);

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
