import { useState } from 'react';
import { useUsers } from '@hooks/api/useUsers';
import { createUser, updateUser } from '@services/userService';
import { Modal } from '@components/shared/Modal';
import { ModalActions } from '@components/shared/ModalActions';
import { Pagination } from '@components/shared/Pagination';
import { UserForm } from '@components/forms/UserForm';
import { EditIcon, LockIcon } from '@components/icons';
import { usePageTitle } from '@hooks/page/usePageTitle';
import type { User } from '../../../types/user';

function UserListPage() {
  usePageTitle('Usuarios');
  const { users, loading, error, pagination, stats, currentPage, goToPage, nextPage, prevPage, refresh } = useUsers(1, 10);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isToggleStatusModalOpen, setIsToggleStatusModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (loading && users.length === 0) return <div className="p-4">Cargando usuarios...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  const handleCreateUser = async (data: { name: string; email: string; password?: string; rol?: string }) => {
    setActionError(null);
    try {
      await createUser(data as { name: string; email: string; password: string; rol?: string });
      setIsCreateModalOpen(false);
      await refresh();
      setSuccessMessage('Usuario creado exitosamente');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setActionError(err.response?.data?.message || 'Error al crear usuario');
    }
  };

  const handleUpdateUser = async (data: { name: string; email: string; password?: string; rol?: string }) => {
    if (!selectedUser) return;
    setActionError(null);
    try {
      await updateUser(selectedUser._id, data);
      setIsEditModalOpen(false);
      setSelectedUser(null);
      await refresh();
      setSuccessMessage('Usuario actualizado exitosamente');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setActionError(err.response?.data?.message || 'Error al actualizar usuario');
    }
  };

  const handleToggleUserStatus = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    setActionError(null);
    try {
      const newStatus = !selectedUser.disabled;
      await updateUser(selectedUser._id, { disabled: newStatus });
      setIsToggleStatusModalOpen(false);
      setSelectedUser(null);
      await refresh();
      setSuccessMessage(`Usuario ${newStatus ? 'desactivado' : 'activado'} exitosamente`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setActionError(err.response?.data?.message || 'Error al cambiar el estado del usuario');
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
    setActionError(null);
  };

  const openToggleStatusModal = (user: User) => {
    setSelectedUser(user);
    setIsToggleStatusModalOpen(true);
    setActionError(null);
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsToggleStatusModalOpen(false);
    setSelectedUser(null);
    setActionError(null);
  };

  const totalUsers = stats?.total || 0;
  const activeUsers = stats?.active || 0;
  const inactiveUsers = stats?.inactive || 0;

  return (
    <div className="p-6 min-h-screen">
      {/* Encabezado */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lista de Usuarios</h1>
          <p className="text-gray-600">Gestiona todos los usuarios del sistema</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition font-medium shadow-lg hover:shadow-xl cursor-pointer"
        >
          + Nuevo Usuario
        </button>
      </div>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Total de Usuarios</p>
              <h3 className="text-3xl font-bold text-gray-900">{totalUsers}</h3>
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
              <p className="text-gray-500 text-sm font-medium mb-1">Usuarios Activos</p>
              <h3 className="text-3xl font-bold text-gray-900">{activeUsers}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-danger">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Usuarios Inactivos</p>
              <h3 className="text-3xl font-bold text-gray-900">{inactiveUsers}</h3>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
          ✅ {successMessage}
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white shadow-2xl rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="px-6 py-4 text-left font-semibold">Nombre</th>
              <th className="px-6 py-4 text-left font-semibold">Email</th>
              <th className="px-6 py-4 text-left font-semibold">Rol</th>
              <th className="px-6 py-4 text-left font-semibold">Estado</th>
              <th className="px-6 py-4 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No hay usuarios disponibles
                </td>
              </tr>
            ) : (
              users.map((user: User) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4 text-gray-900 font-medium">{user.name}</td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      {user.rol || 'usuario'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      user.disabled 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.disabled ? 'Inactivo' : 'Activo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button 
                        onClick={() => openEditModal(user)}
                        className="text-gray-500 hover:text-gray-700 transition-colors p-1 hover:bg-gray-50 rounded cursor-pointer"
                        title="Editar usuario"
                      >
                        <EditIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => openToggleStatusModal(user)}
                        className={`transition-colors p-1 rounded cursor-pointer ${
                          user.disabled
                            ? 'text-green-600 hover:text-green-700 hover:bg-green-50'
                            : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                        }`}
                        title={user.disabled ? 'Activar usuario' : 'Desactivar usuario'}
                      >
                        <LockIcon className="w-5 h-5" isLocked={user.disabled} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de Paginación */}
      {pagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          hasNextPage={pagination.hasNextPage}
          hasPrevPage={pagination.hasPrevPage}
          onPageChange={goToPage}
          onNext={nextPage}
          onPrev={prevPage}
        />
      )}

      {/* Modal Crear Usuario */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={closeModals}
        title="Crear Nuevo Usuario"
        size="md"
      >
        {actionError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            ❌ {actionError}
          </div>
        )}
        <UserForm
          onSubmit={handleCreateUser}
          onCancel={closeModals}
        />
      </Modal>

      {/* Modal Editar Usuario */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeModals}
        title="Editar Usuario"
        size="md"
      >
        {actionError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            ❌ {actionError}
          </div>
        )}
        {selectedUser && (
          <UserForm
            onSubmit={handleUpdateUser}
            onCancel={closeModals}
            initialData={{
              name: selectedUser.name,
              email: selectedUser.email,
              rol: selectedUser.rol
            }}
            isEditing={true}
          />
        )}
      </Modal>

      {/* Modal Confirmar Cambio de Estado */}
      <Modal
        isOpen={isToggleStatusModalOpen}
        onClose={closeModals}
        title={selectedUser?.disabled ? 'Activar Usuario' : 'Desactivar Usuario'}
        size="sm"
      >
        {actionError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            ❌ {actionError}
          </div>
        )}
        {selectedUser && (
          <div>
            <p className="text-gray-700 mb-6">
              ¿Estás seguro de que deseas {selectedUser.disabled ? 'activar' : 'desactivar'} al usuario{' '}
              <span className="font-bold">{selectedUser.name}</span> ({selectedUser.email})?
            </p>
            {!selectedUser.disabled && (
              <p className="text-sm text-amber-600 mb-6">
                ⚠️ El usuario no podrá acceder al sistema pero sus datos se conservarán.
              </p>
            )}
            <ModalActions
              onCancel={closeModals}
              onConfirm={handleToggleUserStatus}
              confirmText={selectedUser.disabled ? 'Activar' : 'Desactivar'}
              isLoading={actionLoading}
              loadingText={selectedUser.disabled ? 'Activando...' : 'Desactivando...'}
              confirmVariant={selectedUser.disabled ? 'success' : 'danger'}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}

export default UserListPage;