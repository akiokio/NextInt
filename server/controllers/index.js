const mongoose = require('mongoose');
const { wrap: async } = require('co');

const User = mongoose.model('User');

exports.homeController = async (function* (req, res) {
  const user = yield User.findById(req.user.id);
  const counter = user.currentCounter;
  res.render('index', { title: 'Wellcome to your NextInt', counter } );
});

exports.loginController = function(req, res) {
  res.render('login', { title: 'Login' } );
};

exports.loginFrontendController = function(req, res) {
  res.render('login', { title: 'Login' } );
};

exports.singupController = function(req, res) {
  res.render('signup', { title: 'Sign up' } );
};

exports.createUserController = async(function* (req, res) {
  const user = new User(req.body);
  user.provider = 'local';
  try {
    yield user.save();
    const token = User.createJWT(user);
    req.logIn(user, err => { 
      return res.json({ status: 'success', token });
    });
  } catch (err) {
    const errors = Object.keys(err.errors)
      .map(field => err.errors[field].message);
    return res.status(400).json({ status: 'error', errors });
  }
});

exports.createLoginJWT = function(req, res) {
  const token = User.createJWT(req.user);
  req.logIn(req.user, err => {
    res.cookie('token', token, { maxAge: 900000, httpOnly: false });
    if (err) req.flash('info', 'Sorry! We are not able to log you in!'); 
    return res.json({ status: 'success', token });
  });
};

exports.createLoginJWTAndPass = function(req, res, next) {
  const token = User.createJWT(req.user);
  req.logIn(req.user, err => {
    res.cookie('token', token, { maxAge: 900000, httpOnly: false });
    if (err) req.flash('info', 'Sorry! We are not able to log you in!'); 
    next();
  });
};

exports.logoutController = function (req, res) {
  req.logout();
  res.redirect('/login');
};

// BUSSINESS LOGIC
exports.getNextCounter = async (function* (req, res) {
  try {
    const user = yield User.findByIdAndUpdate(req.user.id,
                                              { $inc: { currentCounter: 1 }},
                                              { new: true });
    if (!user) {
      throw {
        errors: {
          User: {
            message: 'User not found'
          }
        }
      };
    }
    return res.json(user.currentCounter);
  } catch (error) {
    const errors = Object.keys(error.errors)
      .map(field => error.errors[field].message);
    return res.status(400).json({ status: 'error', errors });
  }
});

exports.getCurrentCounter = async (function* (req, res) {
  try {
    const user = yield User.findById(req.user.id);
    if (!user) {
      throw {
        errors: {
          User: {
            message: 'User not found'
          }
        }
      };
    }
    return res.json(user.currentCounter);
  } catch (error) {
    const errors = Object.keys(error.errors)
      .map(field => error.errors[field].message);
    return res.status(400).json({ status: 'error', errors });
  }
});

exports.setCurrentCounter = async (function* (req, res) {
  try {
    if (!req.body.current) {
      throw { errors: { currentCounter: {
        message: 'Please provide a counter'
      }}};
    }
    const newCounter = Number(req.body.current);
    if (!Number.isInteger(newCounter)) {
      throw { errors: { currentCounter: {
        message: 'Counter should be a number'
      }}};
    }
    if (req.body.current < 0) {
      throw { errors: { currentCounter: {
        message: 'Counter should be greater than zero'
      }}};
    }
    const user = yield User.findByIdAndUpdate(req.user.id,
                                              { currentCounter: req.body.current },
                                              { new: true, runValidators: true });

    if (!user) {
      throw {
        errors: { User: { message: 'User not found' } }
      };
    }
    return res.json(user.currentCounter);
  } catch (error) {
    const errors = Object.keys(error.errors)
      .map(field => error.errors[field].message);
    return res.status(400).json({ status: 'error', errors });
  }
});

