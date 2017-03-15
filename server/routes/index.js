const express = require('express');
const passport = require('passport');
const router = express.Router(); // eslint-disable-line new-cap

const controllers = require('../controllers');
const authenticationMiddleware = require('../middlewares/authentication');
const frontendMiddleware = require('../middlewares/frontend');

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

// API Routes
router.post('/v1/login', passport.authenticate('local'), controllers.createLoginJWT);
router.post('/v1/signup', controllers.createUserController);

// API PROTECTED ROUTES
router.get('/v1/next', authenticationMiddleware.requiresLogin, controllers.getNextCounter);
router.get('/v1/current', authenticationMiddleware.requiresLogin, controllers.getCurrentCounter);
router.put('/v1/current', authenticationMiddleware.requiresLogin, controllers.setCurrentCounter);

// Social Routes
// GET /auth/google
router.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'email'] }));

// GET /auth/google/callback
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  controllers.createLoginJWTAndPass,
  (req, res) => {
    res.redirect('/')
  }
);


// Frontend routes
router.get('/login', controllers.loginController);
router.post('/login', controllers.loginFrontendController);
router.get('/signup', controllers.singupController);
router.get('/logout', controllers.logoutController);
router.get('/', frontendMiddleware.requiresLogin, controllers.homeController);

module.exports = router;
