import api from './api';

export interface Permission {
  canView?: boolean;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canManage?: boolean;
  canViewAll?: boolean;
  canApprove?: boolean;
  canReject?: boolean;
  canExport?: boolean;
  canAccess?: boolean;
  canManagePermissions?: boolean;
}

export interface UserPermissions {
  users: Permission;
  warehouses: Permission;
  epp: Permission;
  requests: Permission;
  reports: Permission;
  settings: Permission;
  admin: Permission;
}

export interface UserWithPermissions {
  _id: string;
  name: string;
  email: string;
  rol: string;
  area?: string;
  costCenter?: string;
  permissions: UserPermissions | null;
  hasCustomPermissions: boolean;
}

export interface PermissionStructure {
  [section: string]: {
    name: string;
    permissions: Array<{
      key: string;
      label: string;
    }>;
  };
}

export interface MigrationResult {
  created: number;
  skipped: number;
  errors: Array<{
    userId: string;
    error: string;
  }>;
}

const permissionService = {
  /**
   * Obtiene todos los usuarios con sus permisos
   */
  getAllUsersWithPermissions: async (): Promise<UserWithPermissions[]> => {
    const response = await api.get('/permissions/users');
    return response.data.users;
  },

  /**
   * Obtiene los permisos específicos de un usuario
   */
  getUserPermissions: async (userId: string): Promise<UserPermissions> => {
    const response = await api.get(`/permissions/user/${userId}`);
    return response.data.permissions;
  },

  /**
   * Actualiza los permisos de un usuario
   */
  updateUserPermissions: async (userId: string, permissions: UserPermissions): Promise<void> => {
    await api.put(`/permissions/user/${userId}`, { permissions });
  },

  /**
   * Obtiene la estructura de permisos disponibles
   */
  getPermissionStructure: async (): Promise<PermissionStructure> => {
    const response = await api.get('/permissions/structure');
    return response.data.structure;
  },

  /**
   * Migra permisos para usuarios existentes
   */
  migrateExistingUsers: async (): Promise<MigrationResult> => {
    const response = await api.post('/permissions/migrate');
    return response.data.results;
  }
};

export default permissionService;