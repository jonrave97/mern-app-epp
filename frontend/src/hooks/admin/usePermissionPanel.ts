import { useState, useEffect } from 'react';
import permissionService, { UserWithPermissions, PermissionStructure, UserPermissions } from '../../services/permissionService';

interface UsePermissionPanelResult {
  users: UserWithPermissions[];
  structure: PermissionStructure | null;
  loading: boolean;
  error: string | null;
  selectedUser: UserWithPermissions | null;
  selectedUserPermissions: UserPermissions | null;
  loadingUserPermissions: boolean;
  
  // Actions
  selectUser: (user: UserWithPermissions) => void;
  updateUserPermissions: (userId: string, permissions: UserPermissions) => Promise<void>;
  refreshUsers: () => Promise<void>;
  migrateUsers: () => Promise<void>;
}

export const usePermissionPanel = (): UsePermissionPanelResult => {
  const [users, setUsers] = useState<UserWithPermissions[]>([]);
  const [structure, setStructure] = useState<PermissionStructure | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedUser, setSelectedUser] = useState<UserWithPermissions | null>(null);
  const [selectedUserPermissions, setSelectedUserPermissions] = useState<UserPermissions | null>(null);
  const [loadingUserPermissions, setLoadingUserPermissions] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const usersData = await permissionService.getAllUsersWithPermissions();
      const structureData = await permissionService.getPermissionStructure();
      
      setUsers(usersData);
      setStructure(structureData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const selectUser = async (user: UserWithPermissions) => {
    try {
      setSelectedUser(user);
      setLoadingUserPermissions(true);
      
      if (user.hasCustomPermissions) {
        const permissions = await permissionService.getUserPermissions(user._id);
        setSelectedUserPermissions(permissions);
      } else {
        // Usuario sin permisos personalizados, usar permisos por defecto
        setSelectedUserPermissions(user.permissions);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar permisos del usuario');
    } finally {
      setLoadingUserPermissions(false);
    }
  };

  const updateUserPermissions = async (userId: string, permissions: UserPermissions) => {
    try {
      await permissionService.updateUserPermissions(userId, permissions);
      
      // Actualizar los permisos localmente
      setSelectedUserPermissions(permissions);
      
      // Actualizar la lista de usuarios
      setUsers(prev => prev.map(user => 
        user._id === userId 
          ? { ...user, permissions, hasCustomPermissions: true }
          : user
      ));
      
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al actualizar permisos');
    }
  };

  const refreshUsers = async () => {
    await loadInitialData();
  };

  const migrateUsers = async () => {
    try {
      setLoading(true);
      await permissionService.migrateExistingUsers();
      await loadInitialData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en migración');
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    structure,
    loading,
    error,
    selectedUser,
    selectedUserPermissions,
    loadingUserPermissions,
    
    selectUser,
    updateUserPermissions,
    refreshUsers,
    migrateUsers
  };
};

export default usePermissionPanel;