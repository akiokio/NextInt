const express = require('express');
const passport = require('passport');
const router = express.Router(); // eslint-disable-line new-cap

const controllers = require('../controllers');
const authenticationMiddleware = require('../middlewares/authentication');

router.get('*', function(req, res, next) {
  // put user into res.locals for easy access from templates
  res.locals.loggedIn = (req.user) ? true : false;
  // put the flash messages on the templates
  const messages = req.flash();
  res.locals.info = messages.info;
  res.locals.errors = messages.error;
  res.locals.success = messages.success;
  res.locals.warning = messages.warning;
  next();
});

// Routes
router.get('/login', controllers.loginController);
router.post('/v1/login', passport.authenticate('local'), controllers.createLoginJWT);
router.post('/v1/signup', controllers.createUserController);
router.get('/v1/logout', controllers.logoutController);

router.get('/v1/next', authenticationMiddleware.requiresLogin, controllers.getNextCounter);
router.get('/v1/current', authenticationMiddleware.requiresLogin, controllers.getCurrentCounter);
router.put('/v1/current', authenticationMiddleware.requiresLogin, controllers.setCurrentCounter);


router.get('/', authenticationMiddleware.requiresLogin, controllers.homeController);

module.exports = router;
