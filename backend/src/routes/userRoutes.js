import { Router } from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile,
  getAllUsers,
  createUser,
  updateUser
} from '../controllers/userController.js';

const router = Router();

// Rutas de autenticación
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', getUserProfile);

// Rutas CRUD de usuarios
router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/:id', updateUser);

export default router;