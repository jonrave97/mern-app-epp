import React, { useState, useEffect } from 'react';
import permissionService from '../../../services/permissionService';
import { usePageTitle } from '../../../hooks/page/usePageTitle';
import { Modal } from '../../../components/shared/Modal';
import { ModalActions } from '../../../components/shared/ModalActions';
import { EditIcon } from '../../../components/icons';

interface Permission {
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

interface UserPermissions {
  users: Permission;
  warehouses: Permission;
  epp: Permission;
  requests: Permission;
  reports: Permission;
  settings: Permission;
  admin: Permission;
}

interface UserWithPermissions {
  _id: string;
  name: string;
  email: string;
  rol: string;
  area?: string;
  costCenter?: string;
  permissions: UserPermissions | null;
  hasCustomPermissions: boolean;
}

interface PermissionStructure {
  [section: string]: {
    name: string;
    permissions: Array<{
      key: string;
      label: string;
    }>;
  };
}

const PermissionPanel: React.FC = () => {
  usePageTitle('Panel de Permisos');
  
  const [users, setUsers] = useState<UserWithPermissions[]>([]);
  const [structure, setStructure] = useState<PermissionStructure | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserWithPermissions | null>(null);
  const [editedPermissions, setEditedPermissions] = useState<UserPermissions | null>(null);
  const [saving, setSaving] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.rol.toLowerCase().includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Cargar usuarios y estructura de permisos
        const [usersData, structureData] = await Promise.all([
          permissionService.getAllUsersWithPermissions().catch(() => []),
          permissionService.getPermissionStructure().catch(() => ({}))
        ]);
        
        setUsers(usersData);
        setStructure(structureData);
        
        if (usersData.length === 0) {
          setError('No se pudieron cargar los usuarios. Verifica que el backend esté funcionando.');
        }
        
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleEditPermissions = (user: UserWithPermissions) => {
    setSelectedUser(user);
    // Cargar permisos actuales o crear estructura por defecto
    if (user.permissions) {
      setEditedPermissions(JSON.parse(JSON.stringify(user.permissions)));
    } else {
      // Permisos por defecto según el rol
      const defaultPermissions: UserPermissions = {
        users: {},
        warehouses: {},
        epp: { canView: true },
        requests: { canCreate: true, canView: true },
        reports: {},
        settings: {},
        admin: {}
      };
      
      if (user.rol === 'Administrador') {
        defaultPermissions.users = { canView: true, canCreate: true, canEdit: true, canDelete: true, canManage: true };
        defaultPermissions.warehouses = { canView: true, canCreate: true, canEdit: true, canDelete: true };
        defaultPermissions.epp = { canView: true, canCreate: true, canEdit: true, canDelete: true, canManage: true };
        defaultPermissions.requests = { canCreate: true, canView: true, canViewAll: true, canEdit: true, canApprove: true, canReject: true, canDelete: true };
        defaultPermissions.reports = { canView: true, canExport: true, canManage: true };
        defaultPermissions.settings = { canView: true, canEdit: true };
        defaultPermissions.admin = { canAccess: true, canManagePermissions: true };
      } else if (user.rol === 'Jefatura') {
        defaultPermissions.requests.canApprove = true;
        defaultPermissions.requests.canReject = true;
        defaultPermissions.requests.canViewAll = true;
      }
      
      setEditedPermissions(defaultPermissions);
    }
    setShowPermissionModal(true);
  };

  const handlePermissionChange = (section: keyof UserPermissions, permission: string, value: boolean) => {
    if (!editedPermissions) return;
    
    setEditedPermissions(prev => ({
      ...prev!,
      [section]: {
        ...prev![section],
        [permission]: value
      }
    }));
  };

  const handleSavePermissions = async () => {
    if (!selectedUser || !editedPermissions) return;

    try {
      setSaving(true);
      await permissionService.updateUserPermissions(selectedUser._id, editedPermissions);
      
      // Actualizar la lista local
      setUsers(prev => prev.map(user => 
        user._id === selectedUser._id 
          ? { ...user, permissions: editedPermissions, hasCustomPermissions: true }
          : user
      ));
      
      setShowPermissionModal(false);
      setSelectedUser(null);
      setEditedPermissions(null);
    } catch (err) {
      console.error('Error al guardar permisos:', err);
      alert('Error al guardar permisos');
    } finally {
      setSaving(false);
    }
  };

  const handleMigration = async () => {
    if (!confirm('¿Estás seguro de migrar permisos para todos los usuarios? Esta acción creará permisos por defecto.')) {
      return;
    }

    try {
      setLoading(true);
      await permissionService.migrateExistingUsers();
      // Recargar datos
      window.location.reload();
    } catch (err) {
      console.error('Error en migración:', err);
      alert('Error en migración');
    } finally {
      setLoading(false);
    }
  };

  if (loading && users.length === 0) {
    return <div className="p-4">Cargando panel de permisos...</div>;
  }

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Control de Permisos</h1>
        <p className="text-gray-600">Gestiona los permisos individuales de cada usuario en el sistema</p>
      </div>

      {/* Estadísticas y Acciones */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-4">
        <div className="flex items-center justify-between">
          <div className="flex space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{users.length}</div>
              <div className="text-sm text-gray-500">Total Usuarios</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {users.filter(u => u.hasCustomPermissions).length}
              </div>
              <div className="text-sm text-gray-500">Con Permisos Personalizados</div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleMigration}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
            >
              Migrar Usuarios
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Actualizar
            </button>
          </div>
        </div>
      </div>

      {/* Buscador */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por nombre, email o rol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Lista de Usuarios */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Usuarios ({filteredUsers.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Área
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado Permisos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {user.rol}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.area || 'Sin asignar'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.hasCustomPermissions ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Personalizados
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Por defecto
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditPermissions(user)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <EditIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron usuarios</p>
          </div>
        )}
      </div>

      {/* Modal de Permisos */}
      {showPermissionModal && selectedUser && editedPermissions && structure && (
        <Modal
          isOpen={showPermissionModal}
          onClose={() => setShowPermissionModal(false)}
          title={`Permisos para ${selectedUser.name}`}
          size="xl"
        >
          <div className="p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Rol: {selectedUser.rol} • Área: {selectedUser.area || 'Sin asignar'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-96 overflow-y-auto">
              {Object.entries(structure).map(([sectionKey, sectionData]) => (
                <div key={sectionKey} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">
                    {sectionData.name}
                  </h3>
                  <div className="space-y-2">
                    {sectionData.permissions.map(permission => (
                      <label key={permission.key} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editedPermissions[sectionKey as keyof UserPermissions]?.[permission.key as keyof Permission] || false}
                          onChange={(e) => handlePermissionChange(sectionKey as keyof UserPermissions, permission.key, e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">{permission.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <ModalActions>
            <button
              onClick={() => setShowPermissionModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              onClick={handleSavePermissions}
              disabled={saving}
              className={`px-6 py-2 text-white rounded-md transition-colors ${
                saving 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </ModalActions>
        </Modal>
      )}
    </div>
  );
};

export default PermissionPanel;