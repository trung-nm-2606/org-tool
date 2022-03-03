const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');

const app = express();
const api = require('./api');
const UserRouter = require('./src/module/user/router');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false })); // To parse URL encoded data
app.use(express.json()); // To parse request json -> req.body
app.use(cookieParser()); // To parse cookie json -> req.cookies
app.use(session({secret: `s3cr3t`}));

app.use('/uploads', express.static('uploads'));
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
  if (!req.session.authenticatedUser) {
    res.redirect('/login');
    return;
  }
  res.sendFile(path.join(__dirname, '/react-app/build/index.html'));
});

app.use(express.static('react-app/build'));

app.use('/api', api);
app.use('/signup', (req, res) => res.redirect('/users/signup'));
app.use('/login', (req, res) => res.redirect('/users/login'));
app.use('/logout', (req, res) => res.redirect('/users/logout'));
app.use('/users', UserRouter);

// All not-found routes served by ExpressJs will be directed to ReactJS
app.use((req, res, next) => {
  if (!req.session.authenticatedUser) {
    res.redirect('/login');
    return;
  }
  res.sendFile(path.join(__dirname, 'react-app/build/index.html'));
});

// catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)));

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: 'Error' });
});

module.exports = app;
