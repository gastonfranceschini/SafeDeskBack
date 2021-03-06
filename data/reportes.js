const connection = require("./connection");

async function getReportes(){
    let reportes = 
    await connection.runQuery(`SELECT Id, Nombre, SelGerencia, 
                                SelUsuario, SelFecha, SelEdificio, 
                                SelPiso, SelHorario 
                              FROM reportes`)
    return reportes
}

async function getReportesEspecificos(idTipoUsuario){
    let reportes = 
    await connection.runQuery(`SELECT Id, Nombre, SelGerencia, SelUsuario, 
                                  SelFecha, SelEdificio, SelPiso, SelHorario
                                FROM reportes 
                                WHERE IdTipoUsuarioEspecifico IS NULL OR IdTipoUsuarioEspecifico = ${idTipoUsuario}`)
    return reportes
}

async function getConfiguracion(nombre){
    
    let config = 
    await connection.runQuery(`SELECT valor FROM configuraciones 
                                WHERE nombre = '${nombre}'`)
    return config
}

async function setConfiguracion(nombre, valor){
    
    /*let config = 
    await connection.runQuery(`SELECT valor FROM configuraciones 
                                WHERE nombre = '${nombre}'`)
    return config*/

    let query = `UPDATE configuraciones 
                  SET valor = "${valor}" 
                  WHERE nombre = "${nombre}"`

    const config = await connection
    .runQuery(query)
    return config

}



async function getReporteDinamico(id, campos, valores, idTipoUsuario){
    //traigo el store de la base de datos
    let reportes = await connection.runQuery(`SELECT Query FROM reportes
                                              WHERE id = ${id} 
                                                AND (IdTipoUsuarioEspecifico IS NULL 
                                                      OR IdTipoUsuarioEspecifico = ${idTipoUsuario})`)
    let query =  reportes[0].Query
    //parsing de los campos del store
    for(let i = 0; i < campos.length; i++){ 
        query = query.replace(":" + campos[i],  valores[i]);
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

module.exports = { 
    getReporteDinamico, 
    getReportes,  
    getEdificio, 
    getReportesEspecificos, 
    getConfiguracion, 
    setConfiguracion
}