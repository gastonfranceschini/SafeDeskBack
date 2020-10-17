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

//GET - api/diagnosticos/userDiag/:id
router.get('/userDiag/:id', async (req, res, next)=>{
    let userHaveDiag = await dataDiagnosticos.getDiagnosticoDeUsuario(req.params.Id);
    res.send(userHaveDiag);
})

//POST - api/diagnosticos
router.post('/', async (req, res, next)=>{
    let diagnosticos = await dataDiagnosticos.grabarDiagnosticos(req.user.DNI, req.body.Temperatura, req.body.PerdioGusto, req.body.ContactoCercano, req.body.EstoyEmbarazada, req.body.Cancer, req.body.Diabetes, req.body.Hepatica, req.body.PerdioOlfato, req.body.DolorGarganta, req.body.DificultadRespiratoria);
    res.send(diagnosticos);
});

module.exports = router;