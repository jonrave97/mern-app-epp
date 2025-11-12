import { Router } from 'express';
import { registerUser, loginUser, getUsers } from '../controllers/userController.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// obtener usuarios
//Ya nose si poner /users o solo / porque en app.js ya tiene /api/users
router.get('/', getUsers);
export default router;