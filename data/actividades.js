const connection = require("./connection");
var ObjectId = require('mongodb').ObjectId;

async function getActividadesPorCondiones(req){
    const clientmongo = await connection.getConnection();
    let query = {};

    if(req.query.tipo != undefined){
        query["tipoActividad"]= req.query.tipo;
    }

    if(req.query.barrio != undefined){
        query["establecimiento.ubicacion.barrio"]= req.query.barrio;
    }

    if(req.query.ciudad != undefined){
        query["establecimiento.ubicacion.ciudad"]= req.query.ciudad;
    }

    let coleccion = await clientmongo.db("safe_distance")
        .collection("actividades")
        .find(query)
        .toArray();        

    if(req.query.densidad != undefined){
        let nuevoArray = [];
        nuevoArray = coleccion.filter(act =>
           (Math.sqrt(act.metrosCuadrados/(Math.PI*act.cupo)) >= req.query.densidad)
        );
        coleccion = nuevoArray;
    } 
    
    if(req.query.horaDesde != undefined && req.query.horaHasta != undefined){
        let nuevoArray = [];
        nuevoArray = coleccion.filter(act =>{

            let dateDesde = new Date();
            
            dateDesde.setHours(parseInt(String(req.query.horaDesde).split(':')[0]));
            dateDesde.setMinutes(parseInt(String(req.query.horaDesde).split(':')[1]));

            let dateHasta = new Date();
            dateHasta.setHours(parseInt(String(req.query.horaHasta).split(':')[0]));
            dateHasta.setMinutes(parseInt(String(req.query.horaHasta).split(':')[1]));

            let dateDesdeDB = new Date();
            dateDesdeDB.setHours(parseInt(String(act.horarioActividad.inicioHorario).split(':')[0]));
            dateDesdeDB.setMinutes(parseInt(String(act.horarioActividad.inicioHorario).split(':')[1]));

            return ((dateDesde.getTime() <= dateDesdeDB.getTime()) && (dateDesdeDB.getTime() <= dateHasta.getTime()))
            }
        );
        coleccion = nuevoArray;
    }
    return coleccion;
}

async function getActividadPorId(actividadId){
    let o_id = new ObjectId(actividadId); 
    const clientmongo = await connection.getConnection();
    let coleccion = await clientmongo.db("safe_distance")
        .collection("actividades")
        .findOne({_id:o_id})
    return coleccion;
}

async function getAllActividades(){
    const clientmongo = await connection.getConnection();
    let coleccion = await clientmongo.db("safe_distance")
        .collection("actividades")
        .distinct("tipoActividad")
    let newArray = coleccion.map((actividad, index) => ({ id: index + 1, actividad }));
    console.log(newArray);
    return newArray;
}

async function actividadEnArray(tipoActividad, array){
    for (const act of array){
        if(act.tipoActividad==tipoActividad){
            return true
        }
    }
    return false
}

async function getActividadesPorUsuario(usuarioId){
    let o_uid = new ObjectId(usuarioId); 
    const clientmongo = await connection.getConnection();

    const doc = await clientmongo.db("safe_distance")
    .collection("turnos")
    .find({usuarioId: o_uid})
    .toArray();

    let actividadesArray = []

    for (const turno of doc) {
        let act =  await clientmongo.db("safe_distance")
        .collection("actividades")
        .findOne({_id: turno.actividadId})

        act =   {
                tipoActividad: act.tipoActividad,
                idActividad: act._id
                }
        actividadesArray.push(act)
        } 
    
    let resultado = []
    let estaEnArray
    for (const act of actividadesArray) {  
        estaEnArray = await actividadEnArray(act.tipoActividad, resultado)
        .then(response => {
            if(!response){
                resultado.push(act)
            } 
        })
        
    }

    console.log ("Actividades" + resultado)
    return resultado;
}

module.exports = {
    getActividadesPorCondiones, 
    getAllActividades, 
    getActividadPorId, 
    getActividadesPorUsuario
};