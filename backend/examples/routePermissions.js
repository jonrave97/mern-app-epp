// Ejemplo de cómo aplicar los middlewares en tus rutas
import { requirePermission, requireRoles } from '../middlewares/permissionMiddleware.js';
import { authMiddleware } from '../middlewares/authMiddleware.js'; // Tu middleware de auth existente

// En tus rutas de solicitudes EPP
router.post('/requests', 
  authMiddleware,
  requirePermission('requests', 'create'), // Todos pueden crear
  createRequest
);

router.get('/requests', 
  authMiddleware,
  requirePermission('requests', 'read'), // Todos pueden leer (sus propias)
  getRequests
);

// SOLO Jefatura y Administrador pueden aprobar
router.patch('/requests/:id/approve', 
  authMiddleware,
  requirePermission('requests', 'approve'), // Solo Jefatura y Admin
  approveRequest
);

// SOLO Administradores pueden gestionar usuarios
router.get('/users', 
  authMiddleware,
  requirePermission('users', 'read'), // Solo Admin
  getUsers
);

router.post('/users', 
  authMiddleware,
  requirePermission('users', 'create'), // Solo Admin
  createUser
);

// Alternativa: usar requireRoles (más simple)
router.get('/admin/*', 
  authMiddleware,
  requireRoles(['Administrador']), // Solo Admin
  adminRoutes
);