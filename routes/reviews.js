const express = require('express');
const router = express.Router({mergeParams: true});
const { createReview, deleteReview } = require('../controllers/reviews');

const Review = require('../models/review');
const Campground = require('../models/campground');
const { isLoggedIn, validateReivew, isReviewAurthor } = require('../middleware');


const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

router.post('/', isLoggedIn, validateReivew, catchAsync(createReview));

//delete a review and delete in the given campground
router.delete('/:reviewId', isLoggedIn, isReviewAurthor, catchAsync(deleteReview));

module.exports = router;