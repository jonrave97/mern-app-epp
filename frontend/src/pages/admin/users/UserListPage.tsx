import { useState, useEffect } from 'react';
import { useUsers } from '@hooks/api/useUsers';
import { createUser, updateUser, getJefaturaUsers } from '@services/userService';
import { useModal } from '@hooks/modal/useModal';
import { useCrudActions } from '@hooks/crud/useCrudActions';
import { Modal } from '@components/shared/Modal';
import { ModalActions } from '@components/shared/ModalActions';
import { Pagination } from '@components/shared/Pagination';
import { MultiCheckboxSelect } from '@components/shared/MultiCheckboxSelect';
import { UserForm } from '@components/forms/UserForm';
import { EditIcon, LockIcon, UserIcon , SearchIcon} from '@components/icons';
import { usePageTitle } from '@hooks/page/usePageTitle';
import type { User } from '../../../types/user';

function UserListPage() {
  usePageTitle('Usuarios');
  const { users, loading, error, pagination, stats, currentPage, searchTerm, setSearchTerm, goToPage, nextPage, prevPage, refresh } = useUsers(1, 10);
  const createModal = useModal<User>();
  const editModal = useModal<User>();
  const toggleStatusModal = useModal<User>();
  const bossesModal = useModal<User>();
  const { actionError, successMessage, clearMessages, handleError, handleSuccess } = useCrudActions();
  const [actionLoading, setActionLoading] = useState(false);
  const [jefaturaUsers, setJefaturaUsers] = useState<User[]>([]);
  const [loadingJefatura, setLoadingJefatura] = useState(false);
  const [selectedBosses, setSelectedBosses] = useState<string[]>([]);

  // Forzar actualización al montar el componente para asegurar datos frescos
  useEffect(() => {
    refresh();
    loadJefaturaUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cargar jefatura users
  const loadJefaturaUsers = async () => {
    try {
      setLoadingJefatura(true);
      const response = await getJefaturaUsers();
      if (response.users) {
        setJefaturaUsers(response.users.filter((user: User) => !user.disabled));
      }
    } catch (error) {
      console.error('Error al cargar jefatura users:', error);
    } finally {
      setLoadingJefatura(false);
    }
  };

  // Actualizar selectedBosses cuando se abre el modal
  useEffect(() => {
    if (bossesModal.isOpen && bossesModal.selectedItem) {
      console.log('Usuario seleccionado (desde modal):', bossesModal.selectedItem.bosses);
      // Extraer los IDs de los bosses del usuario
      const bossesIds = bossesModal.selectedItem.bosses?.map(b => {
        // boss puede ser un string (ID) o un objeto con _id y name
        // if (typeof b.boss === 'string') {
        //   return b.boss;
        // } else if (b.boss && typeof b.boss === 'object' && '_id' in b.boss) {
        //   return b.boss._id;
        // }
        if(typeof b === 'string') return b;
        if(b && typeof b === 'object'  && b._id) {
          // if (typeof b.boss === 'string') return b.boss;
          console.log('Objeto boss encontrado:', b); 
          return b._id;
      }
       return 'nada';
      });
      setSelectedBosses(bossesIds);
      console.log('Jefes actuales del usuario:', bossesIds);
    } else {
      // Limpiar cuando se cierra el modal
      setSelectedBosses([]);
    }
    
  }, [bossesModal.isOpen, bossesModal.selectedItem]);



  const isInitialLoading = loading && users.length === 0 && !searchTerm;

  if (isInitialLoading) return <div className="p-4">Cargando usuarios...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  const handleCreateUser = async (data: { name: string; email: string; password?: string; rol?: string; company?: string }) => {
    clearMessages();
    try {
      await createUser(data as { name: string; email: string; password: string; rol?: string; company?: string });
      createModal.close();
      await refresh();
      handleSuccess('Usuario creado exitosamente');
    } catch (error: unknown) {
      handleError(error, 'Error al crear usuario');
    }
  };

  const handleUpdateUser = async (data: { name: string; email: string; password?: string; rol?: string; company?: string }) => {
    if (!editModal.selectedItem) return;
    clearMessages();
    try {
      await updateUser(editModal.selectedItem._id, data);
      editModal.close();
      await refresh();
      handleSuccess('Usuario actualizado exitosamente');
    } catch (error: unknown) {
      handleError(error, 'Error al actualizar usuario');
    }
  };

  const handleToggleUserStatus = async () => {
    if (!toggleStatusModal.selectedItem) return;
    setActionLoading(true);
    clearMessages();
    try {
      const newStatus = !toggleStatusModal.selectedItem.disabled;
      await updateUser(toggleStatusModal.selectedItem._id, { disabled: newStatus });
      toggleStatusModal.close();
      await refresh();
      handleSuccess(`Usuario ${newStatus ? 'desactivado' : 'activado'} exitosamente`);
    } catch (error: unknown) {
      handleError(error, 'Error al cambiar el estado del usuario');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateBosses = async (bosses: string[]) => {
    if (!bossesModal.selectedItem) return;
    setActionLoading(true);
    clearMessages();
    try {
      
      await updateUser(bossesModal.selectedItem._id, { bosses });
      bossesModal.close();
      await refresh();
      handleSuccess('Jefes asignados exitosamente');
    } catch (error: unknown) {
      handleError(error, 'Error al actualizar jefes');
    } finally {
      setActionLoading(false);
    }
  };

  const totalUsers = stats?.total || 0;
  const activeUsers = stats?.active || 0;
  const inactiveUsers = stats?.inactive || 0;



  // console.log('🧑‍💼 Jefatura Users:', jefaturaUsers);
  // console.log('usuario seleccionado bossesModal:', );

  return (
    <div className="p-6 min-h-screen">
      {/* Encabezado */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lista de Usuarios</h1>
          <p className="text-gray-600">Gestiona todos los usuarios del sistema</p>
        </div>
        <button
          onClick={() => createModal.open()}
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
              <UserIcon />
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
          <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Indicador de búsqueda */}
      {loading && searchTerm.trim() !== '' && (
        <div className="bg-orange-50 border border-orange-200 px-4 py-2 text-orange-700 text-sm rounded-lg my-4 flex items-center gap-2 animate-fade-in">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Buscando...
        </div>
      )}

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
              <th className="px-6 py-4 text-left font-semibold">Área</th>
              <th className="px-6 py-4 text-left font-semibold">Estado</th>
              <th className="px-6 py-4 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No hay usuarios disponibles
                </td>
              </tr>
            ) : (
              users.map((user) => (
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
                  <td className="px-6 py-4 text-gray-600">
                    {user.area || 'Sin asignar'}
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
                        onClick={() => editModal.open(user)}
                        className="text-gray-500 hover:text-gray-700 transition-colors p-1 hover:bg-gray-50 rounded cursor-pointer"
                        title="Editar usuario"
                      >
                        <EditIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => {bossesModal.open(user); console.log('Usuario seleccionado para asignar jefes:', user);}}
                        className="text-blue-500 hover:text-blue-700 transition-colors p-1 hover:bg-blue-50 rounded cursor-pointer"
                        title="Asignar jefes"
                      >
                        👔
                      </button>
                      <button 
                        onClick={() => toggleStatusModal.open(user)}
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
        isOpen={createModal.isOpen}
        onClose={createModal.close}
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
          onCancel={createModal.close}
        />
      </Modal>

      {/* Modal Editar Usuario */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.close}
        title="Editar Usuario"
        size="md"
      >
        {actionError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            ❌ {actionError}
          </div>
        )}
        {editModal.selectedItem && (
          <UserForm
            onSubmit={handleUpdateUser}
            onCancel={editModal.close}
            initialData={{
              name: editModal.selectedItem.name,
              email: editModal.selectedItem.email,
              rol: editModal.selectedItem.rol,
              area: editModal.selectedItem.area,
              costCenter: editModal.selectedItem.costCenter,
              company: editModal.selectedItem.company
            }}
            isEditing={true}
          />
        )}
      </Modal>

      {/* Modal Confirmar Cambio de Estado */}
      <Modal
        isOpen={toggleStatusModal.isOpen}
        onClose={toggleStatusModal.close}
        title={toggleStatusModal.selectedItem?.disabled ? 'Activar Usuario' : 'Desactivar Usuario'}
        size="sm"
      >
        {actionError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            ❌ {actionError}
          </div>
        )}
        {toggleStatusModal.selectedItem && (
          <div>
            <p className="text-gray-700 mb-6">
              ¿Estás seguro de que deseas {toggleStatusModal.selectedItem.disabled ? 'activar' : 'desactivar'} al usuario{' '}
              <span className="font-bold">{toggleStatusModal.selectedItem.name}</span> ({toggleStatusModal.selectedItem.email})?
            </p>
            {!toggleStatusModal.selectedItem.disabled && (
              <p className="text-sm text-amber-600 mb-6">
                ⚠️ El usuario no podrá acceder al sistema pero sus datos se conservarán.
              </p>
            )}
            <ModalActions
              onCancel={toggleStatusModal.close}
              onConfirm={handleToggleUserStatus}
              confirmText={toggleStatusModal.selectedItem.disabled ? 'Activar' : 'Desactivar'}
              isLoading={actionLoading}
              loadingText={toggleStatusModal.selectedItem.disabled ? 'Activando...' : 'Desactivando...'}
              confirmVariant={toggleStatusModal.selectedItem.disabled ? 'success' : 'danger'}
            />
          </div>
        )}
      </Modal>

      {/* Modal Asignar Jefes */}
      <Modal
        isOpen={bossesModal.isOpen}
        onClose={bossesModal.close}
        title={`Asignar Jefes - ${bossesModal.selectedItem?.name}`}
        size="lg"
      >
        
        {actionError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            ❌ {actionError}
          </div>
        )}
        {bossesModal.selectedItem && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecciona los jefes para {bossesModal.selectedItem.name}
              </label>
            
              <MultiCheckboxSelect
                options={jefaturaUsers .map(u => ({
                  value: String(u._id).trim(),
                  label: u.name,
                  subtitle: u.email
                }))} 
                value={selectedBosses}
                onChange={setSelectedBosses}
                placeholder="Seleccionar jefes..."
                loading={loadingJefatura}
              />
            </div>
            <ModalActions
              onCancel={bossesModal.close}
              onConfirm={() => handleUpdateBosses(selectedBosses)}
              confirmText="Guardar Jefes"
              isLoading={actionLoading}
              loadingText="Guardando..."
            />
          </div>
        )}
      </Modal>
    </div>
  );
}

export default UserListPage;