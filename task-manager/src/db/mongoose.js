const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.set('strictQuery', true);

// Connect MongoDB at default port 27017.
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if (!err) {
        console.log('Conexion a la base de datos correcta')
    } else {
        console.log('Error en la conexion: ' + err)
    }
});