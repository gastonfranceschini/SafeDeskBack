const connection = require("./connection");
var ObjectId = require('mongodb').ObjectId;

async function getUsuarios(){
    const rest = await connection.runQuery('SELECT * FROM Usuarios');
    return rest;
}

async function getUsuarioPorDNI(dni){
    const user = await connection
          .runQuery('SELECT * FROM Usuarios where DNI = "' + dni  + '"');
    return user;
}

async function getUsuarioPorEmail(email){
    const user = await connection
          .runQuery('SELECT * FROM Usuarios where Email = "' + email  + '"');
    return user;
}

async function updateUsuario(usuario){
    let dni = usuario.dni
    let pass = usuario.pass
    let nombre = usuario.nombre
    let email = usuario.email
    let idTipoUsuario = usuario.IdTipoUsuario
    let idGerencia = usuario.IdGerencia
    let idJefeDirecto = usuario.IdJefeDirecto

    let query = `UPDATE usuarios \
                  SET Password = "${pass}" \ 
                      Nombre = "${nombre}" \
                      Email = "${email}" \
                      IdTipoDeUsuario = "${idTipoUsuario}" \
                      IdGerencia = "${idGerencia}" \
                      IdJefeDirecto = "${idJefeDirecto}" \
                  WHERE DNI = "${dni}"`;

    const user = await connection
          .runQuery(query);

    return user;
}

async function updateUsuarioPassword(usuario){
    let dni = usuario.dni
    let pass = usuario.pass

    let query = `UPDATE usuarios \
                  SET Password = "${pass}" \ 
                  WHERE DNI = "${dni}"`;
    const user = await connection
          .runQuery(query);
    return user;
}

// async function checkUsuario(usuarioEmail){
//     const clientmongo = await connection.getConnection();
//     const doc = await clientmongo.db("safe_distance")
//         .collection("usuarios")
//         .findOne({email: usuarioEmail});
//     return doc;
// }

// async function pushUsuario(usuario){
//     const clientmongo = await connection.getConnection();
//     const result = await clientmongo.db("safe_distance")
//         .collection("usuarios")
//         .insertOne(usuario);
//     return result;
// }

module.exports = {getUsuarios, getUsuarioPorDNI, getUsuarioPorEmail,updateUsuarioPassword,updateUsuario};