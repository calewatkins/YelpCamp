const Review = require('../models/review');
const Campground = require('../models/campground');

module.exports.createReview = async (req, res, next) => {
  const campground = await Campground.findById(req.params.id);
  const newReview = await Review.create(req.body.review);
  
  newReview.author = req.user._id;
  campground.reviews.push(newReview);
  
  await campground.save();
  await newReview.save();
  
  req.flash('success', 'Created new review');
  res.redirect(`/campgrounds/${campground._id}`);

};

module.exports.deleteReview = async (req, res, next) => {
  const { id, reviewId } = req.params;
  
  await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash('success', 'Successfully deleted review');
  res.redirect(`/campgrounds/${id}`);
};