/*==================================
    Controladores de Encuestas
==================================*/

import ExcelJS from 'exceljs';
import { Survey } from '../models/index.js';

// POST /api/encuestas -> Guardar encuesta del cliente
export const createSurvey = async (req, res) => {
    try {
        const { email, opinion, puntuacion, recomienda } = req.body;
        const recomiendaBool =
            recomienda === true || recomienda === 'true' || recomienda === 'on';

        const nuevaEncuesta = await Survey.create({
            email: email.trim(),
            opinion: opinion.trim(),
            puntuacion: Number(puntuacion),
            recomienda: recomiendaBool,
            imagen: `/uploads/encuestas/${req.file.filename}`,
            fecha: new Date()
        });

        return res.status(201).json({
            success: true,
            message: 'Encuesta registrada correctamente',
            data: nuevaEncuesta
        });
    } catch (error) {
        console.error('Error al guardar encuesta:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno al guardar la encuesta',
            error: error.message
        });
    }
};

// GET /api/encuestas/excel -> Descargar encuestas en Excel (.xlsx)
export const exportSurveysExcel = async (req, res) => {
    try {
        const encuestas = await Survey.findAll({
            order: [['fecha', 'DESC']]
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Encuestas AutoGames');

        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Fecha', key: 'fecha', width: 22 },
            { header: 'Email Cliente', key: 'email', width: 30 },
            { header: 'Puntuación (1-10)', key: 'puntuacion', width: 18 },
            { header: '¿Recomienda?', key: 'recomienda', width: 15 },
            { header: 'Opinión', key: 'opinion', width: 50 },
            { header: 'Ruta Imagen', key: 'imagen', width: 35 }
        ];

        worksheet.getRow(1).font = { bold: true };

        encuestas.forEach((enc) => {
            worksheet.addRow({
                id: enc.id,
                fecha: new Date(enc.fecha).toLocaleString('es-AR'),
                email: enc.email,
                puntuacion: enc.puntuacion,
                recomienda: enc.recomienda ? 'Sí' : 'No',
                opinion: enc.opinion,
                imagen: enc.imagen
            });
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            'attachment; filename="Encuestas_AutoGames.xlsx"'
        );

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error al exportar encuestas a Excel:', error);
        return res.status(500).json({
            success: false,
            message: 'Error al generar el Excel de encuestas',
            error: error.message
        });
    }
};