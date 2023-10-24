require('rootpath')();
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pago_db = require("./../model/pago.js")
const securityController = require("./securityController.js");


app.get('/',securityController.verificarToken, getAll)


function getAll(req, res){
    pago_db.getAll( function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
};



module.exports = app;