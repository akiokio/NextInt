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
router.post('/login',  passport.authenticate('local', 
       { successRedirect: '/',
         failureRedirect: '/login',
         failureFlash: true
       }));
router.get('/signup', controllers.singupController);
router.post('/signup', controllers.createUserController);
router.get('/logout', controllers.logoutController);

// TODO
// router.get('/v1/next', authenticationMiddleware.requiresLogin, controllers.logoutController);
// router.get('/v1/current', authenticationMiddleware.requiresLogin, controllers.logoutController);
// router.put('/v1/current', authenticationMiddleware.requiresLogin, controllers.logoutController);


router.get('/', authenticationMiddleware.requiresLogin, controllers.homeController);

module.exports = router;
