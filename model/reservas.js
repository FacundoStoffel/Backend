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


convertirFecha = (date) => {
    const fecha = new Date(date);
    const dia = fecha.getUTCDate().toString().padStart(2, '0');
    const mes = (fecha.getUTCMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getUTCFullYear();
    return `${anio}-${mes}-${dia}`;
}




reservas_db.getAll = function (funCallback) {
//$query = 'SELECT * from reservas';
$query = 'SELECT reservas.*, horario.hora, CONCAT(usuario.nombre , " ", usuario.apellido) AS nombre_completo, tipo_corte.corte_tipo, metodo_pago.metodo FROM reservas INNER JOIN horario ON reservas.hora = horario.hora INNER JOIN usuario ON reservas.id_usuario = usuario.id_usuario INNER JOIN tipo_corte ON reservas.id_corte = tipo_corte.id_corte INNER JOIN metodo_pago ON reservas.id_pago = metodo_pago.id_pago  AND cancelada is false order by reservas.fecha ASC'
    connection.query($query, function (err, rows) {
        if (err) {
            funCallback({
                message: "Ah ocurrido un error al listar",
                detail: err
            });
            
        }else {
            funCallback(undefined, rows);
        }
    });
};



reservas_db.create = function (reserva, funCallback) {
    params = [
        convertirFecha(reserva.fecha),
        reserva.hora,
        reserva.id_usuario,
        reserva.id_corte,
        reserva.id_pago,

    ];

    $query = 'INSERT INTO reservas (fecha, hora, id_usuario, id_corte, id_pago, cancelada) VALUES (?,?,?,?,?,false)';

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
        convertirFecha(reserva.fecha),
        reserva.hora,
        reserva.id_usuario,
        reserva.id_corte,
        reserva.id_pago,
        // reserva.cancelada,
        id_reserva
    ];

    $query = 'UPDATE reservas set fecha=?, hora=?, id_usuario=?, id_corte=?, id_pago=?  WHERE id_reserva=?';

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
                funCallback(
                    {
                    message: "No se encontro la reserva: " + id_reserva,
                });
            } else {
                funCallback(
                    {
                    message: `Se elimino la reserva ${id_reserva}`,
                    detail: rows
                });
            }

        }
    });
};

reservas_db.cancelarReserva = function (id_reserva, funCallback) {
    consulta = "UPDATE reservas SET cancelada = true WHERE id_reserva = ?";
    connection.query(consulta, id_reserva, (err, result) => {
        if (err) {
            funCallback({
                message: err.code,
                detail: err
            });
        } else {
            if (result.affectedRows == 0) {
                funCallback(undefined,
                    {
                        message: "no se encontro una reserva con el id ingresado",
                        detail: result
                    });
            } else {
                funCallback(undefined,
                    {
                        message: "Reserva cancelada con exito",
                        detail: result
                    });
            }
        }
    });
}


module.exports = reservas_db;