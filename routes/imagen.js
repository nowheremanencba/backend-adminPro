//Requires
var express = require('express');

//Inicializar variables
var app = express();

const path = require('path');

const fs = require('fs');

app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    var pathImagen = path.resolve(__dirname, `../uploads/${ tipo }/${ img }`);
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        var PathNoImagen = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(PathNoImagen);
    }

    //Validar tipo
    // var tipoValidas = ['hospitales', 'medicos', 'usuarios']
    // if (tipoValidas.indexOf(tipo) < 0) {
    //     return res.status(400).json({
    //         OK: false,
    //         mensaje: "Tipo no valida",
    //         errors: { message: 'Debe seleccionar un tipo valido : ' + extensionesValidas }
    //     });
    // }

    // res.status(200).json({
    //     OK: true,
    //     mensaje: "Peticion enviada correctamente con nodemon"
    // });
})
module.exports = app;