const mongoose = require('mongoose');
const { wrap: async } = require('co');

const User = mongoose.model('User');

exports.homeController = function(req, res) { 
  res.render('index', { title: 'Wellcome to your NextInt' } );
};

exports.loginController = function(req, res) {
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
    return res.json({ status: 'success', token });
  } catch (err) {
    const errors = Object.keys(err.errors)
      .map(field => err.errors[field].message);
    return res.status(400).json({ status: 'error', errors });
  }
});

exports.createLoginJWT = function(req, res) {
  const token = User.createJWT(req.user);
  return res.json({ status: 'success', token });
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
    console.log(error);
    const errors = Object.keys(error.errors)
      .map(field => error.errors[field].message);
    return res.status(400).json({ status: 'error', errors });
  }
});

exports.setCurrentCounter = async (function* (req, res) {
  try {
    const user = yield User.findByIdAndUpdate(req.user.id,
                                              { currentCounter: req.body.current },
                                              { new: true, runValidators: true });
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

