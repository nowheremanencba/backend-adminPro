//Requires
var express = require('express');

//Inicializar variables
var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

//============================================================
// Busqueda por colección
//============================================================ 
app.get('/coleccion/:tabla/:busqueda', (req, res, next) => {
    let busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i')
    let tabla = req.params.tabla;
    switch (tabla) {
        case 'medico':
            buscarMedicos(busqueda, regex).then(respuestas => {
                return res.status(200).json({
                    OK: true,
                    medicos: respuestas
                })
            })
            break;
        case 'hospital':
            buscarHospitales(busqueda, regex).then(respuestas => {
                return res.status(200).json({
                    OK: true,
                    hospitales: respuestas
                })
            })
            break;
        case 'usuario':
            buscarUsuarios(busqueda, regex).then(respuestas => {
                return res.status(200).json({
                    OK: true,
                    usuarios: respuestas
                })
            })
            break;
        default:
            return res.status(400).json({
                OK: false,
                mensaje: 'Los tipos de busqueda solo son: medico, hospital y usuario.',
                error: { message: 'Tipo de tabla/coleccion no encontrada' }
            })
    }
})

//============================================================
// Busqueda General en todas las colecciones
//============================================================ 

app.get('/todo/:busqueda', (req, res, next) => {
    let busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i')

    Promise.all([
        buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex),
        buscarUsuarios(busqueda, regex)
    ]).then(respuestas => {
        res.status(200).json({
            OK: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        })
    })
})

function buscarHospitales(nombre, regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre')
            .exec((err, hospitales) => {
                if (err) {
                    reject('Error al cargar los hospitales', err)
                } else {
                    resolve(hospitales);
                }
            })
    })
}

function buscarMedicos(nombre, regex) {
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex })
            .exec((err, medicos) => {
                if (err) {
                    reject('Error al cargar los Medicos', err)
                } else {
                    resolve(medicos);
                }
            })
    })
}

function buscarUsuarios(nombre, regex) {
    return new Promise((resolve, reject) => {
        Usuario.find()
            .or([{ 'nombre': regex, 'email': regex }])
            .exec((err, resp) => {
                if (err) {
                    reject('Error al cargar los Medicos', err)
                } else {
                    resolve(resp);
                }
            })

    })
}
module.exports = app;