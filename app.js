var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

let indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const authLoggedRouter = require('./routes/authLogged');
const usuariosRouter = require('./routes/usuarios');
const edificiosRouter = require('./routes/edificios');
const turnosRouter = require('./routes/turnos');
const diagnosticosRouter = require('./routes/diagnosticos');
const reportesRouter = require('./routes/reportes');
const cors = require('cors');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use('/', indexRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/turnos', turnosRouter);
app.use('/api/edificios', edificiosRouter);
app.use('/api/diagnosticos', diagnosticosRouter);
app.use('/api/reportes', reportesRouter);

//rutas login
app.use('/api/logged',authLoggedRouter);
app.use('/api/auth',authRouter);

// catch 404 and forward to error handler
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
