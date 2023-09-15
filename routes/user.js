const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

const { renderRegister, createUser, renderLogin, login, logout } = require('../controllers/users');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { storeReturnTo } = require('../middleware');

router.route('/register')
  .get(renderRegister)
  .post(catchAsync(createUser));

router.route('/login')
  .get(renderLogin)
  .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), login);

router.get('/logout', logout);

module.exports = router;
