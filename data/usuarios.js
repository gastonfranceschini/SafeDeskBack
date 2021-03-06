const connection = require("./connection");

const T_OPERADOR = 1;
const T_SUPERVISOR = 2;
const T_GERENTE = 3;
const T_ADMINISTRADOR = 4;
const T_SEGURIDAD = 5;

async function getUsuarios(){
    const rest = await connection.runQuery('SELECT * FROM usuarios')
    return rest
}

async function getGerencias(usuario){
    let query;

    if (usuario.IdTipoDeUsuario == T_SUPERVISOR)
    {
        query = `select id,Nombre from gerencias where id = ` + usuario.IdGerencia;
    }
    else if (usuario.IdTipoDeUsuario == T_GERENTE)
    {
        query = `select id,Nombre from gerencias where id = ` + usuario.IdGerencia;
    }
    else
    {
        query = `select id,Nombre from gerencias`;
    }

    const rest = await connection.runQuery(query);
    return rest
}

async function getUsuariosDependientes(usuario){

    let query;

    if (usuario.IdTipoDeUsuario == T_OPERADOR || usuario.IdTipoDeUsuario == T_SUPERVISOR)
    {
        query = `select dni,nombre from usuarios where 
        IdJefeDirecto = ` + usuario.DNI + ` or DNI = ` + usuario.DNI;
    }
    else if (usuario.IdTipoDeUsuario == T_GERENTE)
    {
        query = `select dni,nombre from usuarios where 
        IdGerencia = ` + usuario.IdGerencia;
    }
    else
    {
        query = `select dni,nombre from usuarios`;
    }

    const rest = await connection.runQuery(query);
    return rest
}

async function getUsuarioPorDNI(dni){
    const user = await connection
          .runQuery(`SELECT u.*, g.Nombre as NombreGerencia
                      FROM usuarios u
                      INNER JOIN gerencias g
                        ON g.id = u.IdGerencia
                      where DNI = "${dni}"`)
    return user
}

async function getUsuarioPorEmail(email){
    const user = await connection
          .runQuery(`SELECT * FROM usuarios where Email = "${email}"`)
    return user
}

async function updateUsuario(usuario){
    let dni = usuario.DNI
    let nombre = usuario.nombre
    let email = usuario.email
    let idTipoUsuario = usuario.idTipoUsuario
    let idGerencia = usuario.idGerencia
    let idJefeDirecto = usuario.idJefeDirecto

    let query = `UPDATE usuarios
                  SET Nombre = "${nombre}",
                      Email = "${email}",
                      IdTipoDeUsuario = ${idTipoUsuario},
                      IdGerencia = ${idGerencia},
                      IdJefeDirecto = ${idJefeDirecto}
                  WHERE DNI = ${dni};`

    const user = await connection
          .runQuery(query)

    return user
}

async function updateUsuarioPassword(usuario){
    let dni = usuario.dni
    let pass = usuario.pass

    let query = `UPDATE usuarios \
                  SET Password = "${pass}" \ 
                  WHERE DNI = "${dni}"`
    const user = await connection
          .runQuery(query)
    return user
}

module.exports = {
  getUsuarios, 
  getUsuarioPorDNI, 
  getUsuarioPorEmail,
  updateUsuarioPassword,
  updateUsuario,
  getUsuariosDependientes,
  getGerencias
}