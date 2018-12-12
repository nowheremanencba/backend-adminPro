//Requires
var express = require('express');


//Inicializar variables
var app = express();
var mongoose = require('mongoose');

//Conexion a la bd
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Exito!. DB corriendo en puerto 3000: \x1b[36m%s\x1b[0m', 'online');
})


//Escuchar peticiones
app.listen(3000, () => {
        console.log('Exito!. Servidor corriendo en puerto 3000: \x1b[36m%s\x1b[0m', 'online');
    })
    //Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        OK: true,
        mensaje: "Peticion enviada correctamente con nodemon"
    });
})

/* app.listen(3000, function() {

}); */