import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const Survey = sequelize.define('Survey', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    opinion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    puntuacion: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    recomienda: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    imagen: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'encuestas',
    timestamps: false
});

export default Survey;