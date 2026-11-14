import express from 'express';
import cors from 'cors';
import config from './api/config/environments.js';
import sequelize, { testConnection } from './api/database/db.js';

// 1. Importar las rutas de usuarios
import userRoutes from './api/routes/user.routes.js'; 

const app = express();

app.use(cors());
app.use(express.json());

// 2. Asignar las rutas al prefijo '/api/users'
app.use('/api/users', userRoutes);

// Probar conexión a la BD
testConnection();

// 3. Sincronizar los modelos con MySQL (crea las tablas si no existen)
sequelize.sync({ alter: true })
    .then(() => console.log('Tablas sincronizadas correctamente en MySQL.'))
    .catch((error) => console.error('Error al sincronizar las tablas:', error));

app.listen(config.port, () => {
    console.log(`Servidor backend corriendo en http://localhost:${config.port}`);
});