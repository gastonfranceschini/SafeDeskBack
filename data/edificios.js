const connection = require("./connection");

async function getEdificios(){
    let edificios = await connection.runQuery(`select id,nombre,direccion,lat,"long" as longitud from edificios`)
    return edificios
}

async function getEdificio(id){
    let edificios = await connection.runQuery(`SELECT * FROM edificios WHERE Id = ${id}`)
    return edificios
}

module.exports = { 
        getEdificio, 
        getEdificios
}