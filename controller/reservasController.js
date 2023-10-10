require('rootpath')();
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const reservas_db = require("./../model/reservas.js");

app.get('/', getAll);
app.post('/create', createReserva);
app.put('/edit/:id_reserva', editReserva);
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

function createReserva(req, res) {

    let reserva_register = req.body;
    reservas_db.create(reserva_register, (err, result)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.json(result);
        }
    });

};

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

module.exports = app;