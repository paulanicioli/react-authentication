require('dotenv').config();
const express = require('express');
const hbs = require('hbs');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

const session = require('express-session');
const passport = require('passport');

require('./configs/passport.js');

mongoose
  .connect('mongodb://localhost/project-management-server', {
    useNewUrlParser: true,
  })
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error('Error connecting to mongo', err);
  });


// Middleware Setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express View engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

// ADD SESSION SETTINGS HERE:
app.use(
  session({
    secret: 'some secret goes here',
    resave: true,
    saveUninitialized: false,
  })
);

// USE passport.initialize() and passport.session() HERE:
app.use(passport.initialize());
app.use(passport.session());

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

// ADD CORS SETTINGS HERE TO ALLOW CROSS-ORIGIN INTERACTION:
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000'], // <== this will be the URL of our React app (it will be running on port 3000)
  })
);

// ROUTES MIDDLEWARE STARTS HERE:

const index = require('../react-authentication/routes/index');
app.use('/', index);

const authRoutes = require('./routes/auth.routes');
app.use('/api', authRoutes);

app.listen(3000, () => {
  console.log('listening')
})