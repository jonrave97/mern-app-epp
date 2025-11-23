import { useAuthContext } from './useAuthContext';

// Permisos del frontend (deben coincidir con backend)
const ROLE_PERMISSIONS = {
  'Administrador': {
    users: ['create', 'read', 'update', 'delete', 'manage'],
    warehouses: ['create', 'read', 'update', 'delete', 'manage'],
    epp: ['create', 'read', 'update', 'delete', 'manage'],
    requests: ['create', 'read', 'update', 'delete', 'approve', 'reject', 'manage'],
    reports: ['read', 'export', 'manage'],
    settings: ['read', 'update', 'manage'],
    dashboard: ['access', 'admin']
  },
  'Jefatura': {
    epp: ['read'],
    requests: ['create', 'read', 'approve', 'reject'],
    dashboard: ['access', 'user']
  },
  'Supervisor': {
    epp: ['read'],
    requests: ['create', 'read'],
    dashboard: ['access', 'user']
  },
  'Usuario': {
    epp: ['read'],
    requests: ['create', 'read'],
    dashboard: ['access', 'user']
  }
};

export const usePermissions = () => {
  const { user } = useAuthContext();
  
  const hasPermission = (resource: string, action: string): boolean => {
    if (!user || !user.rol) return false;
    
    const rolePermissions = ROLE_PERMISSIONS[user.rol as keyof typeof ROLE_PERMISSIONS];
    if (!rolePermissions) return false;
    
    const resourcePermissions = rolePermissions[resource as keyof typeof rolePermissions];
    if (!resourcePermissions) return false;
    
    return (resourcePermissions as string[]).includes(action);
  };

  const canApproveRequests = (): boolean => {
    return hasPermission('requests', 'approve');
  };

  const canManageUsers = (): boolean => {
    return hasPermission('users', 'manage') || hasPermission('users', 'create');
  };

  const canAccessAdmin = (): boolean => {
    return user?.rol === 'Administrador';
  };

  const canCreateRequests = (): boolean => {
    return hasPermission('requests', 'create');
  };

  return {
    hasPermission,
    canApproveRequests,
    canManageUsers,
    canAccessAdmin,
    canCreateRequests,
    userRole: user?.rol || null
  };
};

export default usePermissions;