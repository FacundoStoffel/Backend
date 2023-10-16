require('rootpath')();
const mysql = require('mysql');
const config = require("config.json");

var hora_db = {}

var connection = mysql.createConnection(config.database);
connection.connect((err) => {
    if (err) {
        console.log(err)
    } else {
        console.log('base de datos conectada')
    }
});


hora_db.getAll = function (funCallback) {
    $query = 'SELECT * from horario';

    connection.query($query, function (err, rows) {
        if (err) {
            funCallback(err);
            return;
        }
        funCallback(rows);
    });
};

hora_db.create = function (horario, funCallback) {
   params=[
    horario.hora
   ]
    $query = 'INSERT INTO horario (hora) VALUES (?)';

    connection.query($query, params, (err, rows) => {
        if (err) {
            if (err.code == "ER_DUP_ENTRY") {
                funCallback({
                    mensaje: 'Este horario ya fue registrado',
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
                message: `Se creo el horario ${params}`,
                detail: rows
            });
        }

    });
};

hora_db.edit = function (horario, hora , funcallback) {

    params = [
        horario.hora,
        hora
    ];

    $query = 'UPDATE horario set hora=? WHERE hora=?';

    connection.query($query, params, (err, rows)=> {
        if (err) {
            funcallback({
                message : "error desconocido",
                detail : err
            });
            
        } else {
            if (rows.affectedRows == 0) {
                funcallback({
                    message: "No se encontro horario: " + hora,
                    detail : err
                });
            } else {
                funcallback(undefined,{
                    message: `Se modifico el horario ${horario.hora}`,
                    detail: rows
                });
            }

        }

    });
};

hora_db.delete = function (hora, funCallback) {


    $query = 'DELETE from horario WHERE hora=?';

    connection.query($query, hora, (err, rows) => {
        if (err) {
            funCallback(err);
            return;
        } else {
            if (rows.affectedRows == 0) {
                funCallback({
                    message: "No se encontro el horario: " + hora,
                });
            } else {
                funCallback({
                    message: `Se elimino el horario ${hora}`,
                    detail: rows
                });
            }

        }
    });
};



module.exports = hora_db;