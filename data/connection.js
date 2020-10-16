const MongoClient = require('mongodb').MongoClient;
var mysql = require('mysql');
require('dotenv').config()

const uri = process.env.MONGODB

const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });

let instance = null
let instanceMySQL = null

async function getConnection() {
    if (instance == null) {
        try {
            instance = await client.connect();
        } catch (err) {
            console.log(err.message)
        }
    }
    return instance
}

async function runQuery(queryString) {
    var resultadoJson;
    /*
    var db = mysql.createConnection({
        host:  'localhost', //10.78.160.5
        database: 'turnosd',
        user: 'root', //turnos
        password: 'password' // 'password' // '142857' //'V8Rf4ZfbpS'
      });
    
    var db = mysql.createConnection({
        host:  '10.78.160.5',
        database: 'turnosd',
        user: 'turnos', 
        password: 'V8Rf4ZfbpS' 
      });
    */
   /*
    var db = mysql.createConnection({
    host:  process.env.MySQLHost, //'localhost', //10.78.160.5
    database: process.env.MySQLDB,
    user: process.env.MySQLUser, //turnos
    password: process.env.MySQLPass // password // '142857' //'V8Rf4ZfbpS'
    });
*/
    try {

       var db = mysql.createConnection({
            host:  process.env.hostname, 
            database: process.env.database,
            user: process.env.dbusername,
            password: process.env.password 
            });
        
            var promesa = new Promise((resolve, reject) => 
            {
                db.query(queryString, function (error, results, fields) {
                    if (error) { reject(error); return; }
                    resultadoJson = results;//JSON.stringify(results);
                    //console.log(resultadoJson);
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


module.exports = { getConnection, runQuery };