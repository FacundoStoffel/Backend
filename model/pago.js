require('rootpath')();
const mysql = require('mysql');
const config = require("config.json");

var pago_db = {}

var connection = mysql.createConnection(config.database);
connection.connect((err) => {
    if (err) {
        console.log(err)
    } else {
        console.log('base de datos conectada')
    }
});


pago_db.getAll = function (funCallback) {
    $query = 'SELECT * from metodo_pago';

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




module.exports = pago_db;