const express = require('express');
const dataEstablecimientos = require('../data/establecimientos');
const requireAuth = require('../middlewares/requireAuth');
const router = express.Router();

router.use(requireAuth);

//GET api/establecimientos/usuario/:id
router.get('/usuario/:id', async (req, res, next)=>{
    let establecimientos = await dataEstablecimientos.getEstablecimientosPorUsuario(req.params.id);
    res.send(establecimientos);
});

module.exports = router;