const express = require('express');
const dataReportes = require('../data/reportes');
const requireAuth = require('../middlewares/requireAuth');
const router = express.Router();

//router.use(requireAuth);

const fastcsv = require("fast-csv");
const fs = require("fs");

//GET api/reportes/
router.get('/', async (req, res, next)=>{
    let reporte = await dataReportes.getReportes()
    res.send(reporte)
});

//POST api/reportes/dinamic/:id
router.post('/dinamic/:id', async (req, res, next)=>{
  
  console.log ("body " + JSON.stringify(req.body));
  try
  {
    let reporte = await dataReportes.getReporteDinamico(req.params.id,req.body.campos,req.body.valores)
    //creo un espacio para escribir el csv que trajo el reporte dinamico
    const ws = fs.createWriteStream("reporte.csv");
    const jsonData = JSON.parse(JSON.stringify(reporte));
    let delim = ';';

    if (req.body.formatoAlternativo == true)
      delim = ',';

    var promesa = new Promise((resolve, reject) => 
      {
        fastcsv.write(jsonData, { headers: true, delimiter: delim })
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
  }
  catch ({ message }) 
  {
    return res.status(422).send({error: 'Error al procesar la informacion: ' + message });
  }

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