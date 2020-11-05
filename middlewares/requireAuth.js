const jwt = require('jsonwebtoken');
const dataUsuarios = require('../data/usuarios');
require('dotenv').config()

module.exports = (req, res, next) => {

  try
  {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).send({ error: 'Tenés que estar logeado, token ausente.' });
    }
  
    const token = authorization.replace('Bearer ', '');
    jwt.verify(token, process.env.TokenKey, async (err, payload) => {
      if (err) {
        return res.status(401).send({ error: 'Tenés que estar logeado, token incorrecto.' });
      }
  
      const { userId } = payload;
      const usuario = await dataUsuarios.getUsuarioPorDNI(userId);
  
      if (usuario[0].Activo == 0) {
        return res.status(422).send({ error: 'Usuario desactivado, comuniquese con el RRHH'});
      }
  
      req.user = usuario[0];
      next();
    });
  }
  catch ({ message }) 
  {
    return res.status(422).send({error: 'Error en el token: ' + message });
  }
};
