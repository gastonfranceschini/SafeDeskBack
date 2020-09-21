const connection = require("./connection");
var ObjectId = require('mongodb').ObjectId;

async function getUsuarios(){
    const clientmongo = await connection.getConnection();
    const collection = await clientmongo.db("safe_distance")
        .collection("usuarios")
        .find()
        .toArray();
    return collection;
}

async function getUsuario(usuarioId){
    let u_id = new ObjectId(usuarioId); 
    const clientmongo = await connection.getConnection();
    const doc = await clientmongo.db("safe_distance")
        .collection("usuarios")
        .findOne({_id: u_id});
    return doc;
}

async function getUsuarioPorProvider(providerId,provider){
    const clientmongo = await connection.getConnection();
    const doc = await clientmongo.db("safe_distance")
        .collection("usuarios")
        .findOne({"provider_id": providerId , "provider": provider});
    return doc;
}

async function getUsuarioPorEmail(email){
    const clientmongo = await connection.getConnection();
    const doc = await clientmongo.db("safe_distance")
        .collection("usuarios")
        .findOne({"email": email});
    return doc;
}

async function checkUsuario(usuarioEmail){
    const clientmongo = await connection.getConnection();
    const doc = await clientmongo.db("safe_distance")
        .collection("usuarios")
        .findOne({email: usuarioEmail});
    return doc;
}

async function pushUsuario(usuario){
    const clientmongo = await connection.getConnection();
    const result = await clientmongo.db("safe_distance")
        .collection("usuarios")
        .insertOne(usuario);
    return result;
}

async function updateUsuario(usuario){
    let o_id = new ObjectId(usuario._id); 
    const clientmongo = await connection.getConnection();
    const query = {_id: o_id};

    const newvalues = {$set: 
        {
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            //password: usuario.password,
            direccion: {
            calle: usuario.direccion.calle,
            altura: usuario.direccion.altura,
            piso: usuario.direccion.piso,
            departamento: usuario.direccion.departamento,
            barrio: usuario.direccion.barrio,
            cp: usuario.direccion.cp, 
            provincia: usuario.direccion.provincia
            },
            fechaNacimiento: usuario.fechaNacimiento,
            documento: usuario.documento,
            telefonos: usuario.telefonos
        }
    };

    const result = await clientmongo.db("safe_distance")
        .collection("usuarios")
        .updateOne(query,newvalues);
    return result;
}

async function updateUsuarioPassword(usuario){
    let o_id = new ObjectId(usuario._id); 
    const clientmongo = await connection.getConnection();
    const query = {_id: o_id};

    const newvalues = {$set: 
        {
            password: usuario.password
        }
    };

    const result = await clientmongo.db("safe_distance")
        .collection("usuarios")
        .updateOne(query,newvalues);
    return result;
}

module.exports = {getUsuarios, getUsuario, checkUsuario, pushUsuario,getUsuarioPorProvider,getUsuarioPorEmail,updateUsuarioPassword,updateUsuario};