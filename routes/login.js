//Requires
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

//Inicializar variables
var app = express();

var Usuario = require('../models/usuario');

app.post('/', (req, res, next) => {
    var body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {
        if (err) {
            return res.status(500).json({
                OK: false,
                mensaje: "Error obteniendo usuario con email: ",
                errors: err
            });
        }
        if (!usuarioBD) {
            return res.status(400).json({
                OK: false,
                mensaje: "Credenciales incorrectas. Verifique su email",
                errors: err
            });
        }
        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            return res.status(400).json({
                OK: false,
                mensaje: "Credenciales incorrectas. Verifique su password",
                errors: err
            });
        }
        usuarioBD.password = ":)"

        //Crear token
        var token = jwt.sign({ usuario: usuarioBD }, SEED, { expiresIn: 14400 }); //4 horas
        return res.status(200).json({
            OK: true,
            usuario: usuarioBD,
            token: token,
            id: usuarioBD._id
        })
    });

})

module.exports = app;