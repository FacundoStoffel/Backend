require('rootpath')();
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corte_db = require("./../model/corte.js")
const securityController = require("./securityController.js");


app.get('/',securityController.verificarToken, getAll)


function getAll(req, res){
    corte_db.getAll( function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
};



module.exports = app;