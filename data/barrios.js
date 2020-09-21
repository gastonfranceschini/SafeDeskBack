const connection = require("./connection");

async function getBarriosPorCiudadYPorActividad(nombreCiudad, tipoActividad){
    const clientmongo = await connection.getConnection();
    let query = {
        "establecimiento.ubicacion.ciudad": nombreCiudad,
        "tipoActividad": tipoActividad
    }
    let coleccion = await clientmongo.db("safe_distance")
        .collection("actividades")
        .distinct("establecimiento.ubicacion.barrio", query);
    let newArray = coleccion.map((barrio, index) => ({ id: index + 1, barrio }));
        console.log(newArray);
    return newArray;
}

module.exports = {getBarriosPorCiudadYPorActividad};