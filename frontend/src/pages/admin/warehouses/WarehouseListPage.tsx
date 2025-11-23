import { useState } from 'react';
import { useWarehouses } from '@hooks/api/useWarehouses';
import { createWarehouse, updateWarehouse } from '@services/warehouseService';
import { useModal } from '@hooks/modal/useModal';
import { useCrudActions } from '@hooks/crud/useCrudActions';
import { Modal } from '@components/shared/Modal';
import { ModalActions } from '@components/shared/ModalActions';
import { Pagination } from '@components/shared/Pagination';
import { WarehouseForm } from '@components/forms/WarehouseForm';
import { EditIcon, LockIcon } from '@components/icons';
import { usePageTitle } from '@hooks/page/usePageTitle';
import type { Warehouses } from '../../../types/warehouses';

function WarehouseListPage() {
  usePageTitle('Bodegas');
  const { warehouses, loading, error, pagination, stats, currentPage, searchTerm, setSearchTerm, goToPage, nextPage, prevPage, refresh } = useWarehouses(1, 10);
  const createModal = useModal<Warehouses>();
  const editModal = useModal<Warehouses>();
  const toggleStatusModal = useModal<Warehouses>();
  const { actionError, successMessage, clearMessages, handleError, handleSuccess } = useCrudActions();
  const [actionLoading, setActionLoading] = useState(false);

  const isInitialLoading = loading && warehouses.length === 0 && !searchTerm;

  if (isInitialLoading) return <div className="p-4">Cargando bodegas...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  const handleCreateWarehouse = async (data: { code: string; name: string }) => {
    clearMessages();
    try {
      await createWarehouse(data);
      createModal.close();
      await refresh();
      handleSuccess('Bodega creada exitosamente');
    } catch (error: unknown) {
      handleError(error, 'Error al crear bodega');
    }
  };

  const handleUpdateWarehouse = async (data: { code: string; name: string }) => {
    if (!editModal.selectedItem) return;
    clearMessages();
    try {
      await updateWarehouse(editModal.selectedItem._id, data);
      editModal.close();
      await refresh();
      handleSuccess('Bodega actualizada exitosamente');
    } catch (error: unknown) {
      handleError(error, 'Error al actualizar bodega');
    }
  };

  const handleToggleWarehouseStatus = async () => {
    if (!toggleStatusModal.selectedItem) return;
    setActionLoading(true);
    clearMessages();
    try {
      const newStatus = !toggleStatusModal.selectedItem.disabled;
      await updateWarehouse(toggleStatusModal.selectedItem._id, { disabled: newStatus });
      toggleStatusModal.close();
      await refresh();
      handleSuccess(`Bodega ${newStatus ? 'desactivada' : 'activada'} exitosamente`);
    } catch (error: unknown) {
      handleError(error, 'Error al cambiar el estado de la bodega');
    } finally {
      setActionLoading(false);
    }
  };

  const totalWarehouses = stats?.total || 0;
  const activeWarehouses = stats?.active || 0;
  const inactiveWarehouses = stats?.inactive || 0;

  return (
    <div className="p-6 min-h-screen">
      {/* Encabezado */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lista de Bodegas</h1>
          <p className="text-gray-600">Gestiona todas las bodegas del sistema</p>
        </div>
        <button
          onClick={() => createModal.open()}
          className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition font-medium shadow-lg hover:shadow-xl cursor-pointer"
        >
          + Nueva Bodega
        </button>
      </div>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Total de Bodegas</p>
              <h3 className="text-3xl font-bold text-gray-900">{totalWarehouses}</h3>
            </div>
            <div className="bg-primary-light p-3 rounded-full">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Bodegas Activas</p>
              <h3 className="text-3xl font-bold text-gray-900">{activeWarehouses}</h3>
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
              <p className="text-gray-500 text-sm font-medium mb-1">Bodegas Inactivas</p>
              <h3 className="text-3xl font-bold text-gray-900">{inactiveWarehouses}</h3>
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
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Buscar por nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
              <th className="px-6 py-4 text-left font-semibold">Código</th>
              <th className="px-6 py-4 text-left font-semibold">Nombre</th>
              <th className="px-6 py-4 text-left font-semibold">Estado</th>
              <th className="px-6 py-4 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No hay bodegas disponibles
                </td>
              </tr>
            ) : (
              warehouses.map((warehouse: Warehouses) => (
                <tr
                  key={warehouse._id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4 text-gray-900 font-medium">{warehouse.code}</td>
                  <td className="px-6 py-4 text-gray-900">{warehouse.name}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      warehouse.disabled 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {warehouse.disabled ? 'Inactiva' : 'Activa'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button 
                        onClick={() => editModal.open(warehouse)}
                        className="text-gray-500 hover:text-gray-700 transition-colors p-1 hover:bg-gray-50 rounded cursor-pointer"
                        title="Editar bodega"
                      >
                        <EditIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => toggleStatusModal.open(warehouse)}
                        className={`transition-colors p-1 rounded cursor-pointer ${
                          warehouse.disabled
                            ? 'text-green-600 hover:text-green-700 hover:bg-green-50'
                            : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                        }`}
                        title={warehouse.disabled ? 'Activar bodega' : 'Desactivar bodega'}
                      >
                        <LockIcon className="w-5 h-5" isLocked={warehouse.disabled} />
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

      {/* Modal Crear Bodega */}
      <Modal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
        title="Crear Nueva Bodega"
        size="md"
      >
        {actionError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            ❌ {actionError}
          </div>
        )}
        <WarehouseForm
          onSubmit={handleCreateWarehouse}
          onCancel={createModal.close}
        />
      </Modal>

      {/* Modal Editar Bodega */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.close}
        title="Editar Bodega"
        size="md"
      >
        {actionError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            ❌ {actionError}
          </div>
        )}
        {editModal.selectedItem && (
          <WarehouseForm
            onSubmit={handleUpdateWarehouse}
            onCancel={editModal.close}
            initialData={{
              code: editModal.selectedItem.code,
              name: editModal.selectedItem.name
            }}
            isEditing={true}
          />
        )}
      </Modal>

      {/* Modal Confirmar Cambio de Estado */}
      <Modal
        isOpen={toggleStatusModal.isOpen}
        onClose={toggleStatusModal.close}
        title={toggleStatusModal.selectedItem?.disabled ? 'Activar Bodega' : 'Desactivar Bodega'}
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
              ¿Estás seguro de que deseas {toggleStatusModal.selectedItem.disabled ? 'activar' : 'desactivar'} la bodega{' '}
              <span className="font-bold">{toggleStatusModal.selectedItem.name}</span> (
              {toggleStatusModal.selectedItem.code})?
            </p>
            {!toggleStatusModal.selectedItem.disabled && (
              <p className="text-sm text-amber-600 mb-6">
                ⚠️ La bodega quedará inactiva pero no se eliminará.
              </p>
            )}
            <ModalActions
              onCancel={toggleStatusModal.close}
              onConfirm={handleToggleWarehouseStatus}
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

export default WarehouseListPage;
