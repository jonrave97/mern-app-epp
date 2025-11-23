import express from 'express';
import PermissionController from '../controllers/permissionController.js';
import { requireRoles } from '../middlewares/permissionMiddleware.js';

const router = express.Router();

// Middleware temporal - en producción debes agregar autenticación real
const tempAuthMiddleware = (req, res, next) => {
  // Simular usuario administrador para pruebas
  req.user = {
    _id: '6706e490fd1827c682656f50', // ID de un usuario administrador de tu sistema
    rol: 'Administrador'
  };
  next();
};

// Middleware para verificar que el usuario es administrador
const requireAdmin = requireRoles(['Administrador']);

/**
 * @route   GET /api/permissions/users
 * @desc    Obtener todos los usuarios con sus permisos
 * @access  Solo Administradores
 */
router.get('/users', 
  tempAuthMiddleware, 
  requireAdmin, 
  PermissionController.getAllUsersWithPermissions
);

/**
 * @route   GET /api/permissions/user/:userId
 * @desc    Obtener permisos específicos de un usuario
 * @access  Solo Administradores
 */
router.get('/user/:userId', 
  tempAuthMiddleware, 
  requireAdmin, 
  PermissionController.getUserPermissions
);

/**
 * @route   PUT /api/permissions/user/:userId
 * @desc    Actualizar permisos de un usuario
 * @access  Solo Administradores
 */
router.put('/user/:userId', 
  tempAuthMiddleware, 
  requireAdmin, 
  PermissionController.updateUserPermissions
);

/**
 * @route   GET /api/permissions/structure
 * @desc    Obtener estructura de permisos disponibles
 * @access  Solo Administradores
 */
router.get('/structure', 
  tempAuthMiddleware, 
  requireAdmin, 
  PermissionController.getPermissionStructure
);

/**
 * @route   POST /api/permissions/migrate
 * @desc    Migrar permisos para usuarios existentes
 * @access  Solo Administradores
 */
router.post('/migrate', 
  tempAuthMiddleware, 
  requireAdmin, 
  PermissionController.migrateExistingUsers
);

export default router;