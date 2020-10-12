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

module.exports = {
    getDiagnosticos,
    grabarDiagnosticos
};