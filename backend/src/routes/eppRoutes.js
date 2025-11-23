import { Router } from 'express';
import { getAllEpps, createEpp, updateEpp } from '../controllers/eppController.js';

const router = Router();

// Rutas CRUD de EPPs
router.get('/', getAllEpps);
router.post('/', createEpp);
router.put('/:id', updateEpp);

export default router;
