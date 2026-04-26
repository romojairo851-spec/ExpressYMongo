const express = require('express');
const path = require('path');
const connectDB = require('./config');
const Usuario = require('./model');

const app = express();
const port = 3000;

app.use(express.json());//para parsear el body de las peticiones
app.use(express.urlencoded({ extended: true }));//para parsear el body de las peticiones
app.use(express.static(__dirname));

//conectar a la base de datos
connectDB();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
//ruta de login
app.post('/login', async (req, res) => {
    const { nombre, clave } = req.body || {};

    if (!nombre || !clave) {
        return res.status(400).json({ mensaje: 'Envia nombre y clave en el body (JSON o x-www-form-urlencoded)' });
    }

    try {
        const usuario = await Usuario.findOne({ nombre, clave });
        if (!usuario) {
            return res.status(401).send('Usuario o clave incorrectos');
        }
        return res.send(`Bienvenido ${usuario.nombre}`);
    } catch (error) {
        return res.status(500).send('Error al procesar el login');
    }
});

//listar usuarios
app.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.find({}, { _id: 0, __v: 0 });
        return res.json(usuarios);
    } catch (error) {
        return res.status(500).send('Error al obtener usuarios');
    }
});

//crear usuario
app.post('/usuarios', async (req, res) => {
    const { nombre, clave } = req.body || {};

    if (!nombre || !clave) {
        return res.status(400).json({ mensaje: 'nombre y clave son obligatorios en el body (JSON o x-www-form-urlencoded)' });
    }

    try {
        const nuevoUsuario = new Usuario({ nombre, clave });
        await nuevoUsuario.save();
        return res.status(201).json({ mensaje: 'Usuario creado correctamente', usuario: { nombre } });
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al crear usuario' });
    }
});

//Buscar usuario por nombre
app.get('/usuarios/:nombre', async (req, res) => {
    const { nombre } = req.params || {};
    try {
        const usuario = await Usuario.findOne({ nombre });
        return res.json(usuario);
    } catch (error) {
        return res.status(500).send('Error al buscar usuario');
    }
});

//Actualizar usuario
app.put('/usuarios/:nombre', async (req, res) => {
    const { nombre } = req.params || {};
    const { nombre: nuevoNombre, clave: nuevaClave } = req.body || {};
    try {
        const usuario = await Usuario.findOneAndUpdate({ nombre }, { nombre: nuevoNombre, clave: nuevaClave }, { new: true });
        return res.json(usuario);
    } catch (error) {
        return res.status(500).send('Error al actualizar usuario');
    }
});

//Eliminar usuario
app.delete('/usuarios/:nombre', async (req, res) => {
    const { nombre } = req.params || {};
    try {
        await Usuario.findOneAndDelete({ nombre });
        return res.json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
        return res.status(500).send('Error al eliminar usuario');
    }
});

//definir el puerto
const PORT = process.env.PORT || 3000;

//iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});