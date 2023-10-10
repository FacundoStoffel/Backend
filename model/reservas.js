require('rootpath')();
const mysql = require('mysql');
const config = require("config.json");

var reservas_db = {};

var connection = mysql.createConnection(config.database);
connection.connect((err) => {
    if (err) {
        console.log(err)
    } else {
        console.log('base de datos conectada')
    }
});



reservas_db.getAll = function (funCallback) {
    $query = 'SELECT * from reservas';

    connection.query($query, function (err, rows) {
        if (err) {
            funCallback(err);
            return;
        }
        funCallback(rows);
    });
};


reservas_db.create = function (reserva, funCallback) {
    params = [
        reserva.fecha,
        reserva.hora,
        reserva.id_usuario,
        reserva.id_corte,
        reserva.id_pago,
        reserva.cancelada
    ];

    $query = 'INSERT INTO reservas (fecha, hora, id_usuario, id_corte, id_pago, cancelada) VALUES (?,?,?,?,?,?)';

    connection.query($query, params, (err, rows) => {
        if (err) {
            if (err.code == "ER_DUP_ENTRY") {
                funCallback({
                    mensaje: 'Esta reserva ya fue registrado',
                    detail: err
                });
            } else{
                funCallback({
                    mensaje: 'Error del servidor',
                    detail: err
                });
            }
        } 
        else {
            funCallback(undefined, {
                message: `Se creo la reserva para el dia ${reserva.fecha} a la hora ${reserva.hora}`,
                detail: rows
            });
        }

    });
};

reservas_db.edit = function (reserva, id_reserva , funcallback) {

    params = [
        reserva.fecha,
        reserva.hora,
        reserva.id_usuario,
        reserva.id_corte,
        reserva.id_pago,
        reserva.cancelada,
        id_reserva
    ];

    $query = 'UPDATE reservas set fecha=?, hora=?, id_usuario=?, id_corte=?, id_pago=?, cancelada=?  WHERE id_reserva=?';

    connection.query($query, params, (err, rows)=> {
        if (err) {
            funcallback({
                message : "error desconocido",
                detail : err
            });
            
        } else {
            if (rows.affectedRows == 0) {
                funcallback({
                    message: "No se encontro usuario: " + id_reserva,
                    detail : err
                });
            } else {
                funcallback(undefined,{
                    message: `Se modifico la reserva ${id_reserva}`,
                    detail: rows
                });
            }

        }

    });
};


reservas_db.delete = function (id_reserva, funCallback) {


    $query = 'DELETE from reservas WHERE id_reserva=?';

    connection.query($query, id_reserva, (err, rows) => {
        if (err) {
            funCallback(err);
            return;
        } else {
            if (rows.affectedRows == 0) {
                funCallback({
                    message: "No se encontro la reserva: " + id_reserva,
                });
            } else {
                funCallback({
                    message: `Se elimino la reserva ${id_reserva}`,
                    detail: rows
                });
            }

        }
    });
};


module.exports = reservas_db;