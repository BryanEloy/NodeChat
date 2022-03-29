const mongoose = require('mongoose');

const dbConnection= async ()=>{
    try {
        await mongoose.connect( process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('base de datos online')
    } catch (error) {
        console.log(error)
        throw new Error('Error en conexion a la DB')
    }
}

module.exports= {
    dbConnection
}