const express = require('express');
const dataUsuarios = require('../data/usuarios');
const router = express.Router();
const bcrypt = require('bcrypt');
const requireAuth = require('../middlewares/requireAuth');

router.use(requireAuth);

// GET /api/usuarios
router.get('/', async function(req, res, next) {
  let usuarios = await dataUsuarios.getUsuarios();
  res.send(usuarios);
});


//POST /api/usuarios/dni
router.post('/dni', async (req, res, next)=>{
    const { dni }  = req.body
    let usuario = await dataUsuarios.getUsuarioPorDNI(dni)
    res.send(usuario[0])
});

// PUT /api/usuarios/password - cambiar password
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
  
    // console.log(oldPassword)
    // console.log(usuario.Password)

    if(bcrypt.compareSync(oldPassword, usuario.Password)) 
    {
      let passwordCrypted = bcrypt.hashSync(newPassword, 10);

      const userEdit = {
        dni: dni,
        pass: passwordCrypted
      }

      let result = await dataUsuarios.updateUsuarioPassword(userEdit)

      // recibo resultado del query
      if(result.affectedRows == 1) {
        result = true
      } else {
        result = false
      }
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
      console.log("DNI:" + req.body.dni)
      console.log("nombre:" + req.body.nombre)
      console.log("email:" + req.body.email)
  try
  {
    const usuarioModificado = {
      DNI: req.body.dni,
      nombre: req.body.nombre,
      email: req.body.email
    }
    let result = await dataUsuarios.updateUsuario(usuarioModificado)
    res.send(result)
  }
  catch ({ message }) 
  {
    return res.status(422).send({error: 'Error al procesar la informacion: ' + message });
  }
});

// GET /api/usuarios/gerencias
router.get('/gerencias', async function(req, res, next) {
  try
  {
    let gerencias = await dataUsuarios.getGerencias(req.user);
    res.send(gerencias);
  }
  catch ({ message }) 
  {
    return res.status(422).send({error: 'Error al procesar la informacion: ' + message });
  }
});

// GET /api/usuarios/dependientes
router.get('/dependientes', async function(req, res, next) {
  try
  {
    let usuarios = await dataUsuarios.getUsuariosDependientes(req.user);
    res.send(usuarios);
  }
  catch ({ message }) 
  {
    return res.status(422).send({error: 'Error al procesar la informacion: ' + message });
  }
});

module.exports = router;