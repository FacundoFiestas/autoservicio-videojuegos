/*======================
    Rutas Encuestas
======================*/

import { Router } from 'express';
import { uploadImagenEncuesta, validateSurvey } from '../middlewares/middlewares.js';
import { createSurvey, exportSurveysExcel } from '../controllers/survey.controllers.js';

const router = Router();

const handleUploadEncuesta = (req, res, next) => {
    uploadImagenEncuesta.single('imagen')(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message || 'Error al subir la imagen'
            });
        }
        next();
    });
};

router.post('/', handleUploadEncuesta, validateSurvey, createSurvey);
router.get('/excel', exportSurveysExcel);

export default router;