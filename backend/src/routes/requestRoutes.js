import express from 'express';
import { 
  getMyRequests, 
  getTeamRequests, 
  getMyTeam,
  createRequest, 
  updateRequest, 
  deleteRequest,
  approveRequest,
  rejectRequest
} from '../controllers/requestController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { requirePermissionNew } from '../middlewares/permissionMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Rutas de consulta
router.get('/my-requests', requirePermissionNew('requests', 'canView'), getMyRequests);
router.get('/team-requests', requirePermissionNew('requests', 'canViewAll'), getTeamRequests);
router.get('/my-team', requirePermissionNew('requests', 'canViewAll'), getMyTeam);

// CRUD de solicitudes
router.post('/', requirePermissionNew('requests', 'canCreate'), createRequest);
router.put('/:id', requirePermissionNew('requests', 'canEdit'), updateRequest);
router.delete('/:id', requirePermissionNew('requests', 'canDelete'), deleteRequest);

// Acciones de aprobación
router.patch('/:id/approve', requirePermissionNew('requests', 'canApprove'), approveRequest);
router.patch('/:id/reject', requirePermissionNew('requests', 'canReject'), rejectRequest);

export default router;
