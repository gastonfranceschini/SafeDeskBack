const jwt = require('jsonwebtoken');
const dataUsuarios = require('../data/usuarios');
require('dotenv').config()

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  // authorization === 'Bearer laksjdflaksdjasdfklj'

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

    console.log(userId);

    req.user = usuario[0];
    next();
  });
};
