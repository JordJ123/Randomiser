const createError = require('http-errors');
const express = require('express');
const oracledb = require('oracledb');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const generateRouter = require('./routes/generate')
const gamesRouter = require('./routes/games');
const moviesRouter = require('./routes/movies');

//App
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/generate', generateRouter)
app.use('/games', gamesRouter);
app.use('/movies', moviesRouter);
app.use(function(req, res, next) {
  next(createError(404));
});
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//Database
const dbConfig = {
    user: 'SYSTEM',
    password: 'password',
    connectString: 'localhost:1521/XE'
};
oracledb.createPool(dbConfig, (err, pool) => {
    if (err) {
        console.error('Error creating Oracle pool:', err);
        return;
    }
});

module.exports = app;



