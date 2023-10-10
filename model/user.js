require('rootpath')();
const mysql = require('mysql');
const config = require("config.json");
const bcrypt = require('bcrypt');


var user_db = {};

//conexion base de datos
var connection = mysql.createConnection(config.database);
connection.connect((err) => {
    if (err) {
        console.log(err)
    } else {
        console.log('base de datos conectada')
    }
});



user_db.getAll = function (funCallback) {
    $query = 'SELECT * from usuario';

    connection.query($query, function (err, rows) {
        if (err) {
            funCallback(err);
            return;
        }
        funCallback(rows);
    });
};

user_db.create = function (user, funCallback) {
    let claveCifrada = bcrypt.hashSync(user.contrasena, 10);
    params = [
        user.nombre,
        user.apellido,
        user.mail,
        claveCifrada
    ];

    $query = 'INSERT INTO usuario (nombre, apellido, mail, contrasena, id_rol) VALUES (?,?,?,?,2)';

    connection.query($query, params, (err, rows) => {
        if (err) {
            if (err.code == "ER_DUP_ENTRY") {
                funCallback({
                    mensaje: 'Este correo ya fue registrado',
                    detail: err
                });
            } else {
                funCallback({
                    mensaje: 'Error del servidor',
                    detail: err
                });
            }
        } else {
            funCallback(undefined, {
                message: `Se creo el usuario ${user.nombre} ${user.apellido}`,
                detail: rows
            });
        }

    });
};

user_db.edit = function (user, id_usuario , funcallback) {
    let claveCifrada = bcrypt.hashSync(user.contrasena, 10);

    params = [
        user.nombre,
        user.apellido,
        user.mail,
        claveCifrada,
        id_usuario
    ];

    $query = 'UPDATE usuario set nombre=?, apellido=?, mail=?, contrasena=? WHERE id_usuario=?';

    connection.query($query, params, (err, rows)=> {
        if (err) {
            funcallback({
                message : "error desconocido",
                detail : err
            });
            
        } else {
            if (rows.affectedRows == 0) {
                funcallback({
                    message: "No se encontro usuario: " + id_usuario,
                    detail : err
                });
            } else {
                funcallback(undefined,{
                    message: `Se modifico el usuario ${user.nombre} ${user.apellido}`,
                    detail: rows
                });
            }

        }

    });
};

user_db.delete = function (id_usuario, funCallback) {


    $query = 'DELETE from usuario WHERE id_usuario=?';

    connection.query($query, id_usuario, (err, rows) => {
        if (err) {
            funCallback(err);
            return;
        } else {
            if (rows.affectedRows == 0) {
                funCallback({
                    message: "No se encontro usuario: " + id_usuario,
                });
            } else {
                funCallback({
                    message: `Se elimino el usuario ${id_usuario}`,
                    detail: rows
                });
            }

        }
    });
};


user_db.findByMail = function (mail, funCallback) {
    var consulta = 'SELECT * FROM usuario WHERE mail = ?';
    connection.query(consulta, mail, function (err, result) {
        if (err) {
            funCallback(err);
            return;
        } else {

            if (result.length > 0) {
                funCallback(undefined, {
                    message: `Usuario encontrado`,
                    detail: result[0]
                });
            } else {
                funCallback({
                    message: "No existe un usuario que coincida con el criterio de busqueda",
                    detail: result
                });
            }
        }
    });
}

module.exports = user_db;