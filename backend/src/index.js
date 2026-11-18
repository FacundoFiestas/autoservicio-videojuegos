import express from 'express';
import cors from 'cors';
import config from './api/config/environments.js';
import sequelize, { testConnection } from './api/database/db.js';
import { productRoutes } from './api/routes/index.js';

const app = express();

app.use(cors());
app.use(express.json());


// Probar conexión a la BD al iniciar el servidor
testConnection();

// Rutas
app.use('/api/productos', productRoutes);

app.listen(config.port, () => {
    console.log(`Servidor backend corriendo en http://localhost:${config.port}`);
});

