// tourRoutes.js:
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

//tourController.js:
exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          // group by _id
          // _id: '$ratingsAverage',
          // _id: '$difficulty',
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },

      {
        $sort: {
          // field to sort by (from the group above)
          // $sort key ordering must be 1 (for ascending) or -1 (for descending)
          avgPrice: -1,
        },
      },
      // // we can also repeat stages:
      // {
      //   // select by id all doc that are not easy
      //   $match: { _id: { $ne: 'EASY' } },
      // },
    ]);

    res.status(200).json({
      status: 'Success',
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err.message,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
      {
        $limit: 15,
      },
    ]);

    res.status(200).json({
      status: 'Success',
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err.message,
    });
  }
};
