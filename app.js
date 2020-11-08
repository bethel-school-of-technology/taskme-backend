var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var models = require('./models');
var cors = require('cors');
var bodyParser = require("body-parser");
var Promise = require("bluebird");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tasksRouter = require('./routes/tasks');
var listsRouter = require('./routes/lists');
var ideasRouter = require('/routes/ideas');

var app = express();

app.use(cors({ origin: ["http://localhost:5000"], credentials: true }));
app.use(bodyParser.json());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tasks', tasksRouter);
app.use('/lists', listsRouter);
app.use('/ideas', ideasRouter);

models.sequelize.sync().then(function () {
    console.log("DB Sync'd")
});

module.exports = app;
