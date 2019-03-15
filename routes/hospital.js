//Requires
var express = require('express');
var bcrypt = require('bcryptjs');
var mdAutenticacion = require('../middleware/autenticacion')

//Inicializar variables
var app = express();

var Hospital = require('../models/hospital');

//============================================================
// Obtener todos los hospitales
//============================================================

app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuarios')
        .exec(
            (err, hospitales) => {
                if (err) {
                    return res.status(500).json({
                        OK: false,
                        mensaje: "Error cargando los hospitales",
                        errors: err
                    });
                }
                Hospital.count({}, (err, conteo) => {
                    if (err) {
                        return res.status(500).json({
                            OK: false,
                            mensaje: "Error cargando los hospitales",
                            errors: err
                        });
                    }
                    return res.status(200).json({
                        OK: true,
                        hospitales: hospitales,
                        total: conteo
                    })
                })
            }
        )
})

//============================================================
// Actualizar el hospital 
//============================================================ 
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;
    Hospital.findById(id, (err, hospitalFinded) => {
        if (err) {
            return res.status(500).json({
                OK: false,
                mensaje: "Error obteniendo hospital id: " + id,
                errors: err
            });
        }
        if (!hospitalFinded) {
            return res.status(400).json({
                OK: false,
                mensaje: "Error obteniendo hospital id: " + id,
                errors: { message: "No existe un hospital con el id " + id }
            });
        }


        hospitalFinded.nombre = body.nombre,
            hospitalFinded.img = body.img,
            hospitalFinded.usuario = body.usuario


        hospitalFinded.save((err, hospistalGuardado) => {
            if (err) {
                return res.status(400).json({
                    OK: false,
                    mensaje: "Error al actualizar el hospital id: " + id,
                    errors: err
                });
            }
            hospistalGuardado.password = ":)"

            return res.status(200).json({
                OK: true,
                hospital: hospistalGuardado
            })
        })

    });

})

//============================================================
// Insertar el hospital
//============================================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: body._id
    });
    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                OK: false,
                mensaje: "Error guardando usuario",
                errors: err
            });
        }
        return res.status(201).json({
            OK: true,
            hospital: hospitalGuardado
        })
    });

})


//============================================================
// Eliminar usuario
//============================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Hospital.findByIdAndRemove(id, (err, usuarioRemoved) => {
        if (err) {
            return res.status(500).json({
                OK: false,
                mensaje: "Error al borrar el usuario id: " + id,
                errors: err
            });
        }
        if (!usuarioRemoved) {
            return res.status(400).json({
                OK: false,
                mensaje: "No existe el usuario id: " + id,
                errors: { message: "No existe un usuario con el id " + id }
            });
        }
        return res.status(200).json({
            OK: true,
            usuario: usuarioRemoved
        })
    })
})

module.exports = app;