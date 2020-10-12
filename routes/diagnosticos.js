const express = require('express');
const dataDiagnosticos = require('../data/diagnosticos');
const requireAuth = require('../middlewares/requireAuth');
const router = express.Router();

router.use(requireAuth);

//GET - api/diagnosticos
router.get('/', async (req, res, next)=>{
    let diagnosticos = await dataDiagnosticos.getDiagnosticos();
    res.send(diagnosticos);
});

//POST - api/diagnosticos/grabar
router.post('/grabar', async (req, res, next)=>{
    let diagnosticos = await dataDiagnosticos.grabarDiagnosticos(req.user.DNI, req.body.Temperatura, req.body.PerdioGusto, req.body.ContactoCercano, req.body.EstoyEmbarazada, req.body.Cancer, req.body.Diabetes, req.body.Hepatica, req.body.PerdioOlfato, req.body.DolorGarganta, req.body.DificultadRespiratoria);
    res.send(diagnosticos);
});

module.exports = router;