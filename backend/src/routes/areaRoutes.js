import express from 'express';
import { getAllAreas, createArea, updateArea } from '../controllers/areaController.js';

const router = express.Router();

// GET /api/areas/all - Obtener todas las áreas con paginación
router.get('/all', getAllAreas);

// POST /api/areas/create - Crear nueva área
router.post('/create', createArea);

// PUT /api/areas/update/:id - Actualizar área
router.put('/update/:id', updateArea);

export default router;
