const express = require('express');
const dataUsuarios = require('../data/usuarios');
const router = express.Router();
const bcrypt = require('bcrypt');

const satisfactorio = { estado: 'satisfactorio' }
const fallido = { estado: 'fallido' }

// GET /api/usuarios
router.get('/', async function(req, res, next) {
  let usuarios = await dataUsuarios.getUsuarios();
  res.send(usuarios);
});

//POST /api/usuarios/dni
router.post('/dni', async (req, res, next)=>{
    const { dni }  = req.body
    let usuario = await dataUsuarios.getUsuarioPorDNI(dni)
    res.send(usuario)
});

// PUT /api/usuarios/password cambia la pass
router.put('/password', async (req, res, next)=>{
  const { dni, oldPassword, newPassword} = req.body
  try
  {
    let usuario = await dataUsuarios.getUsuarioPorDNI(dni)
    usuario = usuario[0]
 
    if(usuario == null) 
    {
      return res.status(422).send({ error: 'Usuario no existe!' })
    }
  
    console.log(oldPassword)
    console.log(usuario.Password)

    if(bcrypt.compareSync(oldPassword, usuario.Password)) 
    {
      let passwordCrypted = bcrypt.hashSync(newPassword, 10);

      const userEdit = {
        dni: dni,
        pass: passwordCrypted
      }

      let result = await dataUsuarios.updateUsuarioPassword(userEdit)
      res.send(result)

    } else {
      return res.status(422).send({ error: 'Password Incorrecta!' });
    }
  }
  catch ({ message }) 
  {
    return res.status(422).send({error: 'Error al procesar la informacion: ' + message });
  }

});

// PUT /api/usuarios/ cambia info del user
router.put('/', async (req, res, next)=>{
  try
  {
    //let passwordCrypted = bcrypt.hashSync(req.body.password, 10);
    const usuarioNuevo = {
      DNI: req.body.dni,
      nombre: req.body.nombre,
      email: req.body.email
    }
    let result = await dataUsuarios.updateUsuario(usuarioNuevo)
    res.send(result)
  }
  catch ({ message }) 
  {
    return res.status(422).send({error: 'Error al procesar la informacion: ' + message });
  }
});

module.exports = router;