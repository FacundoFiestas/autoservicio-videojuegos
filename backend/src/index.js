import express from 'express';
import cors from 'cors';
import config from './api/config/environments.js';
import sequelize, { testConnection } from './api/database/db.js';
import { productRoutes, viewRoutes } from "./api/routes/index.js";
import { __dirname, join } from './api/utils/index.js';

const app = express();

app.set("view engine", "ejs");
app.set("views", join(__dirname, "src/views"));


/* ==============
    Middlewares
================ */
app.use(express.static(join(__dirname, "src/public")));
app.use(cors());
app.use(express.json());

// Probar conexión a la BD al iniciar el servidor
testConnection();

// Rutas
app.use('/api/productos', productRoutes);

// Rutas EJS
app.use("/dashboard", viewRoutes);

app.listen(config.port, () => {
    console.log(`Servidor backend corriendo en http://localhost:${config.port}`);
});

