import PermissionService from '../services/permissionService.js';

class PermissionController {
  /**
   * Obtiene la lista de usuarios con sus permisos para el panel de administración
   */
  static async getAllUsersWithPermissions(req, res) {
    try {
      const users = await PermissionService.getAllUsersWithPermissions();
      
      res.json({
        success: true,
        users,
        total: users.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener usuarios con permisos',
        error: error.message
      });
    }
  }

  /**
   * Obtiene los permisos específicos de un usuario
   */
  static async getUserPermissions(req, res) {
    try {
      const { userId } = req.params;
      const permissions = await PermissionService.getUserPermissions(userId);
      
      res.json({
        success: true,
        permissions: permissions.permissions,
        lastModified: permissions.updatedAt,
        modifiedBy: permissions.lastModifiedBy
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener permisos del usuario',
        error: error.message
      });
    }
  }

  /**
   * Obtiene los permisos del usuario autenticado (para el hook usePermissions)
   */
  static async getMyPermissions(req, res) {
    try {
      const userId = req.user.id; // ID del usuario autenticado
      const permissions = await PermissionService.getUserPermissions(userId);
      
      res.json({
        success: true,
        permissions: permissions.permissions,
        lastModified: permissions.updatedAt
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener permisos',
        error: error.message
      });
    }
  }

  /**
   * Actualiza los permisos de un usuario
   */
  static async updateUserPermissions(req, res) {
    try {
      const { userId } = req.params;
      const { permissions } = req.body;
      const modifiedBy = req.user._id; // Usuario que hace la modificación
      
      const updatedPermissions = await PermissionService.updateUserPermissions(
        userId, 
        permissions, 
        modifiedBy
      );
      
      res.json({
        success: true,
        message: 'Permisos actualizados correctamente',
        permissions: updatedPermissions.permissions
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar permisos',
        error: error.message
      });
    }
  }

  /**
   * Crea permisos por defecto para usuarios existentes (migración)
   */
  static async migrateExistingUsers(req, res) {
    try {
      const results = await PermissionService.createDefaultPermissionsForExistingUsers();
      
      res.json({
        success: true,
        message: 'Migración de permisos completada',
        results
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error en migración de permisos',
        error: error.message
      });
    }
  }

  /**
   * Obtiene la estructura de permisos disponibles (para el frontend)
   */
  static async getPermissionStructure(req, res) {
    try {
      const structure = {
        users: {
          name: 'Gestión de Usuarios',
          permissions: [
            { key: 'canView', label: 'Ver usuarios' },
            { key: 'canCreate', label: 'Crear usuarios' },
            { key: 'canEdit', label: 'Editar usuarios' },
            { key: 'canDelete', label: 'Eliminar usuarios' },
            { key: 'canManage', label: 'Gestión completa de usuarios' }
          ]
        },
        warehouses: {
          name: 'Gestión de Bodegas',
          permissions: [
            { key: 'canView', label: 'Ver bodegas' },
            { key: 'canCreate', label: 'Crear bodegas' },
            { key: 'canEdit', label: 'Editar bodegas' },
            { key: 'canDelete', label: 'Eliminar bodegas' }
          ]
        },
        epp: {
          name: 'Gestión de EPP',
          permissions: [
            { key: 'canView', label: 'Ver EPP' },
            { key: 'canCreate', label: 'Crear EPP' },
            { key: 'canEdit', label: 'Editar EPP' },
            { key: 'canDelete', label: 'Eliminar EPP' }
          ]
        },
        requests: {
          name: 'Solicitudes EPP',
          permissions: [
            { key: 'canCreate', label: 'Crear solicitudes' },
            { key: 'canView', label: 'Ver sus solicitudes' },
            { key: 'canViewAll', label: 'Ver todas las solicitudes' },
            { key: 'canEdit', label: 'Editar solicitudes' },
            { key: 'canApprove', label: 'Aprobar solicitudes' },
            { key: 'canReject', label: 'Rechazar solicitudes' },
            { key: 'canDelete', label: 'Eliminar solicitudes' }
          ]
        },
        reports: {
          name: 'Reportes',
          permissions: [
            { key: 'canView', label: 'Ver reportes' },
            { key: 'canExport', label: 'Exportar reportes' },
            { key: 'canManage', label: 'Gestionar reportes' }
          ]
        },
        settings: {
          name: 'Configuraciones',
          permissions: [
            { key: 'canView', label: 'Ver configuraciones' },
            { key: 'canEdit', label: 'Editar configuraciones' }
          ]
        },
        admin: {
          name: 'Panel Administrativo',
          permissions: [
            { key: 'canAccess', label: 'Acceso al panel admin' },
            { key: 'canManagePermissions', label: 'Gestionar permisos' }
          ]
        }
      };
      
      res.json({
        success: true,
        structure
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener estructura de permisos',
        error: error.message
      });
    }
  }
}

export default PermissionController;