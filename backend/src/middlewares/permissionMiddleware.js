import { hasPermission, canAccessRoute } from '../config/permissions.js';
import PermissionService from '../services/permissionService.js';

/**
 * Middleware para verificar permisos específicos usando el nuevo sistema
 * @param {string} section - Sección del sistema (users, requests, etc.)
 * @param {string} permission - Permiso específico (canView, canCreate, etc.)
 * @returns {Function} - Middleware de Express
 */
export const requirePermissionNew = (section, permission) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }

      // Verificar permiso usando el nuevo sistema de base de datos
      const hasPermissionDB = await PermissionService.hasPermission(user._id, section, permission);
      
      if (!hasPermissionDB) {
        return res.status(403).json({
          success: false,
          message: `No tienes permisos para ${permission} en ${section}`,
          requiredPermission: {
            section,
            permission,
            userRole: user.rol
          }
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error al verificar permisos',
        error: error.message
      });
    }
  };
};

/**
 * Middleware para verificar permisos específicos (sistema original - compatibilidad)
 * @param {string} resource - Recurso requerido
 * @param {string} action - Acción requerida
 * @returns {Function} - Middleware de Express
 */
export const requirePermission = (resource, action) => {
  return (req, res, next) => {
    try {
      // El usuario debe estar autenticado (verificado por authMiddleware previo)
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }

      // Verificar permiso usando el rol existente del usuario
      const userRole = user.rol; // Usar campo 'rol' que ya existe
      
      if (!hasPermission(userRole, resource, action)) {
        return res.status(403).json({
          success: false,
          message: `No tienes permisos para ${action} en ${resource}`,
          requiredPermission: {
            resource,
            action,
            userRole
          }
        });
      }

      // Si tiene permiso, continuar
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error al verificar permisos',
        error: error.message
      });
    }
  };
};

/**
 * Middleware para verificar si el usuario puede acceder a una ruta
 * @param {string} routePath - Ruta a verificar
 * @returns {Function} - Middleware de Express
 */
export const requireRouteAccess = (routePath) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }

      const userRole = user.rol;
      
      if (!canAccessRoute(userRole, routePath)) {
        return res.status(403).json({
          success: false,
          message: `No tienes acceso a la ruta ${routePath}`,
          userRole
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error al verificar acceso a ruta',
        error: error.message
      });
    }
  };
};

/**
 * Middleware para verificar roles específicos (compatibilidad con sistema actual)
 * @param {string[]} allowedRoles - Array de roles permitidos
 * @returns {Function} - Middleware de Express
 */
export const requireRoles = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }

      const userRole = user.rol;
      
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: `Acceso denegado. Roles requeridos: ${allowedRoles.join(', ')}`,
          userRole,
          allowedRoles
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error al verificar roles',
        error: error.message
      });
    }
  };
};