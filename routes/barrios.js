const express = require('express');
const dataActividades = require('../data/barrios');
const router = express.Router();
const requireAuth = require('../middlewares/requireAuth');

router.use(requireAuth);

//GET /api/ciudad/:nombre/actividad/:tipoActividad
router.get('/ciudad/:nombre/actividad/:tipoActividad', async (req, res, next)=>{
    let actividades = await dataActividades.getBarriosPorCiudadYPorActividad(req.params.nombre, req.params.tipoActividad);
    res.send(actividades);
});

module.exports = router;