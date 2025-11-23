import { usePageTitle } from '@hooks/page/usePageTitle';
import { useEpps } from '@hooks/api/useEpps';
import { useModal } from '@hooks/modal/useModal';
import { useCrudActions } from '@hooks/crud/useCrudActions';
import { createEpp, updateEpp } from '@services/eppService';
import { Modal } from '@components/shared/Modal';
import { ModalActions } from '@components/shared/ModalActions';
import { Pagination } from '@components/shared/Pagination';
import { EppForm } from '@components/forms/EppForm';
import { EditIcon, SearchIcon, LockIcon } from '@components/icons';
import type { Epp } from '../../../types/epp';
import { useState } from 'react';

function EppListPage() {
  usePageTitle('EPPs');
  const { epps, loading, error, stats, pagination, currentPage, searchTerm, setSearchTerm, nextPage, prevPage, goToPage, refresh } = useEpps(1, 10);
  const createModal = useModal<Epp>();
  const editModal = useModal<Epp>();
  const toggleStatusModal = useModal<Epp>();
  const { actionError, successMessage, clearMessages, handleError, handleSuccess } = useCrudActions();
  const [actionLoading, setActionLoading] = useState(false);

  // Solo mostrar pantalla de carga completa en la primera carga
  const isInitialLoading = loading && epps.length === 0 && !searchTerm;
  
  if (isInitialLoading) return <div className="p-4">Cargando EPPs...</div>;
  if (error && epps.length === 0) return <div className="p-4 text-red-500">Error: {error}</div>;

  const handleCreateEpp = async (data: { code: string; name: string; price: number; category: string }) => {
    clearMessages();
    try {
      await createEpp(data);
      createModal.close();
      await refresh();
      handleSuccess('EPP creado exitosamente');
    } catch (error: unknown) {
      handleError(error, 'Error al crear EPP');
    }
  };

  const handleUpdateEpp = async (data: { code: string; name: string; price: number; category: string }) => {
    if (!editModal.selectedItem) return;
    clearMessages();
    try {
      await updateEpp(editModal.selectedItem._id, data);
      editModal.close();
      await refresh();
      handleSuccess('EPP actualizado exitosamente');
    } catch (error: unknown) {
      handleError(error, 'Error al actualizar EPP');
    }
  };

  const handleToggleEppStatus = async () => {
    if (!toggleStatusModal.selectedItem) return;
    setActionLoading(true);
    clearMessages();
    try {
      const newStatus = !toggleStatusModal.selectedItem.disabled;
      await updateEpp(toggleStatusModal.selectedItem._id, { disabled: newStatus });
      toggleStatusModal.close();
      await refresh();
      handleSuccess(`EPP ${newStatus ? 'desactivado' : 'activado'} exitosamente`);
    } catch (error: unknown) {
      handleError(error, 'Error al cambiar el estado del EPP');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Encabezado */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lista de EPPs</h1>
          <p className="text-gray-600">Gestiona todos los Equipos de Protección Personal</p>
        </div>
        <button
          onClick={() => createModal.open()}
          className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition font-medium shadow-lg hover:shadow-xl cursor-pointer"
        >
          + Nuevo EPP
        </button>
      </div>

      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
          ✅ {successMessage}
        </div>
      )}

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Total de EPPs</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats?.total || 0}</h3>
            </div>
            <div className="bg-primary-light p-3 rounded-full">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">EPPs Activos</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats?.active || 0}</h3>
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
              <p className="text-gray-500 text-sm font-medium mb-1">EPPs Inactivos</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats?.inactive || 0}</h3>
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
            placeholder="Buscar EPP por nombre, código o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Indicador de carga durante búsqueda */}
      {loading && searchTerm.trim() !== '' && (
        <div className="bg-orange-50 border border-orange-200 px-4 py-2 text-orange-700 text-sm rounded-lg my-4 flex items-center gap-2 animate-fade-in">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Buscando...
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white shadow-2xl rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="px-6 py-4 text-left font-semibold">Código</th>
              <th className="px-6 py-4 text-left font-semibold">Nombre</th>
              <th className="px-6 py-4 text-left font-semibold">Categoría</th>
              <th className="px-6 py-4 text-left font-semibold">Precio</th>
              <th className="px-6 py-4 text-left font-semibold">Estado</th>
              <th className="px-6 py-4 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {epps.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  {loading ? 'Buscando...' : searchTerm ? 'No se encontraron EPPs' : 'No hay EPPs disponibles'}
                </td>
              </tr>
            ) : (
              epps.map((epp: Epp) => (
                <tr
                  key={epp._id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4 text-gray-900 font-medium">{epp.code}</td>
                  <td className="px-6 py-4 text-gray-900">{epp.name}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                      {epp.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">${epp.price.toLocaleString('es-CL')}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      epp.disabled 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {epp.disabled ? 'Inactivo' : 'Activo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button 
                        onClick={() => editModal.open(epp)}
                        className="text-gray-500 hover:text-gray-700 transition-colors p-1 hover:bg-gray-50 rounded cursor-pointer"
                        title="Editar EPP"
                      >
                        <EditIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => toggleStatusModal.open(epp)}
                        className={`transition-colors p-1 rounded cursor-pointer ${
                          epp.disabled
                            ? 'text-green-600 hover:text-green-700 hover:bg-green-50'
                            : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                        }`}
                        title={epp.disabled ? 'Activar EPP' : 'Desactivar EPP'}
                      >
                        <LockIcon className="w-5 h-5" isLocked={epp.disabled} />
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

      {/* Modal Crear EPP */}
      <Modal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
        title="Crear Nuevo EPP"
        size="md"
      >
        {actionError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            ❌ {actionError}
          </div>
        )}
        <EppForm
          onSubmit={handleCreateEpp}
          onCancel={createModal.close}
        />
      </Modal>

      {/* Modal Editar EPP */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.close}
        title="Editar EPP"
        size="md"
      >
        {actionError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            ❌ {actionError}
          </div>
        )}
        {editModal.selectedItem && (
          <EppForm
            onSubmit={handleUpdateEpp}
            onCancel={editModal.close}
            initialData={{
              code: editModal.selectedItem.code,
              name: editModal.selectedItem.name,
              price: editModal.selectedItem.price,
              category: editModal.selectedItem.category
            }}
            isEditing={true}
          />
        )}
      </Modal>

      {/* Modal Confirmar Cambio de Estado */}
      <Modal
        isOpen={toggleStatusModal.isOpen}
        onClose={toggleStatusModal.close}
        title={toggleStatusModal.selectedItem?.disabled ? 'Activar EPP' : 'Desactivar EPP'}
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
              ¿Estás seguro de que deseas {toggleStatusModal.selectedItem.disabled ? 'activar' : 'desactivar'} el EPP{' '}
              <span className="font-bold">{toggleStatusModal.selectedItem.name}</span> ({toggleStatusModal.selectedItem.code})?
            </p>
            {!toggleStatusModal.selectedItem.disabled && (
              <p className="text-sm text-amber-600 mb-6">
                ⚠️ El EPP no estará disponible para asignación pero sus datos se conservarán.
              </p>
            )}
            <ModalActions
              onCancel={toggleStatusModal.close}
              onConfirm={handleToggleEppStatus}
              confirmText={toggleStatusModal.selectedItem.disabled ? 'Activar' : 'Desactivar'}
              isLoading={actionLoading}
              loadingText={toggleStatusModal.selectedItem.disabled ? 'Activando...' : 'Desactivando...'}
              confirmVariant={toggleStatusModal.selectedItem.disabled ? 'success' : 'danger'}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}

export default EppListPage;
