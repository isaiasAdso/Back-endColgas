const mongoose = require('mongoose');

const dbconnect = async () => {
    mongoose.set('strictQuery', true);
    try {
        await mongoose.connect("mongodb+srv://isaiasadso2023:Karol130419@colgas.wo2la.mongodb.net/Colgas", {});
        console.log('Base de datos online');
    } catch (err) {
        console.error('Error al conectar a la base de datos', err);
        throw err;
    }
}

module.exports = dbconnect;