const express = require('express');
const dataTurnos = require('../data/turnos');
const router = express.Router();
const requireAuth = require('../middlewares/requireAuth');
var ObjectId = require('mongodb').ObjectId;
var dateFormat = require('dateformat');

const satisfactorio = 'satisfactorio' 

const fallido = 'fallo la reserva del turno' 

const yaReservado = 'Ya ha realizado esta reserva anteriormente.' 

const cupoMaximoAlcanzado = 'Ya se ha alcanzado el cupo maximo' 

router.use(requireAuth);

//GET /api/turnos
router.get('/', async function(req, res, next) {
  let turnos = await dataTurnos.getTurnos();
  res.send(turnos);
});

//GET /api/turnos/usuario/:id
router.get('/usuario/:id', async (req, res, next)=>{
    let turno = await dataTurnos.getTurnosPorUsuario(req.params.id);
    res.send(turno);
});

//GET /api/turnos/:id
router.get('/:id', async (req, res, next)=>{
    let turno = await dataTurnos.getTurnoPorId(req.params.id);
    res.send(turno);
});

//GET /api/turnos/actividad/:actividadId/fecha/:fecha
router.get('/actividad/:actividadId/fecha/:fecha', async (req, res, next)=>{
    let cantidadTurnos = await dataTurnos.getCantidadTurnos(req.params.actividadId, req.params.fecha);
    console.log ("cant: " + cantidadTurnos);
    const resultado = {
        actividad: req.params.actividadId,
        fecha: req.params.fecha,
        cantidad: cantidadTurnos
    }
    console.log("RESULTADO CANT TURNOS: "+ JSON.stringify(resultado))
    res.send(resultado);
});

//POST /api/turno
router.post('/', async (req, res, next)=>{
     //verifico que no sea en fecha pasada
    if (new Date(req.body.fechaActividad) < new Date()) 
    {
        return res.status(422).send({error: 'Fecha menor a la actual...'});
    }
    

    let turnoReservado = await dataTurnos.verificarReserva(req.body.usuarioId,req.body.actividadId, req.body.fechaActividad)
    .then(
        responseVerfificarReserva=> {
            //console.log ("TURNO_RESERVADO: " + responseVerfificarReserva);
            dataTurnos.getCantidadTurnos(req.body.actividadId, req.body.fechaActividad)
            .then(
                responseCantidadTurnos=> {
                    //console.log ("CANTIDAD_TURNOS: " + responseCantidadTurnos);
                    dataTurnos.getCupoActividad(req.body.actividadId)
                    .then(
                        responseCupoActividad=> {
                            if (responseVerfificarReserva>0){
                                console.log ("TURNO_RESERVADO: " + responseVerfificarReserva);
                                //next(new Error(yaReservado))
                                next (res.status(422).send({error: yaReservado}));
                                //res.send(fallido)
                            }else if(responseCantidadTurnos >= responseCupoActividad){
                                console.log ("CANTIDAD_TURNOS: " + responseCantidadTurnos);
                                console.log ("CUPO_ACTIVIDAD: " + responseCupoActividad);
                                //next(new Error(cupoMaximoAlcanzado))
                                next (res.status(422).send({error: cupoMaximoAlcanzado}));
                                //res.send(fallido)
                            }else{
                                let nuevoTurno = {
                                    _id: req.params.idTurno,
                                    actividadId: ObjectId(req.body.actividadId),
                                    usuarioId: ObjectId(req.body.usuarioId),
                                    fechaActividad: req.body.fechaActividad,
                                    fechaReserva: dateFormat(new Date(), "isoDateTime"),
                                    asistencia: req.body.asistencia
                                }
        
                                dataTurnos.pushTurno(nuevoTurno)
                                .then(responsePushTurno =>
                                    {
                                        console.log("NUEVO TURNO: "+ JSON.stringify(nuevoTurno))
                                        console.log("TURNO AGREGADO:" + resultado.result.n)
                                        if(responsePushTurno.result.n==1){
                                            res.send(satisfactorio)
                                        }else{
                                            res.send(fallido)
                                            res.status(422).send({error: fallido});
                                        }
                                    })
                                    .catch(err => 
                                        {
                                            res.status(422).send({error: fallido});
                                    })
                                    }           
                    })
                    .catch(err => 
                        {
                            next(res.status(422).send({error: fallido}));
                            //next(new Error(fallido))
                            //res.send(fallido)
                    })
            })
            .catch(err => 
                {
                    next(res.status(422).send({error: fallido}));
                    //next(new Error(fallido))
                    //res.send(fallido)
            })
        })
    .catch(err => 
        {
            next(res.status(422).send({error: fallido}));
            //next(new Error(fallido))
            //res.send(fallido)
    })  
});

//PUT /api/turnos/:idTurno/usurio/:idUsuario
router.put('/:idTurno/usuario/:idUsuario', async (req, res, next)=>{
    let turno = await dataTurnos.getTurnoPorId(req.params.idTurno);
    console.log('TURNO: '+ JSON.stringify(turno))
    //si mi turno nuevo es diferente hago mas validaciones
    if (turno.actividadId != ObjectId(req.body.actividadId) || turno.fechaActividad != req.body.fechaActividad)
    {
        if (new Date(req.body.fechaActividad) < new Date()) 
        {
            return res.status(422).send({error: 'Fecha menor a la actual...'});
        }

        var cantidadTurnos = await dataTurnos.getCantidadTurnos(req.body.actividadId, req.params.idUsuario);
        var cupo = await dataTurnos.getCupoActividad(req.body.actividadId);
        if (cantidadTurnos >= cupo) 
        {
            return res.status(422).send({error: 'Ya se alcanzo el cupo maximo para esta actividad...'});
        } 
        console.log('CUPO: '+ cupo)
        console.log('CANT TURNOS: '+ cantidadTurnos)
    }
    let nuevoTurno = {
        _id: req.params.idTurno,
        actividadId: ObjectId(req.body.actividadId),
        usuarioId: ObjectId(req.body.usuarioId),
        fechaActividad: req.body.fechaActividad,
        fechaReserva: dateFormat(new Date(), "isoDateTime"),
        asistencia: req.body.asistencia
    }
    let resultado = await dataTurnos.updateTurno(nuevoTurno)
    console.log("NUEVO TURNO: "+ JSON.stringify(nuevoTurno))
    console.log("ACTUALIZACION DE TURNO :" + resultado.result.n)
    if(resultado.result.n==1){
        res.send(satisfactorio)
    }else{
        res.send(fallido)
    }
});


// DELETE /api/turnos/:id
router.delete('/:id', async (req, res, next)=>{
    let resultado = await dataTurnos.deleteTurno(req.params.id)
    console.log("TURNO BORRADO:" + resultado.result.n)
    if(resultado.result.n==1){
        res.send(satisfactorio)
    }else{
        res.send(fallido)
    }
});

module.exports = router;