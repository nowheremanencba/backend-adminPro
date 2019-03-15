//Requires
var express = require('express');
var bcrypt = require('bcryptjs');
var mdAutenticacion = require('../middleware/autenticacion')

//Inicializar variables
var app = express();

var Usuario = require('../models/usuario');

//============================================================
// Obtener todos los usuarios
//============================================================

app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    Usuario.find({}, 'nombre email role img')
        .skip(desde)
        .limit(5)
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        OK: false,
                        mensaje: "Error cargando usuarios",
                        errors: err
                    });
                }
                Usuario.count({}, (err, conteo) => {
                    if (err) {
                        return res.status(500).json({
                            OK: false,
                            mensaje: "Error cargando usuarios",
                            errors: err
                        });
                    }
                    return res.status(200).json({
                        OK: true,
                        usuarios: usuarios,
                        total: conteo

                    })
                })

            }
        )
})

//============================================================
// Actualizar el usuario
//============================================================ 
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;
    Usuario.findById(id, (err, usuarioFinded) => {
        if (err) {
            return res.status(500).json({
                OK: false,
                mensaje: "Error obteniendo usuario id: " + id,
                errors: err
            });
        }
        if (!usuarioFinded) {
            return res.status(400).json({
                OK: false,
                mensaje: "Error obteniendo usuario id: " + id,
                errors: { message: "No existe un usuario con el id " + id }
            });
        }

        usuarioFinded.nombre = body.nombre,
            usuarioFinded.email = body.email,
            usuarioFinded.password = bcrypt.hashSync(body.password, 10),
            usuarioFinded.img = body.img,
            usuarioFinded.role = body.role

        usuarioFinded.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    OK: false,
                    mensaje: "Error al actualizar el usuario id: " + id,
                    errors: err
                });
            }
            usuarioFinded.password = ":)"

            return res.status(200).json({
                OK: true,
                usuario: usuarioGuardado
            })
        })

    });

})

//============================================================
// Insertar usuario
//============================================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });
    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                OK: false,
                mensaje: "Error guardando usuario",
                errors: err
            });
        }
        return res.status(201).json({
            OK: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        })
    });

})


//============================================================
// Eliminar usuario
//============================================================
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Usuario.findByIdAndRemove(id, (err, usuarioRemoved) => {
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