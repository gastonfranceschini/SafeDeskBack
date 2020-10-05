const connection = require("./connection");
var ObjectId = require('mongodb').ObjectId;

async function getEstablecimientosPorUsuario(usuarioId){
    let o_uid = new ObjectId(usuarioId); 
    const clientmongo = await connection.getConnection();

    const doc = await clientmongo.db("safe_distance")
    .collection("turnos")
    .find({usuarioId: o_uid})
    .toArray();
    let establecimientoArray = []

    for (const turno of doc) {
        let act =  await clientmongo.db("safe_distance")
        .collection("actividades")
        .findOne({_id: turno.actividadId})
        act = act.establecimiento.nombre
        if(!establecimientoArray.includes(act)){
            establecimientoArray.push(act)
        }
    }
    console.log ("establecimientos" + establecimientoArray)
    let newArray = establecimientoArray.map((establecimiento, index) => ({ id: index + 1, establecimiento }));
    return newArray;
}

module.exports = {
    getEstablecimientosPorUsuario
};