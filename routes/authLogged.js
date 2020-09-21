const express = require('express');
const jwt = require('jsonwebtoken');
const dataUsuarios = require('../data/usuarios');
require('dotenv').config()
const router = express.Router();
const requireAuth = require('../middlewares/requireAuth');

router.use(requireAuth);

//quien soy?
//GET/authLogged/current
router.get('/current', async (req, res) => {
  //req.user = usuario
  res.send(req.user);
});

module.exports = router;
