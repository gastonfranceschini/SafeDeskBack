const express = require('express');
const dataReportes = require('../data/reportes');
const requireAuth = require('../middlewares/requireAuth');
const router = express.Router();

//router.use(requireAuth);

const fastcsv = require("fast-csv");
const fs = require("fs");

//GET api/reportes/
router.get('/', async (req, res, next)=>{
    let reporte = await dataReportes.getEdificios()
    res.send(reporte)
});

//GET api/reportes/dinamic/:id
router.post('/dinamic/:id', async (req, res, next)=>{
  
  let reporte = await dataReportes.getReporteDinamico(req.params.id,req.body.campos,req.body.valores)

  //creo un espacio para escribir el csv que trajo el reporte dinamico
  const ws = fs.createWriteStream("./tmp/reporte.csv");
  const jsonData = JSON.parse(JSON.stringify(reporte));

  var promesa = new Promise((resolve, reject) => 
    {
      fastcsv.write(jsonData, { headers: true, delimiter: ';' })
      .on("finish", function() {
        resolve(ws.path);
      })
      .pipe(ws);
  });

  //cuando termina de escribir el archivo se manda a bajar
  ws.on('finish', function() {
      res.download(resultado); 
  });
        
  var resultado = await promesa;

});

//POST api/reportes/id
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