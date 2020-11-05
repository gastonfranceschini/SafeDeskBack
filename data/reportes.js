const connection = require("./connection");

async function getReportes(){
    let reportes = 
    await connection.runQuery(`select Id,Nombre,SelGerencia,SelUsuario,SelFecha,SelEdificio,SelPiso,SelHorario from reportes`)
    return reportes
}

async function getReportesEspecificos(idTipoUsuario){
    
    let reportes = 
    await connection.runQuery(`select Id,Nombre,SelGerencia,SelUsuario,SelFecha,SelEdificio,SelPiso,SelHorario
     from reportes where IdTipoUsuarioEspecifico is null or IdTipoUsuarioEspecifico = ${idTipoUsuario}`)


    return reportes
}


async function getReporteDinamico(id,campos,valores,idTipoUsuario){
    //traigo el store de la base de datos
    let reportes = await connection.runQuery(`select Query from reportes
    where id = ${id} and (IdTipoUsuarioEspecifico is null or IdTipoUsuarioEspecifico = ${idTipoUsuario})`)

    let query =  reportes[0].Query
    //parsing de los campos del store
    for(let i = 0; i < campos.length; i++){ 
        query = query.replace(":" + campos[i], valores[i]);
    }
    console.log(query);
    //corro el store
    let reporte = await connection.runQuery(`call ${query}`)
    return reporte[0];
}

async function getEdificio(id){
    let edificios = await connection.runQuery(`SELECT * FROM edificios WHERE Id = ${id}`)
    return edificios
}

module.exports = { getReporteDinamico,
        getReportes, 
        getEdificio,getReportesEspecificos
}