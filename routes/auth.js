const express = require('express');
const jwt = require('jsonwebtoken');
const dataUsuarios = require('../data/usuarios');
require('dotenv').config()
const router = express.Router();
const bcrypt = require('bcrypt');

//POST /api/auth/signin
router.post('/signin', async (req, res) => {

  const { dni, password } = req.body;
   
  if (!dni || !password) {
    return res.status(422).send({ error: 'Debe ingresar DNI y Password!' });
  }

  let usuario = await dataUsuarios.getUsuarioPorDNI(dni);
  usuario = usuario[0];
  console.log("Usuario: " + JSON.stringify(usuario));

  if(password.length < 3) 
  {
    return res.status(422).send({ error: 'La password es muy corta, debe contener minimo 3 caracteres!' })
  }

  if(password.length > 50) 
  {
    return res.status(422).send({ error: 'La password es muy larga, debe contener maximo 50 caracteres!' })
  }

  if(usuario == null) 
  {
    return res.status(422).send({ error: 'Password o DNI invalido!' });
  }

  if (usuario.Activo == 0) {
    return res.status(422).send({ error: 'Usuario desactivado, comuniquese con el sector de RRHH'});
  }
  
  let cambioPass = 0;
  if(usuario.Password == '' || bcrypt.compareSync(password, usuario.Password)) 
  {
    if (usuario.Password == '') cambioPass = 1;
    const token = jwt.sign({ userId: usuario.DNI }, process.env.TokenKey);
    res.send({ 
        token: token, 
        userId: usuario.DNI, 
        Nombre: usuario.Nombre,
        Email: usuario.Email,
        IdTipoDeUsuario: usuario.IdTipoDeUsuario,
        IdGerencia: usuario.IdGerencia,
        Gerencia: "Privado",
        CambioPassObligatorio :  cambioPass
     });
  } else {
    return res.status(422).send({ error: 'Password o DNI invalido!' });
  }
});

module.exports = router;
