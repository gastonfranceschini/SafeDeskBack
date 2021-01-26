const express = require('express');
const dataTurnos = require('../data/turnos');
const router = express.Router();
const requireAuth = require('../middlewares/requireAuth');

var ObjectId = require('mongodb').ObjectId;
var dateFormat = require('dateformat');

const satisfactorio = 'satisfactorio' 
const fallido = 'fallo la reserva del turno' 

router.use(requireAuth);

//===============================================================
//GET /api/turnos/usuario/:id - Turno más próximo por Usuario ID
//===============================================================
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

//=======================================
//GET /api/turnos/misturnos - mis turnos
//=======================================
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

//=======================================================================================================
//GET /api/turnos/misturnoshistorico - lista de turnos anteriores a la fecha actual del usuario logueado
//=======================================================================================================
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


//=======================================
//GET /api/turnos/edificios/fecha/:fecha 
//=======================================
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

//===================================================================
//GET api/turnos/edificio/:idEdificio/fecha/:fecha/HorariosDeEntrada
//===================================================================
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
  

//====================================================================================================
//GET /api/turnos/pisos/fecha/:fecha/edificio/:IdEdificio - trae los cupos por piso de una fecha dada
//====================================================================================================
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

//=============================================
//GET /api/turnos/:id - Turnos por ID de turno
//=============================================
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

//===================================
//GET /api/turnos - Todos los turnos
//===================================
router.get('/', async function(req, res, next) {

    try
    {
        let turnos = await dataTurnos.getTurnos();
        res.send(turnos);
    }
    catch ({ message }) 
    {
      return res.status(422).send({error: '/ - Error al procesar la informacion: ' + message });
    }

});

//=================
//POST /api/turnos
//=================
router.post('/', async (req, res, next)=>{

    try
    {
        var fechaDate = new Date(req.body.fechaTurno);
        fechaDate.setDate(fechaDate.getDate() + 1); //se le suma un dia a la fecha por como formatea node js

        //verifico que no sea en fecha pasada
        if (fechaDate < new Date()) 
        {
            return res.status(422).send({error: 'No puedes sacar un turno para una Fecha menor a la actual...'});
        }

        let turnoReservado = await dataTurnos.verificarReserva(req.body.idUsuario, req.body.fechaTurno, req.body.IdEdificio)
        if(turnoReservado > 0){
          return res.status(422).send({error: 'Ya tiene turno reservado para ese día para el mismo sitio.'});
        }

        
        let cupo = await dataTurnos.getCupoPorPisoEspecifico(req.user.IdGerencia, req.body.fechaTurno, req.body.IdEdificio, req.body.IdPiso)  
        
        if(cupo <= 0){
            return res.status(422).send({error: 'No quedan cupos para el piso seleccionado en esta fecha.'});
        }
                
        let horarioEntrada = await dataTurnos.getCupoPorHorarioEntradaEspecifico(req.body.fechaTurno, req.body.IdEdificio, req.body.idHorarioEntrada)  
        
        if(horarioEntrada <= 0){
            return res.status(422).send({error: 'No quedan cupos para entrar a ese horario.'});
        }
        
        console.log(req.user.IdGerencia, req.body.IdPiso);
        
        let idPisoxGerencia = await dataTurnos.getPisoxGerencia(req.user.IdGerencia, req.body.IdPiso)  
        if(idPisoxGerencia == undefined){
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

//========================
// DELETE /api/turnos/:id
//========================
router.delete('/:id', async (req, res, next)=>{
    let result = await dataTurnos.deleteTurno(req.params.id)
      if(result.affectedRows == 1) {
        result = true
      } else {
        result = false
      }
      res.send(result)
});

module.exports = router;