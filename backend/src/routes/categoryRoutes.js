import { Router } from 'express';
import { 
  getAllCategories, 
  createCategory, 
  updateCategory
} from '../controllers/categoryController.js';

const router = Router();

// Rutas CRUD de categorías
router.get('/', getAllCategories);
router.post('/', createCategory);
router.put('/:id', updateCategory);

export default router;
