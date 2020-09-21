const connection = require("./connection");

async function getAllCiudades(){
    const clientmongo = await connection.getConnection();
    let coleccion = await clientmongo.db("safe_distance")
        .collection("actividades")
        .distinct("establecimiento.ubicacion.ciudad")
    let newArray = coleccion.map((ciudad, index) => ({ id: index + 1, ciudad }));
    console.log(newArray);
    return newArray;
}

module.exports = {getAllCiudades};