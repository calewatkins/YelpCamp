const Campground = require('./models/campground');
const Review = require('./models/review');
const { campgroundSchema, reviewSchema } = require('./schemas.js');

const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl
    req.flash('error', 'You must be signed in.');
    return res.redirect('/login');
  }
  return next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.validateCampground = (req, res, next) => {

  const { error } = campgroundSchema.validate(req.body);
  if(error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    return next();
  }
};

module.exports.isAurthor = async(req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);

  if(!campground.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to update this campground!');
    return res.redirect(`/campgrounds/${id}`);
  }
  return next();
};

module.exports.isReviewAurthor = async(req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if(!review.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to access this review!');
    return res.redirect(`/campgrounds/${id}`);
  }
  return next();
};

module.exports.validateReivew = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if(error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    return next();
  }
};
