const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const User = require('../../models/user');
const passport = require('passport');

router.get('/login', (req, res) => {
  res.render('login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
  }),
);

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const errors = [];
  if (!email || !password || !confirmPassword) {
    errors.push({ message: 'email與密碼為必填欄位' });
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符' });
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword,
    });
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        errors.push({
          message: 'User already exists.',
        });

        //console.log('User already exists.');
        return res.render('register', {
          errors,
          name,
          email,
          password,
        });
      }

      return bcrypt
        .genSalt(10)
        .then((salt) => bcrypt.hash(password, salt))
        .then((hash) => User.create({ name, email, password: hash }))
        .then(() => res.redirect('/users/login'))
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'Already logout');
  res.redirect('/users/login');
});

module.exports = router;
