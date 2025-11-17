import { Router } from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/userController.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', getUserProfile);

export default router;