const express = require('express');
const dataEdificios = require('../data/edificios');
const requireAuth = require('../middlewares/requireAuth');
const router = express.Router();

router.use(requireAuth);

//GET api/edificios/
router.get('/', async (req, res, next)=>{
    let edificios = await dataEdificios.getEdificios()
    res.send(edificios)
});

//POST api/edificios/id
router.post('/id', async (req, res, next)=>{
    const { id } = req.body
    try {
      let edificio = await dataEdificios.getEdificio(id)
      if(edificio.length == 0)
        return res.status(422).send({ error: 'El id no contiene edificio.' })
      res.send(edificio[0])
    } catch (error) {
      return res.status(422).send({ error: 'El id no existe.' });
    }
});

module.exports = router;


//GET api/edificios/usuario/:id
// router.get('/usuario/:id', async (req, res, next)=>{
//     let edificios = await dataEdificios.getEdificiosPorUsuario(req.params.id);
//     res.send(edificios);
// });