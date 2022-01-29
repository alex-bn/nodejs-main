const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// by default each router only has access to their specific routes, so in this this case mergeParams will give us access to the tourId param
const router = express.Router({ mergeParams: true });
// POST /tour/23nba87d/reviews -> will end up in the handler function below
// POST /tour/23nba87d/reviews

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

// test route
// router.route('/:id').get(reviewController.getReview, authController.protect);

module.exports = router;
