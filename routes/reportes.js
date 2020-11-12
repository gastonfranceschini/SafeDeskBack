const express = require('express');
const dataReportes = require('../data/reportes');
const requireAuth = require('../middlewares/requireAuth');
const router = express.Router();

router.use(requireAuth);

const fastcsv = require("fast-csv");
const fs = require("fs");

//GET api/reportes/
router.get('/', async (req, res, next)=>{
    let reporte = await dataReportes.getReportesEspecificos(req.user.IdTipoDeUsuario)
    res.send(reporte)
});

//POST api/reportes/dinamic/:id
router.post('/dinamic/:id', async (req, res, next)=>{
  
  console.log ("body " + JSON.stringify(req.body));
  try
  {
    let reporte = await dataReportes.getReporteDinamico(req.params.id,req.body.campos,req.body.valores,req.user.IdTipoDeUsuario)
    //creo un espacio para escribir el csv que trajo el reporte dinamico
    const ws = fs.createWriteStream("reporte.csv");
    const jsonData = JSON.parse(JSON.stringify(reporte));

    if (jsonData == "")
      return res.status(422).send({error: 'No se encontraron datos...'});

    if (reporte[0].MensajeSP != undefined)
        return res.status(422).send({error: reporte[0].MensajeSP});

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

//GET api/reportes/configuraciones/nombre
router.get('/configuraciones/:nombre', async (req, res, next)=>{

  try {
    let config = await dataReportes.getConfiguracion(req.params.nombre)
    if(config.length == 0)
      return res.status(422).send({ error: 'No existe esa configuracion.' })
    res.send(config[0])
  } catch (error) {
    return res.status(422).send({ error: 'No existe esa configuracion.' });
  }
});


//PUT api/reportes/configuraciones/nombre/set/valor
router.put('/configuraciones/:nombre/set/:valor', async (req, res, next)=>{
  if (req.user.IdTipoDeUsuario != 4)
    return res.status(422).send({ error: 'Q hace?.' });

  try {
    let config = await dataReportes.setConfiguracion(req.params.nombre,req.params.valor)
    if(config.length == 0)
      return res.status(422).send({ error: 'No existe esa configuracion.' })
    res.send(config[0])
  } catch (error) {
    return res.status(422).send({ error: 'No existe esa configuracion.' });
  }
});

module.exports = router;