const express = require('express');
const jwt = require('jsonwebtoken');
const dataUsuarios = require('../data/usuarios');
const UsersController = require('../controllers/users');
require('dotenv').config()
const router = express.Router();
var passport = require('passport'); // Passport: Middleware de Node que facilita la autenticación de usuarios
//require('./passport')(passport);
const bcrypt = require('bcrypt');

//POST /api/auth/signup
router.post('/signup', async (req, res) => {
  //Verifico si ya existe el usuario por su email
  let usuario = await dataUsuarios.checkUsuario(req.body.email);

  if(usuario != null) {
    return res.status(422).send({ error: 'El email ingresado ya se encuentra registrado!' });
  } 

  try
  {
    let passwordCrypted = bcrypt.hashSync(req.body.password, 10);

    //console.log("REQ:" + JSON.stringify(req.body));

    const usuarioNuevo = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        password: passwordCrypted,
        direccion: {
          calle: req.body.direccion.calle,
          altura: req.body.direccion.altura,
          piso: req.body.direccion.piso,
          departamento: req.body.direccion.departamento,
          barrio: req.body.direccion.barrio,
          cp: req.body.direccion.cp, 
          provincia: req.body.direccion.provincia
        },
        ubicacion: req.body.ubicacion,
        fechaNacimiento: req.body.fechaNacimiento,
        documento: req.body.documento,
        telefonos: req.body.telefonos
    }

    let usuarioPushed = await dataUsuarios.pushUsuario(usuarioNuevo)
    const token = jwt.sign({ userId: usuarioPushed.insertedId }, process.env.TokenKey);
    return res.send({ token: token, userId: usuarioPushed.insertedId });
  }
  catch ({ message }) 
  {
    return res.status(422).send({error: 'Error al procesar la informacion: ' + message });
  }

});

//POST /api/auth/signin
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(422).send({ error: 'Debe ingresar Email y Password!' });
  }

  let usuario = await dataUsuarios.getUsuarioPorEmail(email);
 
  if(usuario == null) 
  {
    return res.status(422).send({ error: 'Password o Email invalido!' });
  }

  if(bcrypt.compareSync(password, usuario.password)) 
  {
    const token = jwt.sign({ userId: usuario._id }, process.env.TokenKey);
    res.send({ token: token, userId: usuario._id });
  } else {
    return res.status(422).send({ error: 'Password o Email invalido!' });
  }
});

//termino usando este endpoint para logeo/creacion desde providers
router.post('/providers', async (req, res) => {

  let usuario = await dataUsuarios.getUsuarioPorProvider(req.body.providerId,req.body.provider)
  if(usuario!= null) 
  {
    const token = jwt.sign({ userId: usuario._id }, process.env.TokenKey);
    return res.send({ token: token, userId: usuario._id });
  }
  
  let usuarioXemail = await dataUsuarios.getUsuarioPorEmail(req.body.email);
  if(usuarioXemail != null) {
    return res.status(422).send({ error: 'El email ingresado ya se encuentra registrado y no esta asociado a esta cuenta!' });
  } 
  
  const nuevoUsuario = {
        nombre: req.body.nombre,
        provider_id: req.body.providerId,
        provider: req.body.provider,
        email: req.body.email}

  let usuarioPushed = await dataUsuarios.pushUsuario(nuevoUsuario)
  const token = jwt.sign({ userId: usuarioPushed.insertedId }, process.env.TokenKey);
  return res.send({ token: token, userId: usuarioPushed.insertedId });
});


// Ruta para desloguearse
router.get('/logout', async(req, res)=> {
  req.logout();
  res.redirect('/');
  return res.send({ token: "", userId: "" });
});

/* Rutas de Passport */
// Ruta para autenticarse con Facebook (enlace de login)
router.get('/facebook', passport.authenticate('facebook'));

// Ruta de callback, a la que redirigirá tras autenticarse con Facebook.
// En caso de fallo redirige a otra vista '/login'
router.get('/facebook/callback', passport.authenticate('facebook',
{ session: false })
, UsersController.generarTokenConReq
);

router.get('/google', passport.authenticate('google',{scope : ['profile']}), );

router.get('/google/callback', passport.authenticate('google',
{ session: false })
, UsersController.generarTokenConReq
);

module.exports = router;
