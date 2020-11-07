var mysql = require('mysql');
require('dotenv').config()

let instance = null
let instanceMySQL = null

async function runQuery(queryString) {
    var resultadoJson;
    try {

       var db = mysql.createConnection({
            host:  process.env.dbhostname, 
            database: process.env.database,
            user: process.env.dbusername,
            password: process.env.password 
            });
        
            var promesa = new Promise((resolve, reject) => 
            {
                db.query(queryString, function (error, results, fields) {
                    if (error) { reject(error); return; }
                    resultadoJson = results;
                    resolve(resultadoJson);
                });
            });
        
            var resultado = await promesa;
            db.end();
            return resultado;
        
    } catch (err) {
        console.log(err.message)
    }
    

}


module.exports = { runQuery };