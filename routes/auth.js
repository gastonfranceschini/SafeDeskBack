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
  console.log("Usuario: " + usuario);

  if(usuario == null) 
  {
    return res.status(422).send({ error: 'Password o DNI invalido!' });
  }

  if(bcrypt.compareSync(password, usuario.Password)) 
  {
    const token = jwt.sign({ userId: usuario.DNI }, process.env.TokenKey);
    res.send({ token: token, 
        userId: usuario.DNI, 
        Nombre: usuario.Nombre,
        Email: usuario.Email,
        IdTipoDeUsuario: usuario.IdTipoDeUsuario,
        IdGerencia: usuario.IdGerencia
     });
  } else {
    return res.status(422).send({ error: 'Password o DNI invalido!' });
  }
});

//GET /api/auth/logout
router.get('/logout', async(req, res)=> {
  req.logout();
  res.redirect('/');
  return res.send({ token: "", userId: "" });
});

module.exports = router;
