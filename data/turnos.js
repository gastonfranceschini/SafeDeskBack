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


// cupo x horario de entrada endpoint EDIFICIO
async function getCupoPorHorarioEntrada(fechaTurno,IdEdificio){
    const horariosEntrada = await 
      connection.runQuery(`select  he.cupo - (select count(*) from turnos t
                inner join  pisosxgerencias pxg on pxg.id = IdPisoXGerencia
                INNER JOIN pisos p ON p.Id = pxg.IdPiso
                INNER JOIN edificios e ON e.Id = p.IdEdificio
                where IdHorarioEntrada = he.id
                and IdEdificio = he.IdEdificio
                and t.FechaTurno = '${fechaTurno}') as Cupo,
        he.id, he.horario
        from horariosentrada he
        where he.IdEdificio = ${IdEdificio}
        and Cupo > 0`)
    return horariosEntrada
}


// cupo x fecha endpoint EDIFICIO
async function getCupoTurnosPorEdificio(IdGerencia, fechaTurno){
    const cupoTurnosPorEdificio = await 
      connection.runQuery(`SELECT SUM(pxg.Cupo - ( SELECT  COUNT(*) 
                                                    FROM turnos t 
                                                    WHERE t.FechaTurno = '${fechaTurno}' 
                                                      AND t.IdPisoXGerencia = pxg.Id )) as Cupo,
                                e.Id as eID, e.Nombre, e.Direccion
                            FROM pisosxgerencias pxg
                            INNER JOIN pisos p ON p.Id = pxg.IdPiso
                            INNER JOIN edificios e ON e.Id = p.IdEdificio
                            WHERE 	pxg.IdGerencia = ${IdGerencia} 
                            GROUP BY eID, e.Nombre, e.Direccion
                            HAVING Cupo > 0`)
    return cupoTurnosPorEdificio
}

//cupo x piso para fecha endpoint Piso x Edificio x Gerencia
async function getCupoPorPiso(IdGerencia, fechaTurno, IdEdificio){
    const cupoTurnosPorPiso = await 
      connection.runQuery(`SELECT SUM(pxg.Cupo - (SELECT  COUNT(*) 
                                                    FROM turnos t 
                                                    WHERE t.FechaTurno = '${fechaTurno}' 
                                                    AND t.IdPisoXGerencia = pxg.Id )) as Cupo,
                                  p.Id as pID, p.Nombre, p.Numero
                          FROM pisosxgerencias pxg
                          INNER JOIN pisos p ON p.Id = pxg.IdPiso
                          WHERE 	pxg.IdGerencia = ${IdGerencia} AND p.IdEdificio = ${IdEdificio}
                          GROUP BY pID, p.Nombre, p.Numero
                          HAVING Cupo > 0`)

    return cupoTurnosPorPiso
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

module.exports = {getCupoPorHorarioEntrada,verificarReserva, getTurnos, getTurnoPorId, 
    updateTurno, pushTurno, deleteTurno, getTurnosPorUsuario,getCupoTurnosPorEdificio,getCupoPorPiso};

