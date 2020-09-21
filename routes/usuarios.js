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

// GET /api/usuarios/:id
router.get('/:id', async (req, res, next)=>{
    let usuario = await dataUsuarios.getUsuario(req.params.id);
    res.send(usuario);
});

//DEPRECADO - Se usa signin
// POST /api/usuarios 
router.post('/', async (req, res, next)=>{
    //Verifico si ya existe el usuario por su email
    let usuario = await dataUsuarios.checkUsuario(req.body.email);
    if(usuario != null) {
      res.send('El email ingresado ya se encuentra registrado.')
    } else {
      usuario = {
              nombre: req.body.nombre,
              apellido: req.body.apellido,
              email: req.body.email,
              password: req.body.password,
              direccion: {
                calle: req.body.direccion.calle,
                altura: req.body.direccion.altura,
                piso: req.body.direccion.piso,
                departamento: req.body.direccion.departamento,
                barrio: req.body.direccion.barrio,
                cp: req.body.direccion.cp, 
                Provincia: req.body.direccion.provincia
              },
              ubicacion: req.body.ubicacion,
              fechaNacimiento: req.body.fechaNacimiento,
              documento: req.body.documento,
              telefonos: req.body.telefonos,
              aptoMedico: req.body.aptoMedico
          }
      let resultado = await dataUsuarios.pushUsuario(usuario)

      console.log("NUEVO USUARIO: "+ JSON.stringify(usuario))
      console.log("NUEVO USUARIO AGREGADO :" + resultado.result.n)
      if(resultado.result.n==1){
          res.send(satisfactorio)
      }else{
          res.send(fallido)
      }
    }
});

// PUT /api/usuarios/password cambia la pass
router.put('/password', async (req, res, next)=>{
  try
  {
    let usuario = await dataUsuarios.getUsuario(req.body._id);
 
    if(usuario == null) 
    {
      return res.status(422).send({ error: 'Usuario no existe!' });
    }

    if(bcrypt.compareSync(req.body.oldPassword, usuario.password)) 
    {
      let passwordCrypted = bcrypt.hashSync(req.body.newPassword, 10);
      const userEdit = {
        _id: req.body._id,
        password: passwordCrypted}
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
      _id: req.body._id,
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      email: req.body.email,
      //password: passwordCrypted,
      direccion: {
        calle: req.body.direccion.calle,
        altura: req.body.direccion.altura,
        piso: req.body.direccion.piso,
        departamento: req.body.direccion.departamento,
        barrio: req.body.direccion.barrio,
        cp: req.body.direccion.cp, 
        provincia: req.body.direccion.provincia
      },
      fechaNacimiento: req.body.fechaNacimiento,
      documento: req.body.documento,
      telefonos: req.body.telefonos
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