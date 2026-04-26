const mongoose = require('mongoose');

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/inventario';

    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Error al conectar a la base de datos MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;