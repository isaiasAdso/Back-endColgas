const express = require('express');
const dbconnect = require('./config');
const cors = require('cors');
const UsuariosController = require('./controllers/UsuariosController');
const app = express();

// Configuración de CORS
app.use(cors({
    origin: 'http://localhost:9000', // Permite solicitudes desde este origen
    methods: ['GET', 'POST'], // Métodos permitidos
    allowedHeaders: ['Content-Type'], // Encabezados permitidos
  }));

app.use(express.json());
app.use(UsuariosController);

app.listen(3001, () => {
    console.log("el servidor esta en el puerto 3001");
})

app.use(cors()); // Permite todas las solicitudes CORS





dbconnect(); // Con esto se conecta a la base de datos