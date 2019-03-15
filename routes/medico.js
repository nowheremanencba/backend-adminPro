//Requires
var express = require('express');
var bcrypt = require('bcryptjs');
var mdAutenticacion = require('../middleware/autenticacion')

//Inicializar variables
var app = express();

var Medico = require('../models/medico');

//============================================================
// Obtener todos los medicos
//============================================================

app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Medico.find({})
        .skip(desde)
        .limit(5)
        /*         .populate('usuarios', 'nombre') */
        .populate('hospital')
        .exec(
            (err, medicos) => {
                if (err) {
                    return res.status(500).json({
                        OK: false,
                        mensaje: "Error cargando los medicos",
                        errors: err
                    });
                }
                Medico.count({}, (err, conteo) => {
                    if (err) {
                        return res.status(500).json({
                            OK: false,
                            mensaje: "Error cargando los medicos",
                            errors: err
                        });
                    }
                    return res.status(200).json({
                        OK: true,
                        medicos: medicos,
                        total: conteo
                    })
                })
            }
        )
})

//============================================================
// Actualizar el medico 
//============================================================ 
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Medico.findById(id, (err, medicoFinded) => {
        if (err) {
            return res.status(500).json({
                OK: false,
                mensaje: "Error obteniendo medico con el id: " + id,
                errors: err
            });
        }
        if (!medicoFinded) {
            return res.status(400).json({
                OK: false,
                mensaje: "Error obteniendo medico con id: " + id,
                errors: { message: "No existe un medico con el id " + id }
            });
        }
        // ---    
        medicoFinded.nombre = body.nombre,
            medicoFinded.img = body.img,
            medicoFinded.usuario = body.usuario,
            medicoFinded.hospital = body.hospital
            // ---

        medicoFinded.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    OK: false,
                    mensaje: "Error al actualizar el medico con el id: " + id,
                    errors: err
                });
            }

            return res.status(200).json({
                OK: true,
                medico: medicoGuardado
            })
        })

    });

})

//============================================================
// Insertar el medico
//============================================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: body.usuario,
        hospital: body.hospital
    });
    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                OK: false,
                mensaje: "Error guardando medico",
                errors: err
            });
        }
        return res.status(201).json({
            OK: true,
            medicoGuardado: medicoGuardado
        })
    });

})


//============================================================
// Eliminar usuario
//============================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Medico.findByIdAndRemove(id, (err, medicoRemoved) => {
        if (err) {
            return res.status(500).json({
                OK: false,
                mensaje: "Error al borrar el medico id: " + id,
                errors: err
            });
        }
        if (!medicoRemoved) {
            return res.status(400).json({
                OK: false,
                mensaje: "No existe el medico id: " + id,
                errors: { message: "No existe un medico con el id " + id }
            });
        }
        return res.status(200).json({
            OK: true,
            medicoRemoved: medicoRemoved
        })
    })
})

module.exports = app;