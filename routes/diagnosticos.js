const express = require('express');
const dataDiagnosticos = require('../data/diagnosticos');
const requireAuth = require('../middlewares/requireAuth');
const router = express.Router();

router.use(requireAuth);

//=======================================================
//GET - api/diagnosticos - Toda la tabla de diagnósticos
//=======================================================
router.get('/', async (req, res, next)=>{
    let diagnosticos = await dataDiagnosticos.getDiagnosticos();
    res.send(diagnosticos);
});

//==================================================
//POST - api/diagnosticos - Grabar los diagnósticos
//==================================================
router.post('/', async (req, res, next)=>{
    let diagnostico = 
        await dataDiagnosticos.grabarDiagnosticos(
            req.user.DNI, 
            req.body.Temperatura, 
            req.body.PerdioGusto, 
            req.body.ContactoCercano, 
            req.body.EstoyEmbarazada, 
            req.body.Cancer, 
            req.body.Diabetes, 
            req.body.Hepatica, 
            req.body.PerdioOlfato, 
            req.body.DolorGarganta, 
            req.body.DificultadRespiratoria
        );
    if(diagnostico.affectedRows == 1) {
      diagnostico = true
    } else {
      diagnostico = false
    }
    res.send(diagnostico);
});

//============================================================================================
//GET - api/diagnosticos/valido - usuario logueado tiene diagnóstico hecho dentro de las 48hs 
//============================================================================================
router.get('/valido', async (req, res, next)=>{
    let diagnosticos = await dataDiagnosticos.getDiagnosticoValido(req.user.DNI);
    res.send(diagnosticos);
});

module.exports = router;