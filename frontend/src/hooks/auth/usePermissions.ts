import { useState, useEffect } from 'react';
import { useAuth } from './useAuthContext';
import { getMyPermissions } from '@services/permissionService';
import type { UserPermissions } from '@services/permissionService';

/**
 * Hook para verificar permisos del usuario actual basado en la base de datos
 */
export const usePermissions = () => {
  const { auth } = useAuth();
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPermissions = async () => {
      if (!auth?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userPermissions = await getMyPermissions();
        setPermissions(userPermissions);
        setError(null);
      } catch (err) {
        console.error('Error al cargar permisos:', err);
        setError('Error al cargar permisos del usuario');
        setPermissions(null);
      } finally {
        setLoading(false);
      }
    };

    loadPermissions();
  }, [auth?.id]);

  /**
   * Verifica si el usuario tiene un permiso específico
   */
  const hasPermission = (section: keyof UserPermissions, permission: string): boolean => {
    if (!permissions || !permissions[section]) {
      return false;
    }

    const sectionPermissions = permissions[section] as Record<string, boolean>;
    return sectionPermissions[permission] === true;
  };

  /**
   * Verifica si el usuario puede ver el módulo de solicitudes
   */
  const canViewRequests = (): boolean => {
    if (loading || !permissions) return false;
    return hasPermission('requests', 'canView') || hasPermission('requests', 'canCreate');
  };

  /**
   * Verifica si el usuario puede aprobar solicitudes (Jefatura)
   */
  const canApproveRequests = (): boolean => {
    if (loading || !permissions) return false;
    return hasPermission('requests', 'canApprove');
  };

  /**
   * Verifica si el usuario puede ver todas las solicitudes (equipo)
   */
  const canViewAllRequests = (): boolean => {
    if (loading || !permissions) return false;
    return hasPermission('requests', 'canViewAll');
  };

  /**
   * Verifica si el usuario puede crear solicitudes
   */
  const canCreateRequests = (): boolean => {
    if (loading || !permissions) return false;
    return hasPermission('requests', 'canCreate');
  };

  /**
   * Verifica si el usuario puede gestionar usuarios
   */
  const canManageUsers = (): boolean => {
    if (loading || !permissions) return false;
    return hasPermission('users', 'canManage') || hasPermission('users', 'canCreate');
  };

  /**
   * Verifica si el usuario puede acceder al panel de administrador
   */
  const canAccessAdmin = (): boolean => {
    if (loading || !permissions) return false;
    return hasPermission('admin', 'canAccess');
  };

  /**
   * Verifica si el usuario puede ver usuarios
   */
  const canViewUsers = (): boolean => {
    if (loading || !permissions) return false;
    return hasPermission('users', 'canView') || hasPermission('users', 'canManage');
  };

  /**
   * Verifica si el usuario puede ver bodegas
   */
  const canViewWarehouses = (): boolean => {
    if (loading || !permissions) return false;
    return hasPermission('warehouses', 'canView');
  };

  /**
   * Verifica si el usuario puede ver EPP
   */
  const canViewEpp = (): boolean => {
    if (loading || !permissions) return false;
    return hasPermission('epp', 'canView');
  };

  /**
   * Verifica si el usuario puede ver reportes
   */
  const canViewReports = (): boolean => {
    if (loading || !permissions) return false;
    return hasPermission('reports', 'canView');
  };

  return {
    permissions,
    loading,
    error,
    hasPermission,
    canViewRequests,
    canApproveRequests,
    canViewAllRequests,
    canCreateRequests,
    canManageUsers,
    canAccessAdmin,
    canViewUsers,
    canViewWarehouses,
    canViewEpp,
    canViewReports,
    userRole: auth?.rol || null
  };
};

export default usePermissions;