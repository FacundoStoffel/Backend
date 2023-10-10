//declaracions y configuraciones iniciales
require('rootpath')();
const express = require('express');
const app = express();
const morgan = require('morgan');

var cors = require('cors')
app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
morgan(':method :url :status :res[content-length] - :response-time ms');

const config = require("config.json");
const controllerUser = require("./controller/userController.js");
const controllerReservas = require("./controller/reservasController.js");
const securityController = require("./controller/securityController.js");

app.use('/user', controllerUser);
app.use('/reservas', controllerReservas);
app.use('/security', securityController.app);


//funcion para indicar que el servidor arranco o no
app.listen(config.server.port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('servidor escuchando en el puerto ' + config.server.port)
    }
});