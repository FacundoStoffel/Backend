require('rootpath')();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var user_db = require('./../model/user.js')

app.post('/login', login);


function login(req, res) {

    const { mail, contrasena } = req.body; //ES6

    user_db.findByMail(mail, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            
            const iguales = bcrypt.compareSync(contrasena, result.detail.contrasena);
            if (iguales) {
                let user = {
                    nombre: result.detail.nombre,
                    mail: result.detail.mail,
                    rol: result.detail.nombre_rol,
                    id_usuario: result.detail.id_usuario
                }

                jwt.sign(user, 'siliconSectret', { expiresIn: '60000000s' }, (err, token) => {
                    if (err) {
                        res.status(500).send({
                            message: err
                        });
                    } else {
                        res.json({
                            datos: user,
                            token: token
                        });
                    }
                })
            } else {
                res.status(403).send({
                    message: 'Contraseña Incorrecta'
                });
            }
        }
    });
}


function verificarToken(req, res, next) {
    if (req.headers["authorization"]) {
        try {
            const token = req.headers["authorization"]
            const verified = jwt.verify(token, "siliconSectret");
            if (verified) {
                next();
            } else {
                res.status(403).send({
                    message: "Token invalido, permiso denegado"
                });

            }

        } catch (error) {
            res.status(403).send({
                message: "Acceso Denegado"
            });
        }

    } else {
        res.status(403).send({
            message: "No posee token de autorizacion"
        });
    }
}


module.exports = { app, verificarToken };