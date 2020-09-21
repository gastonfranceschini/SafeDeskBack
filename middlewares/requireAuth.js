const jwt = require('jsonwebtoken');
const dataUsuarios = require('../data/usuarios');
require('dotenv').config()

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  // authorization === 'Bearer laksjdflaksdjasdfklj'

  if (!authorization) {
    return res.status(401).send({ error: 'Tenes que estar logeado, token ausente.' });
  }

  const token = authorization.replace('Bearer ', '');
  jwt.verify(token, process.env.TokenKey, async (err, payload) => {
    if (err) {
      return res.status(401).send({ error: 'Tenes que estar logeado, token incorrecto.' });
    }

    const { userId } = payload;
    const usuario = await dataUsuarios.getUsuario(userId);
    req.user = usuario;
    next();
  });
};
