const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.set('strictQuery', true);

// Connect MongoDB at default port 27017.
mongoose.connect('mongodb://127.0.0.1:27017/MyFirstConnection', { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (!err) {
        console.log('Conexion a la base de datos correcta')
    } else {
        console.log('Error en la conexion: ' + err)
    }
});