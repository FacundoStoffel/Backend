require('rootpath')();
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const user_db = require("./../model/user.js")

//rutas del endpoint
app.get('/', getAll);
app.post('/register', createUser);
app.put('/edit/:id_usuario', editUser);
app.delete('/delete/:id_usuario', deleteUser);

//funciones de los endpoints
function getAll(req, res){
    user_db.getAll((err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
};


function createUser(req, res) {

    let user_register = req.body;
    user_db.create(user_register, (err, result)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.json(result);
        }
    });

};

function editUser(req, res) {

    let user_edit = req.body;
    let id_usuario = req.params.id_usuario;
    user_db.edit(user_edit, id_usuario, (err, result)=>{
        if(err){
            res.status(500).send(err);
        }else{
            res.json(result);
        }
    });

};

function deleteUser(req, res){
    let id_usuario = req.params.id_usuario;
    user_db.delete(id_usuario, (err, result)=>{
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