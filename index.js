//declaracions y configuraciones iniciales
require('rootpath')();
const express = require('express');
const app = express();
const morgan = require('morgan');

var cors = require('cors');
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
morgan(':method :url :status :res[content-length] - :response-time ms');



//de manera local
const config = require("config.json");
//de manera web
// const config = require("config-web.json");

// const port = process.env.PORT || config.server.port;

const controllerUser = require("./controller/userController.js");
const controllerReservas = require("./controller/reservasController.js");
const securityController = require("./controller/securityController.js");
const controllerHora = require("./controller/horaController.js");
const controllerCorte = require("./controller/corteController.js");
const controllerPago = require("./controller/pagoController.js");


app.use('/user', controllerUser);
app.use('/reservas', controllerReservas);
app.use('/security', securityController.app);
app.use('/hora', controllerHora);
app.use('/corte', controllerCorte);
app.use('/pago', controllerPago);


// funcion para indicar que el servidor arranco o no
app.listen(config.server.port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('servidor escuchando en el puerto ' + config.server.port)
    }
});

// app.listen(port, () => {
//     console.log(`port runing in http://localhost:${port}`);
//   });

