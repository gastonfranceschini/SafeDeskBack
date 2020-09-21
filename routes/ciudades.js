const express = require('express');
const dataActividades = require('../data/ciudades');
const router = express.Router();
const requireAuth = require('../middlewares/requireAuth');

router.use(requireAuth);

// GET /api/ciudades
router.get('/', async (req, res, next)=>{
    let ciudades = await dataActividades.getAllCiudades(req);
    res.send(ciudades);
});

module.exports = router;