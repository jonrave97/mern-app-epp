import UserPermission from '../models/userPermissionModel.js';
import User from '../models/userModel.js';

class PermissionService {
  /**
   * Obtiene o crea los permisos de un usuario
   */
  static async getUserPermissions(userId) {
    try {
      let permissions = await UserPermission.findOne({ userId, isActive: true });
      
      if (!permissions) {
        // Crear permisos por defecto si no existen
        permissions = new UserPermission({ userId });
        await permissions.save();
      }
      
      return permissions;
    } catch (error) {
      throw new Error(`Error al obtener permisos: ${error.message}`);
    }
  }

  /**
   * Actualiza los permisos de un usuario
   */
  static async updateUserPermissions(userId, newPermissions, modifiedBy) {
    try {
      const permissions = await UserPermission.findOneAndUpdate(
        { userId, isActive: true },
        { 
          permissions: newPermissions,
          lastModifiedBy: modifiedBy
        },
        { 
          new: true, 
          upsert: true // Crear si no existe
        }
      );
      
      return permissions;
    } catch (error) {
      throw new Error(`Error al actualizar permisos: ${error.message}`);
    }
  }

  /**
   * Verifica si un usuario tiene un permiso específico
   */
  static async hasPermission(userId, section, permission) {
    try {
      const userPermissions = await this.getUserPermissions(userId);
      
      if (!userPermissions || !userPermissions.permissions[section]) {
        return false;
      }
      
      return userPermissions.permissions[section][permission] || false;
    } catch (error) {
      console.error('Error al verificar permiso:', error);
      return false;
    }
  }

  /**
   * Obtiene todos los usuarios con sus permisos para el panel de administración
   */
  static async getAllUsersWithPermissions() {
    try {
      const users = await User.find({ disabled: false })
        .select('name email rol area costCenter')
        .lean();
      
      const usersWithPermissions = await Promise.all(
        users.map(async (user) => {
          const permissions = await UserPermission.findOne({ 
            userId: user._id, 
            isActive: true 
          });
          
          return {
            ...user,
            permissions: permissions ? permissions.permissions : null,
            hasCustomPermissions: !!permissions
          };
        })
      );
      
      return usersWithPermissions;
    } catch (error) {
      throw new Error(`Error al obtener usuarios con permisos: ${error.message}`);
    }
  }

  /**
   * Crea permisos por defecto para usuarios existentes (migración)
   */
  static async createDefaultPermissionsForExistingUsers() {
    try {
      const users = await User.find({ disabled: false }).select('_id rol');
      
      const results = {
        created: 0,
        skipped: 0,
        errors: []
      };
      
      for (const user of users) {
        try {
          const existingPermissions = await UserPermission.findOne({ 
            userId: user._id 
          });
          
          if (!existingPermissions) {
            await new UserPermission({ userId: user._id }).save();
            results.created++;
          } else {
            results.skipped++;
          }
        } catch (error) {
          results.errors.push({
            userId: user._id,
            error: error.message
          });
        }
      }
      
      return results;
    } catch (error) {
      throw new Error(`Error en migración de permisos: ${error.message}`);
    }
  }

  /**
   * Elimina los permisos de un usuario (cuando se elimina el usuario)
   */
  static async deleteUserPermissions(userId) {
    try {
      await UserPermission.findOneAndUpdate(
        { userId },
        { isActive: false },
        { new: true }
      );
      
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar permisos: ${error.message}`);
    }
  }
}

export default PermissionService;