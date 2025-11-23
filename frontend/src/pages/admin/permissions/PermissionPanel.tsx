import React, { useState, useEffect } from 'react';
import permissionService, { UserWithPermissions } from '../../../services/permissionService';

const PermissionPanel: React.FC = () => {
  const [users, setUsers] = useState<UserWithPermissions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const usersData = await permissionService.getAllUsersWithPermissions();
        setUsers(usersData);
        setError(null);
      } catch (err) {
        console.error('Error loading users:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3">Cargando panel de permisos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Panel de Control de Permisos</h1>
        <div className="space-x-3">
          <button className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">
            Migrar Usuarios
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Actualizar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Usuarios */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Usuarios ({users.length})</h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {users.length > 0 ? (
                users.map(user => (
                  <div
                    key={user._id}
                    className="p-3 border-b cursor-pointer hover:bg-gray-50"
                  >
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">{user.rol}</span>
                      {user.hasCustomPermissions && (
                        <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                          Permisos personalizados
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-gray-500">
                  No se encontraron usuarios
                </div>
              )}
            </div>
          </div>
        }

        {/* Panel de Edición de Permisos */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg">Selecciona un usuario para ver y editar sus permisos</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionPanel;

export default PermissionPanel;