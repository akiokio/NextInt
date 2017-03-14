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
    req.logIn(user, err => {
      if (err) req.flash('info', 'Sorry! We are not able to log you in!');
      return res.redirect('/');
    });
  } catch (err) {
    const errors = Object.keys(err.errors)
      .map(field => err.errors[field].message);

    res.render('signup', {
      title: 'Sign up',
      errors,
      user
    });
  }
})

exports.logoutController = function (req, res) {
  req.logout();
  res.redirect('/login');
};

