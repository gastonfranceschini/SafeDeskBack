const connection = require("./connection");

async function getEdificios(){
    let edificios = await connection.runQuery(`select id,nombre,direccion,lat,"long" as longitud from edificios`)
    return edificios
}


async function getEdificio(id){
    let edificios = await connection.runQuery(`SELECT * FROM edificios WHERE Id = ${id}`)
    return edificios
}

module.exports = { getEdificio, getEdificios }





// var ObjectId = require('mongodb').ObjectId;


// async function getEdificiosPorUsuario(usuarioId){
//     let o_uid = new ObjectId(usuarioId); 
//     const clientmongo = await connection.getConnection();

//     const doc = await clientmongo.db("safe_distance")
//       .collection("turnos")
//       .find({usuarioId: o_uid})
//       .toArray();
//     let edificioArray = []

//     for (const turno of doc) {
//         let act =  await clientmongo.db("safe_distance")
//         .collection("actividades")
//         .findOne({_id: turno.actividadId})
//         act = act.edificio.nombre
//         if(!edificioArray.includes(act)){
//             edificioArray.push(act)
//         }
//     }
//     console.log ("edificios" + edificioArray)
//     let newArray = edificioArray.map((edificio, index) => ({ id: index + 1, edificio }));
//     return newArray;
// }
