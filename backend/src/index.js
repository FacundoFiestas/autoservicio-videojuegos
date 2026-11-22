import express from 'express';
import cors from 'cors';
import config from './api/config/environments.js';
import sequelize, { testConnection } from './api/database/db.js';
import { User } from './api/models/index.js';
import { productRoutes, userRoutes, saleRoutes, viewRoutes } from "./api/routes/index.js";
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
app.use(express.urlencoded({ extended: true }));

// Probar conexión, sincronizar tablas y crear admin inicial
const iniciarBaseDeDatos = async () => {
    await testConnection();
    await sequelize.sync();

    await User.findOrCreate({
        where: { email: 'admin@autogames.com' },
        defaults: {
            nombre: 'Administrador AutoGames',
            email: 'admin@autogames.com',
            password: 'admin123'
        }
    });
};

iniciarBaseDeDatos();

// Rutas API
app.use('/api/productos', productRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/ventas', saleRoutes);

// Rutas EJS
app.use("/dashboard", viewRoutes);

app.listen(config.port, () => {
    console.log(`Servidor backend corriendo en http://localhost:${config.port}`);
});