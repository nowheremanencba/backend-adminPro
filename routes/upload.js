//Requires
var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();
var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');

var serveIndex = require('serve-index')

// default options
app.use(fileUpload());

//Inicializar variables

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            OK: false,
            mensaje: "No selecciono ningun archivo",
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }
    //Validar tipo
    var tipoValidas = ['hospitales', 'medicos', 'usuarios']
    if (tipoValidas.indexOf(tipo) < 0) {
        return res.status(400).json({
            OK: false,
            mensaje: "Tipo no valida",
            errors: { message: 'Debe seleccionar un tipo valido : ' + extensionesValidas }
        });
    }

    //Obtener el nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //Validar extension
    var extensionesValidas = ['jpg', 'png', 'jpeg', 'gif']
    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            OK: false,
            mensaje: "Extension no valida",
            errors: { message: 'Debe seleccionar una imagen valida : ' + extensionesValidas }
        });
    }

    //Nombre de archivo personalizado
    var nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${extensionArchivo}`;

    //Mover el archivo del temporal a un path 
    var path = `./uploads/${tipo}/${nombreArchivo}`
        // Use the mv() method to place the file somewhere on your server
    archivo.mv(path, function(err) {
        if (err) {
            return res.status(500).json({
                OK: false,
                mensaje: "Error al mover el archivo",
                errors: err
            });
        }
        subirPorTipo(tipo, id, path, res)
    });


    function subirPorTipo(tipo, id, nombreArchivo, res) {
        if (tipo === 'usuarios') {
            Usuario.findById(id, (err, usuarioEncontrado) => {
                if (!usuarioEncontrado) {
                    return res.status(400).json({
                        OK: true,
                        mensaje: { message: "Error al encontrar el usuario", err },
                    })
                }
                var pathViejo = './uploads/usuarios' + usuarioEncontrado.img;
                //si existe elimina el viejo imagen
                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo);
                }
                usuarioEncontrado.img = nombreArchivo;
                usuarioEncontrado.save((err, usuarioActualizado) => {
                    return res.status(200).json({
                        OK: true,
                        mensaje: "Imagen de usuario actualizado",
                        usuario: usuarioActualizado
                    })
                })
            })
        }
        if (tipo === 'medicos') {
            Medico.findById(id, (err, medicoEncontrado) => {

                if (!medicoEncontrado) {
                    return res.status(400).json({
                        OK: true,
                        mensaje: { message: "Error al encontrar el Medico", err },
                    })
                }
                var pathViejo = './uploads/medicos' + medicoEncontrado.img;
                //si existe elimina el viejo imagen
                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo);
                }
                medicoEncontrado.img = nombreArchivo;
                medicoEncontrado.save((err, medicoActualizado) => {
                    return res.status(200).json({
                        OK: true,
                        mensaje: "Imagen de medico actualizado",
                        medico: medicoActualizado
                    })
                })
            })
        }
        if (tipo === 'hospitales') {
            Hospital.findById(id, (err, hospitalEncontrado) => {

                if (!hospitalEncontrado) {
                    return res.status(400).json({
                        OK: true,
                        mensaje: { message: "Error al encontrar el Hospital", err },
                    })
                }

                var pathViejo = './uploads/hospitales' + hospitalEncontrado.img;
                //si existe elimina el viejo imagen
                if (fs.existsSync(pathViejo)) {
                    //if (fs.statSync(pathViejo).isFile()) {
                    fs.unlink(pathViejo, error => {
                        return res.status(500).json({
                            OK: true,
                            mensaje: { message: "Error al actualizar la Imagen de Hospital", error },
                        })
                    });

                }

                hospitalEncontrado.img = nombreArchivo;
                hospitalEncontrado.save((err, hospitalActualizado) => {
                    return res.status(200).json({
                        OK: true,
                        mensaje: "Imagen de Hospital actualizado",
                        hospital: hospitalActualizado
                    })
                })
            })
        }
    }

});

module.exports = app;