const Tour = require('../models/tourModel');

// request handler functions
exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);

    // BUILD THE QUERY
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObj = { ...req.query };
    // 1)a Filtering
    // ?duration=5&difficulty=easy
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // 1)b Advanced filtering
    // ?duration[gte]=5&difficulty=easy
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    let query = Tour.find(JSON.parse(queryStr));

    // 2) Sorting
    // sort=price,-ratingsAverage
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      // default sorting
      query = query.sort('-createdAt');
    }

    // 3) Field limiting
    // ?fields=name,difficulty,price,images
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      // default search (without the __v field)
      query = query.select('-__v');
    }

    // 4) Pagination
    // ?page=2&limit=10
    const page = req.query.page * 1 || 1; // * 1 convert a string to a number
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    // 1 - 10 => page1, 11 - 20 => page 2, ...
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('Page does not exist');
    }

    // EXECUTE QUERY
    const tours = await query;
    // query.sort().select().skip().limit()

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
