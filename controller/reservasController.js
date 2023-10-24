require('rootpath')();
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const reservas_db = require("./../model/reservas.js");
const securityController = require("./securityController.js");

app.get('/', securityController.verificarToken, getAll);
app.post('/create', createReserva);
app.put('/edit/:id_reserva', editReserva);
app.put('/cancelar/:id_reserva', cancelar)
app.delete('/delete/:id_reserva', deleteReserva);

function getAll(req, res){
    reservas_db.getAll((err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
};

// function createReserva(req, res) {

//     let reserva_register = req.body;
//     reservas_db.create(reserva_register, (err, result)=>{
//         if(err){
//             res.status(500).send(err);
//         }else{
//             res.json(result);
//         }
//     });

// };

function createReserva(req, res) {
    let reserva_register = req.body;
    reservas_db.create(reserva_register, (err, result) => {
        if (err) {
            console.error('Error al crear reserva:', err);
            res.status(500).send({ message: 'Error al crear reserva', error: err });
        } else {
            console.log('Reserva creada exitosamente:', result);
            res.json({ message: 'Reserva creada exitosamente', reserva: result });
        }
    });
}

function editReserva(req, res) {

    let reserva_edit = req.body;
    let id_reserva = req.params.id_reserva;
    reservas_db.edit(reserva_edit, id_reserva, (err, result)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.json(result);
        }
    });

};

function deleteReserva(req, res){
    let id_reserva = req.params.id_reserva;
    reservas_db.delete(id_reserva, (err, result)=>{
        if (err) {
            res.status(500).send(err);
        } else {
            if (result_model.detail.affectedRows == 0) {
                res.status(404).send(result_model.message);
            } else {
                res.send(result_model.message);
            }
        }
    })
}

function cancelar(req, res) {
    let id_reserva = req.params.id_reserva;
    reservas_db.cancelarReserva(id_reserva, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (result.detail.affectedRows == 0) {
                res.status(404).send(result.message);
            } else {
                res.send(result);
            }
        }
    });
}

module.exports = app;