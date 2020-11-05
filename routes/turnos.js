const express = require('express');
const dataTurnos = require('../data/turnos');
const router = express.Router();
const requireAuth = require('../middlewares/requireAuth');

var ObjectId = require('mongodb').ObjectId;
var dateFormat = require('dateformat');

const satisfactorio = 'satisfactorio' 
const fallido = 'fallo la reserva del turno' 

router.use(requireAuth);

//GET /api/turnos/usuario/:id - Turnos por Usuario ID
router.get('/usuario/:id', async (req, res, next)=>{

    try
    {
        let turno = await dataTurnos.getTurnosPorUsuario(req.params.id);
        res.send(turno[0]);
    }
    catch ({ message }) 
    {
      return res.status(422).send({error: '/usuario/:id - Error al procesar la informacion: ' + message });
    }

});

//GET /api/turnos/misturnos - mis turnos
router.get('/misturnos', async (req, res, next)=>{

    try
    {
        let turnos = await dataTurnos.getTurnosDetallesPorUsuario(req.user.DNI);
        res.send(turnos);
    }
    catch ({ message }) 
    {
      return res.status(422).send({error: '/misturnos - Error al procesar la informacion: ' + message });
    }
});

//GET /api/turnos/misturnoshistorico - mis turnos pasados
router.get('/misturnoshistorico', async (req, res, next)=>{

    try
    {
        let turnos = await dataTurnos.getTurnosDetallesHistoricoPorUsuario(req.user.DNI);
        res.send(turnos);
    }
    catch ({ message }) 
    {
      return res.status(422).send({error: '/misturnoshistorico - Error al procesar la informacion: ' + message });
    }

});


//GET /api/turnos/edificios/fecha/:fecha 
router.get('/edificios/fecha/:fecha', async (req, res, next)=>{

    try
    {
        let cantidadTurnos = await dataTurnos.getCupoTurnosPorEdificio(req.user.IdGerencia, req.params.fecha);
        res.send(cantidadTurnos);
    }
    catch ({ message }) 
    {
      return res.status(422).send({error: '/edificios/fecha/:fecha - Error al procesar la informacion: ' + message });
    }

});

//GET api/turnos/edificio/:idEdificio/fecha/:fecha/HorariosDeEntrada
router.get('/edificio/:idEdificio/fecha/:fecha/HorariosDeEntrada', async (req, res, next)=>{

    try
    {
        let horarios = await dataTurnos.getCupoPorHorarioEntrada(req.params.fecha,req.params.idEdificio)
        res.send(horarios)
    }
    catch ({ message }) 
    {
      return res.status(422).send({error: '/edificio/:idEdificio/fecha/:fecha/HorariosDeEntrada - Error al procesar la informacion: ' + message });
    }
});
  

//GET /api/turnos/pisos/fecha/:fecha/edificio/:IdEdificio
router.get('/pisos/fecha/:fecha/edificio/:IdEdificio', async (req, res, next)=>{

    
    try
    {
        let cantidadTurnosPorPiso = await dataTurnos.getCupoPorPiso(req.user.IdGerencia, req.params.fecha, req.params.IdEdificio);
        res.send(cantidadTurnosPorPiso);
    }
    catch ({ message }) 
    {
      return res.status(422).send({error: '/pisos/fecha/:fecha/edificio/:IdEdificio - Error al procesar la informacion: ' + message });
    }

});

//GET /api/turnos/:id - Turnos por ID
router.get('/:id', async (req, res, next)=>{

    try
    {
        let turno = await dataTurnos.getTurnoPorIdYEscaneo(req.params.id);
        res.send(turno[0]);
    }
    catch ({ message }) 
    {
      return res.status(422).send({error: '/:id - Error al procesar la informacion: ' + message });
    }

});

//GET /api/turnos - Todos los turnos
router.get('/', async function(req, res, next) {

    try
    {
        let turnos = await dataTurnos.getTurnos();
        res.send(turnos[0]);
    }
    catch ({ message }) 
    {
      return res.status(422).send({error: '/ - Error al procesar la informacion: ' + message });
    }

});

//POST /api/turno
router.post('/', async (req, res, next)=>{

    try
    {
        //verifico que no sea en fecha pasada
        if (new Date(req.body.fechaTurno) < new Date()) 
        {
            return res.status(422).send({error: 'Fecha menor a la actual...'});
        }

        let turnoReservado = await dataTurnos.verificarReserva(req.body.idUsuario, req.body.fechaTurno)
        if(turnoReservado > 0){
            return res.status(422).send({error: 'Ya tiene turno reservado para ese día.'});
        }

        let cupo = await dataTurnos.getCupoPorPisoEspecifico(req.user.IdGerencia, req.body.fechaTurno, req.body.IdEdificio, req.body.IdPiso)  
        
        if(cupo <= 0){
            return res.status(422).send({error: 'No quedan cupos para el piso seleccionado en esta fecha.'});
        }
        
        let horarioEntrada = await dataTurnos.getCupoPorHorarioEntradaEspecifico(req.body.fechaTurno, req.body.IdEdificio, req.body.idHorarioEntrada)  
        if(horarioEntrada <= 0){
            return res.status(422).send({error: 'No quedan cupos para entrar a ese horario.'});
        }
        

        let idPisoxGerencia = await dataTurnos.getPisoxGerencia(req.user.IdGerencia, req.body.IdPiso)  
        if(idPisoxGerencia == 0){
            return res.status(422).send({error: 'No existe esta combinación de gerencias y pisos.'});
        }
    

        let nuevoTurno = {              
                            idUsuario: req.body.idUsuario,
                            idUsuarioPedido: req.user.DNI,
                            fechaTurno: req.body.fechaTurno,
                            idHorarioEntrada: req.body.idHorarioEntrada,
                            idPisoxGerencia: idPisoxGerencia
                        }

        let turno = await dataTurnos.pushTurno(nuevoTurno)

        return res.status(200).send({Message: 'Turno creado!'});
    }
    catch ({ message }) 
    {
        return res.status(422).send({error: 'post/ - Error al procesar la informacion: ' + message });
    }
});

//PUT /api/turnos/:idTurno/usurio/:idUsuario
router.put('/:idTurno/usuario/:idUsuario', async (req, res, next)=>{
    let turno = await dataTurnos.getTurnoPorId(req.params.idTurno);
    console.log('TURNO: '+ JSON.stringify(turno))
    //si mi turno nuevo es diferente hago mas validaciones
    if (turno.gerenciaId != ObjectId(req.body.gerenciaId) || turno.fechaActividad != req.body.fechaActividad)
    {
        if (new Date(req.body.fechaActividad) < new Date()) 
        {
            return res.status(422).send({error: 'Fecha menor a la actual...'});
        }

        var cantidadTurnos = await dataTurnos.getCantidadTurnos(req.body.gerenciaId, req.params.idUsuario);
        var cupo = await dataTurnos.getCupoActividad(req.body.gerenciaId);
        if (cantidadTurnos >= cupo) 
        {
            return res.status(422).send({error: 'Ya se alcanzo el cupo maximo para esta gerencia...'});
        } 
        console.log('CUPO: '+ cupo)
        console.log('CANT TURNOS: '+ cantidadTurnos)
    }
    let nuevoTurno = {
        _id: req.params.idTurno,
        gerenciaId: ObjectId(req.body.gerenciaId),
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