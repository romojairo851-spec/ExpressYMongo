const mongoose = require('mongoose');

//definir el schema de la colección de usuarios
const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    clave: {
        type: String,
        required: true,        
    },
});

//definir el modelo de la colección de usuarios
const Usuario = mongoose.model('Usuario', usuarioSchema, 'usuarios');

//exportar el modelo
module.exports = Usuario;