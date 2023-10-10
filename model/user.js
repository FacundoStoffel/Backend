require('rootpath')();
const mysql = require('mysql');
const config = require("config.json");


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
    params = [
        user.nombre,
        user.apellido,
        user.mail,
        user.contrasena
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

    params = [
        user.nombre,
        user.apellido,
        user.mail,
        user.contrasena,
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


module.exports = user_db;