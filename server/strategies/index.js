const passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const mongoose = require('mongoose');
const { wrap: async } = require('co');

const User = mongoose.model('User');

// serialize sessions
passport.serializeUser((user, cb) => cb(null, user.id));
passport.deserializeUser((id, cb) => User.load({ criteria: { _id: id } }, cb));

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, function (email, password, done) {
    const options = {
      criteria: { email: email },
      select: 'email hashed_password salt'
    };
    User.load(options, function (err, user) {
      if (err) return done(err);
      if (!user) {
        return done(null, false, { message: 'Unknown user' });
      }
      if (!user.authenticate(password)) {
        return done(null, false, { message: 'Invalid password' });
      }
      return done(null, user);
    });
  }
));

// Use the GoogleStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Google profile), and
//   invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (function* (accessToken, refreshToken, profile, done) {
      const options = {
        criteria: { googleId: profile.id },
        select: 'email hashed_password salt provider'
      };
      User.load(options, async (function* (err, user) {
        // New user
        if (!user) {
          const user = new User({
            googleId: profile.id,
            google: profile,
          });
          user.provider = 'google';
          yield user.save();
        }
        return done(null, user);
      }));
  }
)));
