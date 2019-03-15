//Requires
var express = require('express');

//Inicializar variables
var app = express();
app.get('/', (req, res, next) => {
    res.status(200).json({
        OK: true,
        mensaje: "Peticion enviada correctamente con nodemon"
    });
})
module.exports = app;