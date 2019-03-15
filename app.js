//Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
    //Inicializar variables
var app = express();

//Routes
var appRoute = require('./routes/app');
var usuarioRoute = require('./routes/usuario');
var loginRoute = require('./routes/login');
var hospitalRoute = require('./routes/hospital');
var medicoRoute = require('./routes/medico');
var busquedaRoute = require('./routes/busqueda');
var uploadRoute = require('./routes/upload');
var imagenRoute = require('./routes/imagen');

//Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Conexion a la bd
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('Exito!. DB corriendo en puerto 3000: \x1b[36m%s\x1b[0m', 'online');
})

//Server Index Config 
//To show the file index, the file index is public when you access to http://localhost:3000/uploads/hospitales/
var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads'));

//Rutas 
app.use('/usuario', usuarioRoute)
app.use('/login', loginRoute)
app.use('/hospital', hospitalRoute)
app.use('/medico', medicoRoute)
app.use('/busqueda', busquedaRoute)
app.use('/upload', uploadRoute)
app.use('/img', imagenRoute)
app.use('/', appRoute)



//Escuchar peticiones
app.listen(3000, () => {
    console.log('Exito!. Servidor corriendo en puerto 3000: \x1b[36m%s\x1b[0m', 'online');
})


/* app.listen(3000, function() {

}); */