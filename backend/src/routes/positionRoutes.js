import { Router } from 'express';
import { 
  getAllPositions, 
  createPosition, 
  updatePosition
} from '../controllers/positionController.js';

const router = Router();

// Rutas CRUD de posiciones
router.get('/', getAllPositions);
router.post('/', createPosition);
router.put('/:id', updatePosition);

export default router;
