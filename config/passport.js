const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports = (app) => {
  // 1. init
  app.use(passport.initialize());
  app.use(passport.session());

  // 2. Strategy set up

  // 2.1 Local
  const localStrategy = new LocalStrategy(
    {
      usernameField: 'email',
      passReqToCallback: true,
    },
    (req, email, password, done) => {
      User.findOne({ email })
        .then((user) => {
          if (!user) {
            return done(
              null,
              false,
              req.flash('login_err_msg', 'Email is not registered!'),
            );
          }
          return bcrypt.compare(password, user.password).then((isMatch) => {
            if (!isMatch) {
              return done(
                null,
                false,
                req.flash('login_err_msg', 'Email or password is incorrect!'),
              );
            }

            return done(
              null,
              user,
              req.flash('success_msg', 'Login Successfully'),
            );
          });
        })
        .catch((err) => done(err, false));
    },
  );

  // 2.2 Facebook
  const facebookStrategy = new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK,
      profileFields: ['email', 'displayName'],
      auth_type: 'reauthenticate',
    },
    (accessToken, refreshToken, profile, done) => {
      const { name, email } = profile._json;
      User.findOne({ email }).then((user) => {
        if (user) return done(null, user);
        const randomPassword = Math.random().toString(36).slice(-8);
        return bcrypt
          .genSalt(10)
          .then((salt) => bcrypt.hash(randomPassword, salt))
          .then((hash) => User.create({ name, email, password: hash }))
          .then((user) => done(null, user))
          .catch((err) => done(err, false));
      });
    },
  );

  // 2.3 use
  passport.use(localStrategy);
  passport.use(facebookStrategy);

  // 2.4 serializeUser & deserializeUser
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then((user) => done(null, user))
      .catch((err) => done(err, null));
  });
};
