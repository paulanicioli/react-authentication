const express = require('express');
const authRoutes = express.Router();

const passport = require('passport');
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');

const SALT_ROUNDS = 10;

// require the user model !!!!
const User = require('../models/user-model');

authRoutes.get('/signup', (req, res, next) => {
    res.render('signup')
})

authRoutes.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  console.log(req.body)

  if (!username || !password) {
    res.status(400).json({ message: 'Provide username and password' });
    return;
  }

  // make sure passwords are strong:
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .json({
        errorMessage:
          'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.',
      });
    return;
  }

  bcryptjs
    .genSalt(SALT_ROUNDS)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        // username: username
        username,
        // password => this is the key from the User model
        //     ^
        //     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
        password: hashedPassword
      });
    })
    .then((userFromDB) => {
      console.log('Newly created user is: ', userFromDB);
      // Send the user's information to the frontend
      // We can use also: res.status(200).json(req.user);
      res.status(200).json(userFromDB);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('signup', { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render('auth/signup', {
          errorMessage:
            'Username and email need to be unique. Either username or email is already used.',
        });
      } else {
        next(error);
      }
    }); // close .catch()
});

module.exports = authRoutes;