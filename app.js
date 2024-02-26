var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var app = express();


app.use(logger('dev'));
//MiddleaWares
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use((req, res , next )=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','*');

    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT , POST , DELETE , GET , PATCH ');
        return res.status(200).json({});
    }
    next();
});

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(__dirname + '/uploads'));


//   view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var appVersionsRouter = require('./routes/app_versions');
var notificationRouter = require('./routes/notifications');
const { Server } = require('https');

app.use('/', indexRouter);
app.use('/app-versions', appVersionsRouter);
app.use('/users', usersRouter);
app.use('/notifications', notificationRouter);

//   catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
