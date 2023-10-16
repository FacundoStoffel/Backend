require('rootpath')();
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const hora_db = require("./../model/hora.js")

app.get('/', getAll);
app.post('/create', createHora);
app.put('/edit/:hora', editHora);
app.delete('/delete/:hora', deleteHora);

function getAll(req, res){
    hora_db.getAll((err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
};

function createHora(req, res) {

    let horaCreada = req.body;
    hora_db.create(horaCreada, (err, result)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.json(result);
        }
    });

};

function editHora(req, res) {

    let hora_edit = req.body;
    let hora = req.params.hora;
    hora_db.edit(hora_edit, hora, (err, result)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.json(result);
        }
    });
};

function deleteHora(req, res){
    let hora = req.params.hora;
    hora_db.delete(hora, (err, result)=>{
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