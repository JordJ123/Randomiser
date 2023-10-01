const createError = require('http-errors');
const express = require('express');
const oracledb = require('oracledb');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const generateRouter = require('./routes/generate')
const categoriesRouter = require('./routes/categories');
const gamesRouter = require('./routes/games');
const moviesRouter = require("./routes/movies");
const tvShowsRouter = require("./routes/tv_shows");


//App
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('views engine', 'pug');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/generate', generateRouter);
app.use('/categories', categoriesRouter.router);
app.use('/games', gamesRouter.router);
app.use('/movies', moviesRouter.router);
app.use('/tv_shows', tvShowsRouter.router);
app.get('*', function(req, res) {
    return res.sendStatus(404);
})

//Database
const dbConfig = {
    user: 'SYSTEM',
    password: 'password',
    connectString: 'localhost:1521/XE'
};
oracledb.createPool(dbConfig, (err, pool) => {
    if (err) {
        console.error('Error creating Oracle pool:', err);
    }
});

module.exports = app;



