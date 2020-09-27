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

async function getConnectionSQL() {
    /*if (instanceMySQL == null) {
        try {
            instanceMySQL = mysql.createConnection({
                host: 'ClusterMySQL-TEST01.art.com',
                database: 'turnosd',
                user: 'turnos',
                password: 'V8Rf4ZfbpS'
            }).connect();
            console.log('Conexion nueva exitosa!')
        } catch (err) {
            console.log(err.message)
        }
    }*/
    return instanceMySQL
}

async function runQuery(queryString) {

    var resultadoJson;

    var db = mysql.createConnection({
        host: 'localhost',
        database: 'turnosd',
        user: 'root',
        password: '142857'
      });

    /*var db = mysql.createConnection({
        host: 'ClusterMySQL-TEST01.art.com',
        database: 'turnosd',
        user: 'turnos',
        password: 'V8Rf4ZfbpS'
    });*/

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

}


module.exports = { getConnection, getConnectionSQL, runQuery };