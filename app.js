var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport'); // Passport: Middleware de Node que facilita la autenticación de usuarios
var mysql = require('mysql');


// Conexión Remota
// var conexion = mysql.createConnection({
//   host: 'ClusterMySQL-TEST01.art.com',
//   database: 'turnosd',
//   user: 'turnos',
//   password: 'V8Rf4ZfbpS'
// });

//conexion local
var conexion = mysql.createConnection({
  host: 'localhost',
  database: 'turnosd',
  user: 'root',
  password: '142857'
});

// conexion.connect(function(error){
//   if (error)
//   { 
//     throw error;
//   }
//   else
//   {
//     console.log('Conexion Exitosa!')
//   }
// });

// conexion.query("SELECT * FROM Usuarios", 
//   function(error,results, fields){
//     if(error){
//       throw error;
//     }
//     else {
//       results.forEach(result => {
//         console.log(result);
//       })
//     }
//   }
// );

// conexion.end();

//const bcrypt = require('bcrypt');
//console.log(bcrypt.hashSync("100", 10));

var indexRouter = require('./routes/index');

const authRouter = require('./routes/auth');
const authLoggedRouter = require('./routes/authLogged');

const usuariosRouter = require('./routes/usuarios');

const actividadesRouter = require('./routes/actividades');
const ciudadesRouter = require('./routes/ciudades');
const turnosRouter = require('./routes/turnos');
const barriosRouter = require('./routes/barrios');
const establecimientosRouter = require('./routes/establecimientos');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(passport.initialize());
//app.use(passport.session());

//app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/api/usuarios', usuariosRouter);
app.use('/api/actividades', actividadesRouter);
app.use('/api/ciudades', ciudadesRouter);
app.use('/api/turnos', turnosRouter);
app.use('/api/barrios', barriosRouter);
app.use('/api/establecimientos', establecimientosRouter);
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
