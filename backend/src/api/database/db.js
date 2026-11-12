import { Sequelize } from 'sequelize';
import config from '../config/environments.js';

const sequelize = new Sequelize(
    config.database.name,
    config.database.user,
    config.database.password,
    {
        host: config.database.host,
        dialect: 'mysql',
        logging: console.log, 
    }
);

// Función prueba de conexion
export const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log(' Conexión a la base de datos MySQL establecida correctamente.');
    } catch (error) {
        console.error(' No se pudo conectar a la base de datos:', error.message);
    }
};

export default sequelize;