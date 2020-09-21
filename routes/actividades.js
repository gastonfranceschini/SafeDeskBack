const express = require('express');
const dataActividades = require('../data/actividades');
const requireAuth = require('../middlewares/requireAuth');
const router = express.Router();

router.use(requireAuth);

//GET /api/actividades/condiciones
router.get('/condiciones', async (req, res, next)=>{
    let actividades = await dataActividades.getActividadesPorCondiones(req);
    res.send(actividades);
});

//GET /api/actividades
router.get('/', async (req, res, next)=>{
    let actividades = await dataActividades.getAllActividades();
    res.send(actividades);
});

//GET /api/actividades/usuario/:id
router.get('/usuario/:id', async (req, res, next)=>{
    let actividades = await dataActividades.getActividadesPorUsuario(req.params.id);
    res.send(actividades);
});

// GET /api/actividades/:id
router.get('/:id', async (req, res, next)=>{
    let actividades = await dataActividades.getActividadPorId(req.params.id);
    res.send(actividades);
});

module.exports = router;