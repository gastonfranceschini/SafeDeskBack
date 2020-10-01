const connection = require("./connection");
var ObjectId = require('mongodb').ObjectId;

async function getTurnos(){
    const rest = await connection.runQuery(`SELECT * FROM turnos`)
    return rest
}

async function getTurnosPorUsuario(usuarioId){
    const rest = await connection.runQuery(`SELECT * FROM turnos WHERE IdUsuario = ${usuarioId}`)
    return rest
}

async function getTurnoPorId(turnoId){
    const rest = await connection.runQuery(`SELECT * FROM turnos WHERE Id = ${turnoId}`)
    return rest
}

async function getCantidadTurnos(actividadId, fechaActividad){
    let o_aid = new ObjectId(actividadId); 
    const clientmongo = await connection.getConnection();
    const cant = await clientmongo.db("safe_distance")
        .collection("turnos")
        .find({ "actividadId": o_aid ,
             "fechaActividad" : fechaActividad
        })
        .count();
    return cant;
}



async function getCupoActividad(actividadId){
    let o_id = new ObjectId(actividadId); 
    const clientmongo = await connection.getConnection();
    const doc = await clientmongo.db("safe_distance")
        .collection("actividades")
        .findOne({_id:o_id});
    return doc.cupo;
}
async function verificarReserva(usuarioId, actividadId, fechaActividad){
    let o_aid = new ObjectId(actividadId); 
    let o_uid = new ObjectId(usuarioId); 
    const clientmongo = await connection.getConnection();
    const cant = await clientmongo.db("safe_distance")
        .collection("turnos")
        .find(
            { 
                "usuarioId": o_uid,
                "actividadId": o_aid ,
                "fechaActividad" : fechaActividad
        }
        )
        .count();
    return cant;
}

async function pushTurno(turno){
    const clientmongo = await connection.getConnection();
    const result = await clientmongo.db("safe_distance")
        .collection("turnos")
        .insertOne(turno)
    return result;
}

async function updateTurno(turno){
    let o_id = new ObjectId(turno._id); 
    const clientmongo = await connection.getConnection();
    const query = {_id: o_id};

    const newvalues = {$set: 
        {
            actividadId: turno.actividadId,
            usuarioId: turno.usuarioId,
            fechaActividad: turno.fechaActividad,
            fechaReserva: turno.fechaReserva,
            asistencia: turno.asistencia
        }
    };

    const result = await clientmongo.db("safe_distance")
        .collection("turnos")
        .updateOne(query,newvalues)
    return result;
}

async function deleteTurno(turnoId){
    let o_id = new ObjectId(turnoId); 
    const clientmongo = await connection.getConnection();
    const result = await clientmongo.db("safe_distance")
        .collection("turnos")
        .deleteOne({_id: o_id})
    return result;
}

module.exports = {verificarReserva, getTurnos, getTurnoPorId, updateTurno, pushTurno, deleteTurno, getTurnosPorUsuario,getCantidadTurnos,getCupoActividad};

