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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };
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
      {/* Encabezado */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Control de Permisos</h1>
          <p className="text-gray-600">Gestiona los permisos individuales de cada usuario en el sistema</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleMigration}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-medium shadow-lg hover:shadow-xl cursor-pointer"
          >
            Migrar Usuarios
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition font-medium shadow-lg hover:shadow-xl cursor-pointer"
          >
            Actualizar
          </button>
        </div>
      </div>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Total Usuarios</p>
              <h3 className="text-3xl font-bold text-gray-900">{users.length}</h3>
            </div>
            <div className="bg-primary-light p-3 rounded-full">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Con Permisos Personalizados</p>
              <h3 className="text-3xl font-bold text-gray-900">
                {users.filter(u => u.hasCustomPermissions).length}
              </h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Campo de búsqueda */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          ❌ {error}
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white shadow-2xl rounded-xl overflow-hidden border border-gray-300">
        <div className="px-6 py-4 bg-gray-50 text-gray-600 flex justify-between items-center border-b-2 border-gray-400 shadow-lg rounded-t-xl">
          <h2 className="text-lg  font-semibold">
            Usuarios ({filteredUsers.length})
          </h2>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">Elementos por página:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="px-3 py-1 bg-white text-gray-700 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
        
        <table className="w-full">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="px-6 py-4 text-left font-semibold">
                Usuario
              </th>
              <th className="px-6 py-4 text-left font-semibold">
                Rol
              </th>
              <th className="px-6 py-4 text-left font-semibold">
                Área
              </th>
              <th className="px-6 py-4 text-left font-semibold">
                Estado Permisos
              </th>
              <th className="px-6 py-4 text-left font-semibold">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length === 0 && filteredUsers.length > 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No hay usuarios en esta página
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No se encontraron usuarios
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-gray-900 font-medium">{user.name}</div>
                      <div className="text-gray-600 text-sm">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {user.rol}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {user.area || 'Sin asignar'}
                  </td>
                  <td className="px-6 py-4">
                    {user.hasCustomPermissions ? (
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Personalizados
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        Por defecto
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEditPermissions(user)}
                      className="text-gray-500 hover:text-gray-700 transition-colors p-1 hover:bg-gray-50 rounded cursor-pointer"
                      title="Editar permisos"
                    >
                      <EditIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        {/* Paginación */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between bg-white px-6 py-4 rounded-lg shadow">
            {/* Información de página */}
            <div className="text-sm text-gray-700">
              Mostrando página <span className="font-medium">{currentPage}</span> de{' '}
              <span className="font-medium">{totalPages}</span>
              {' '}({filteredUsers.length} {filteredUsers.length === 1 ? 'elemento' : 'elementos'} en total)
            </div>

            {/* Botones de navegación */}
            <div className="flex gap-2">
              {/* Botón Anterior */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  currentPage === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary-hover cursor-pointer'
                }`}
                aria-label="Página anterior"
              >
                ← Anterior
              </button>

              {/* Números de página */}
              <div className="flex gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 rounded-lg font-medium transition ${
                        currentPage === pageNum
                          ? 'bg-primary text-white hover:bg-primary-hover'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Botón Siguiente */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  currentPage === totalPages
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary-hover cursor-pointer'
                }`}
                aria-label="Página siguiente"
              >
                Siguiente →
              </button>
            </div>
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
          
          <ModalActions
            onCancel={() => setShowPermissionModal(false)}
            onConfirm={handleSavePermissions}
            cancelText="Cancelar"
            confirmText="Guardar Cambios"
            confirmVariant="success"
            isLoading={saving}
            loadingText="Guardando..."
          />
        </Modal>
      )}
    </div>
  );
};

export default PermissionPanel;