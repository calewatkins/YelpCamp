const express = require('express');
const router = express.Router();
const passport = require('passport');

const { index, renderNewForm, create, renderEditForm, getById, editCampground, deleteCampground } = require('../controllers/campgrounds');  

const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCampground, isAurthor } = require('../middleware');

const multer = require('multer');
const { storage } = require('../cloudinary');

const upload = multer({ storage });

router.route('/')
  .get(catchAsync(index))
  .post(isLoggedIn, upload.array('images'), validateCampground, catchAsync(create));

router.get('/new', isLoggedIn, renderNewForm);

router.route('/:id')
  .get(catchAsync(getById))
  .put(isLoggedIn, isAurthor, upload.array('images'), validateCampground, catchAsync(editCampground))
  .delete(isLoggedIn, isAurthor, catchAsync(deleteCampground));

//edit campground
router.get('/:id/edit', isLoggedIn, isAurthor, catchAsync(renderEditForm));

module.exports = router;