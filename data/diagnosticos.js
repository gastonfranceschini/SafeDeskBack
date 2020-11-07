const connection = require("./connection");

async function getDiagnosticos(){
    let diagnosticos = await connection.runQuery(`SELECT * FROM diagnosticos;`)
    return diagnosticos
}

async function grabarDiagnosticos(IdUsuario, Temperatura, PerdioGusto, ContactoCercano, EstoyEmbarazada, Cancer, Diabetes, Hepatica, PerdioOlfato, DolorGarganta, DificultadRespiratoria){
    console.log(IdUsuario, Temperatura, PerdioGusto, ContactoCercano, EstoyEmbarazada, Cancer, Diabetes, Hepatica, PerdioOlfato, DolorGarganta, DificultadRespiratoria)
    let diagnosticos = await connection.runQuery(`INSERT INTO diagnosticos
        (IdUsuario, Temperatura, PerdioGusto, ContactoCercano, EstoyEmbarazada, Cancer, Diabetes, Hepatica, PerdioOlfato, DolorGarganta, DificultadRespiratoria)
        VALUES(${IdUsuario}, ${Temperatura}, ${PerdioGusto}, ${ContactoCercano}, ${EstoyEmbarazada}, ${Cancer}, ${Diabetes}, ${Hepatica}, ${PerdioOlfato}, ${DolorGarganta}, ${DificultadRespiratoria})`)
    return diagnosticos
}

async function getDiagnosticoValido(DNI){
    let diagnosticos = await connection.runQuery(`SELECT COUNT(Id) as Count
                                                  FROM diagnosticos 
                                                  WHERE IdUsuario = ${DNI}
                                                  AND fechaCreacion >= now() - interval 2 day`)

    console.log("diag: " + diagnosticos[0].Count)

    if(diagnosticos[0].Count == 0) {
      return false
    } else {
      return true
    }
}

module.exports = {
    getDiagnosticos,
    grabarDiagnosticos,
    getDiagnosticoValido
};