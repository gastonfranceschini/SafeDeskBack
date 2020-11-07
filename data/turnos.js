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
    const rest = await connection
    .runQuery(`select t.Id TurnoId,FechaTurno,p.Nombre Piso,e.Nombre Edificio, he.Horario 
      FROM turnos t
      INNER JOIN pisosxgerencias pxg on pxg.id = IdPisoXGerencia
      INNER JOIN pisos p ON p.Id = pxg.IdPiso
      INNER JOIN edificios e ON e.Id = p.IdEdificio
      left JOIN horariosentrada he on he.id = IdHorarioEntrada
      WHERE t.Id = ${turnoId}`)
    return rest;
}

async function getTurnoPorIdYEscaneo(turnoId){
    const escan = await connection
    .runQuery(`update turnos
                SET QrEscaneado = 1
                WHERE t.Id = ${turnoId}`) 

    const rest = await connection
    .runQuery(`select t.Id TurnoId,FechaTurno,p.Nombre Piso,e.Nombre Edificio, he.Horario 
      FROM turnos t
      INNER JOIN pisosxgerencias pxg on pxg.id = IdPisoXGerencia
      INNER JOIN pisos p ON p.Id = pxg.IdPiso
      INNER JOIN edificios e ON e.Id = p.IdEdificio
      left JOIN horariosentrada he on he.id = IdHorarioEntrada
      WHERE t.Id = ${turnoId}`)
    return rest;
}


async function getTurnosDetallesPorUsuario(usuarioId){
    const rest = await connection
    .runQuery(`select t.Id TurnoId,FechaTurno,p.Nombre Piso,e.Nombre Edificio, he.Horario, concat_ws(',', e.Lat, e.Long)  as GeoPos
      FROM turnos t
      INNER JOIN pisosxgerencias pxg on pxg.id = IdPisoXGerencia
      INNER JOIN pisos p ON p.Id = pxg.IdPiso
      INNER JOIN edificios e ON e.Id = p.IdEdificio
      left JOIN horariosentrada he on he.id = IdHorarioEntrada
      WHERE FechaTurno > now()
      AND IdUsuario = ${usuarioId}`)
    return rest
}

async function getTurnosDetallesHistoricoPorUsuario(usuarioId){
    const rest = await connection
    .runQuery(`select t.Id TurnoId,FechaTurno,p.Nombre Piso,e.Nombre Edificio, he.Horario 
      FROM turnos t
      INNER JOIN pisosxgerencias pxg on pxg.id = IdPisoXGerencia
      INNER JOIN pisos p ON p.Id = pxg.IdPiso
      INNER JOIN edificios e ON e.Id = p.IdEdificio
      left JOIN horariosentrada he on he.id = IdHorarioEntrada
      WHERE FechaTurno < now()
      AND IdUsuario = ${usuarioId}`)
    return rest
}




// cupo x horario de entrada endpoint EDIFICIO
async function getCupoPorHorarioEntrada(fechaTurno,IdEdificio){
    const horariosEntrada = await 
      connection.runQuery(`select  he.cupo - (select count(*) FROM turnos t
                                                INNER JOIN  pisosxgerencias pxg on pxg.id = IdPisoXGerencia
                                                INNER JOIN pisos p ON p.Id = pxg.IdPiso
                                                INNER JOIN edificios e ON e.Id = p.IdEdificio
                                                WHERE IdHorarioEntrada = he.id
                                                AND IdEdificio = he.IdEdificio
                                                AND t.FechaTurno = '${fechaTurno}') as Cupo,
                              he.id, he.horario
                              FROM horariosentrada he
                              WHERE he.IdEdificio = ${IdEdificio}`)
    return horariosEntrada
}

// cupo x horario de entrada endpoint EDIFICIO
async function getCupoPorHorarioEntradaEspecifico(fechaTurno,IdEdificio, IdHorario){
    const horariosEntrada = await 
      connection.runQuery(`select  he.cupo - (select count(*) FROM turnos t
                INNER JOIN  pisosxgerencias pxg on pxg.id = IdPisoXGerencia
                INNER JOIN pisos p ON p.Id = pxg.IdPiso
                INNER JOIN edificios e ON e.Id = p.IdEdificio
                WHERE IdHorarioEntrada = he.id
                AND IdEdificio = he.IdEdificio
                AND t.FechaTurno = '${fechaTurno}') as Cupo,
        he.id, he.horario
        FROM horariosentrada he
        WHERE he.IdEdificio = ${IdEdificio}
        AND Cupo > 0
        AND he.id = ${IdHorario}`)
    return horariosEntrada[0].Cupo
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

//cupoS x pisoS para fecha endpoint Piso x Edificio x Gerencia
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

//cupoS x pisoS para fecha endpoint Piso x Edificio x Gerencia
async function getCupoPorPisoEspecifico(IdGerencia, fechaTurno, IdEdificio, IdPiso){
    const cupoTurnosPorPiso = await 
      connection.runQuery(`SELECT SUM(pxg.Cupo - (SELECT  COUNT(*) 
                                                    FROM turnos t 
                                                    WHERE t.FechaTurno = '${fechaTurno}' 
                                                    AND t.IdPisoXGerencia = pxg.Id )) as Cupo,
                                  p.Id as pID, p.Nombre, p.Numero
                          FROM pisosxgerencias pxg
                          INNER JOIN pisos p ON p.Id = pxg.IdPiso
                          WHERE pxg.IdGerencia = ${IdGerencia} 
                          AND p.IdEdificio = ${IdEdificio} 
                          AND p.Id = ${IdPiso} 
                          GROUP BY pID, p.Nombre, p.Numero`)
    return cupoTurnosPorPiso[0].Cupo
}

async function getPisoxGerencia(IdGerencia, IdPiso){
    const pisoxGerencia = await 
      connection.runQuery(`SELECT Id
                            FROM pisosxgerencias
                            WHERE 	IdGerencia = ${IdGerencia}
                              AND IdPiso = ${IdPiso}`)

    return pisoxGerencia[0].Id
}

async function pushTurno(turno){
    const turnoReservado = await 
      connection.runQuery(`INSERT INTO 
                            turnos(IdUsuario, IdUsuarioPedido, FechaCreacion, FechaTurno, IdHorarioEntrada, IdPisoXGerencia)
                            VALUES(${turno.idUsuario}, ${turno.idUsuarioPedido}, NOW(), '${turno.fechaTurno}', ${turno.idHorarioEntrada}, ${turno.idPisoxGerencia})`)
    return turnoReservado
}

async function verificarReserva(usuarioId, fechaTurno){
    const confirmarReservado = await 
      connection.runQuery(`SELECT COUNT(IdUsuario) count
                            FROM turnos 
                            WHERE IdUsuario = ${usuarioId} 
                            AND FechaTurno = '${fechaTurno}'`)
    return confirmarReservado[0].count
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

module.exports = {
  verificarReserva,
  getCupoPorHorarioEntradaEspecifico,
  getTurnosDetallesHistoricoPorUsuario,
  getTurnosDetallesPorUsuario,
  getTurnos, 
  getTurnoPorId, 
  getCupoPorHorarioEntrada,
  updateTurno, 
  pushTurno, 
  deleteTurno, 
  getTurnosPorUsuario,
  getCupoTurnosPorEdificio,
  getCupoPorPiso, 
  getCupoPorPisoEspecifico, 
  getPisoxGerencia,
  getTurnoPorIdYEscaneo
}