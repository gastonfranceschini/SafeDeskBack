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
    .runQuery(`SELECT t.Id TurnoId,FechaTurno,p.Nombre Piso,e.Nombre Edificio, he.Horario 
      FROM turnos t
      INNER JOIN pisosxgerencias pxg ON pxg.id = IdPisoXGerencia
      INNER JOIN pisos p ON p.Id = pxg.IdPiso
      INNER JOIN edificios e ON e.Id = p.IdEdificio
      left JOIN horariosentrada he ON he.id = IdHorarioEntrada
      WHERE t.Id = ${turnoId}`)
    return rest;
}

async function getTurnoPorIdYEscaneo(turnoId){
    const escan = await connection
        .runQuery(`UPDATE turnos t
                    SET QrEscaneado = 1
                    WHERE t.Id = ${turnoId}`) 

    const rest = await connection
        .runQuery(`SELECT t.Id TurnoId,FechaTurno,p.Nombre Piso,e.Nombre Edificio, he.Horario 
                    FROM turnos t
                    INNER JOIN pisosxgerencias pxg ON pxg.id = IdPisoXGerencia
                    INNER JOIN pisos p ON p.Id = pxg.IdPiso
                    INNER JOIN edificios e ON e.Id = p.IdEdificio
                    LEFT JOIN horariosentrada he ON he.id = IdHorarioEntrada
                    WHERE t.Id = ${turnoId}`)
    return rest;
}

async function getTurnosDetallesPorUsuario(usuarioId){
    const rest = await connection
    .runQuery(`SELECT t.Id TurnoId, FechaTurno, p.Nombre Piso, e.Nombre Edificio, 
                  he.Horario, concat_ws(',', e.Lat, e.Long)  as GeoPos
                FROM turnos t
                INNER JOIN pisosxgerencias pxg ON pxg.id = IdPisoXGerencia
                INNER JOIN pisos p ON p.Id = pxg.IdPiso
                INNER JOIN edificios e ON e.Id = p.IdEdificio
                LEFT JOIN horariosentrada he ON he.id = IdHorarioEntrada
                WHERE FechaTurno >= DATE_FORMAT(now(), "%Y-%m-%d")
                AND IdUsuario = ${usuarioId}
                order by FechaTurno`)
    return rest
}

async function getTurnosDetallesHistoricoPorUsuario(usuarioId){
    const rest = await connection
    .runQuery(`SELECT t.Id TurnoId,FechaTurno,p.Nombre Piso,e.Nombre Edificio, he.Horario 
      FROM turnos t
      INNER JOIN pisosxgerencias pxg ON pxg.id = IdPisoXGerencia
      INNER JOIN pisos p ON p.Id = pxg.IdPiso
      INNER JOIN edificios e ON e.Id = p.IdEdificio
      left JOIN horariosentrada he ON he.id = IdHorarioEntrada
      WHERE FechaTurno < DATE_FORMAT(now(), "%Y-%m-%d")
      AND IdUsuario = ${usuarioId}
      order by FechaTurno`)
    return rest
}




// cupo x horario de entrada endpoint EDIFICIO
async function getCupoPorHorarioEntrada(fechaTurno,IdEdificio){
    const horariosEntrada = await 
      connection.runQuery(`SELECT  he.cupo - (SELECT count(*) FROM turnos t
                                                INNER JOIN  pisosxgerencias pxg ON pxg.id = IdPisoXGerencia
                                                INNER JOIN pisos p ON p.Id = pxg.IdPiso
                                                INNER JOIN edificios e ON e.Id = p.IdEdificio
                                                WHERE IdHorarioEntrada = he.id
                                                AND IdEdificio = he.IdEdificio
                                                AND t.FechaTurno = '${fechaTurno}') as Cupo,
                              he.id, he.horario
                              FROM horariosentrada he
                              WHERE he.IdEdificio = ${IdEdificio}
                              ORDER BY he.Horario asc`)
    return horariosEntrada
}

// cupo x horario de entrada endpoint EDIFICIO
async function getCupoPorHorarioEntradaEspecifico(fechaTurno, IdEdificio, IdHorario){
    const horariosEntrada = await 
      connection.runQuery(`SELECT  he.cupo - (SELECT count(*) FROM turnos t
                INNER JOIN  pisosxgerencias pxg ON pxg.id = IdPisoXGerencia
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
                            HAVING Cupo > 0 or min(pxg.cupo) = 0`)
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
                            HAVING Cupo > 0 or min(pxg.cupo) = 0`)

    return cupoTurnosPorPiso
}

//cupoS x pisoS para fecha endpoint Piso x Edificio x Gerencia
async function getCupoPorPisoEspecifico(IdGerencia, fechaTurno, IdEdificio, IdPiso){
    const cupoTurnosPorPiso = await 
      connection.runQuery(`SELECT SUM(pxg.Cupo - (SELECT  COUNT(*) 
                                                    FROM turnos t 
                                                    WHERE t.FechaTurno = '${fechaTurno}' 
                                                    AND t.IdPisoXGerencia = pxg.Id )) as Cupo,
                                                      p.Id as pID, p.Nombre, p.Numero, pxg.Cupo as CupoOriginal
                                                    FROM pisosxgerencias pxg
                                                    INNER JOIN pisos p ON p.Id = pxg.IdPiso
                                                    WHERE pxg.IdGerencia = ${IdGerencia} 
                                                    AND p.IdEdificio = ${IdEdificio} 
                                                    AND p.Id = ${IdPiso} 
                                                    GROUP BY pID, p.Nombre, p.Numero, pxg.Cupo`)
    if (cupoTurnosPorPiso[0].CupoOriginal != 0)
    {
      return cupoTurnosPorPiso[0].Cupo;
    }
    else
    {
      return 1;
    }
    
}

async function getPisoxGerencia(IdGerencia, IdPiso){
  console.log(`SELECT Id
  FROM pisosxgerencias
  WHERE IdGerencia = ${IdGerencia}
    AND IdPiso = ${IdPiso}`);
    const pisoxGerencia = await 
      connection.runQuery(`SELECT Id
                            FROM pisosxgerencias
                            WHERE IdGerencia = ${IdGerencia}
                              AND IdPiso = ${IdPiso}`)

    return pisoxGerencia[0].Id
}

async function pushTurno(turno){
  console.log(`INSERT INTO 
  turnos(IdUsuario, IdUsuarioPedido, FechaCreacion, FechaTurno, IdHorarioEntrada, IdPisoXGerencia)
  VALUES(${turno.idUsuario}, ${turno.idUsuarioPedido}, NOW(), '${turno.fechaTurno}', ${turno.idHorarioEntrada}, ${turno.idPisoxGerencia})`)
    const turnoReservado = await 
      connection.runQuery(`INSERT INTO 
                            turnos(IdUsuario, IdUsuarioPedido, FechaCreacion, FechaTurno, IdHorarioEntrada, IdPisoXGerencia)
                            VALUES(${turno.idUsuario}, ${turno.idUsuarioPedido}, NOW(), '${turno.fechaTurno}', ${turno.idHorarioEntrada}, ${turno.idPisoxGerencia})`)
    return turnoReservado
}

async function verificarReserva(usuarioId, fechaTurno, idEdificio){
    const confirmarReservado = await 
      connection.runQuery(`SELECT COUNT(t.IdUsuario) count
                            FROM turnos t
                            INNER JOIN pisosxgerencias pxg 
                              ON t.IdPisoXGerencia = pxg.Id
                            INNER JOIN pisos p
                              ON pxg.IdPiso = p.Id
                            WHERE t.IdUsuario = ${usuarioId} 
                              AND t.FechaTurno = '${fechaTurno}'
                                AND p.IdEdificio = ${idEdificio}`)
    return confirmarReservado[0].count
}

async function updateTurno(){
    // placeholder
}

async function deleteTurno(turnoId){
    const turnoBorrado = await 
      connection.runQuery(`DELETE FROM turnos WHERE Id = ${turnoId}`)
    return turnoBorrado
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