import { useState } from 'react';
import { useWarehouses } from '@hooks/api/useWarehouses';
import { createWarehouse, updateWarehouse } from '@services/warehouseService';
import { Modal } from '@components/shared/Modal';
import { ModalActions } from '@components/shared/ModalActions';
import { Pagination } from '@components/shared/Pagination';
import { WarehouseForm } from '@components/forms/WarehouseForm';
import { EditIcon, LockIcon } from '@components/icons';
import type { Warehouses } from '../../../types/warehouses';

function WarehouseListPage() {
  const { warehouses, loading, error, pagination, stats, currentPage, goToPage, nextPage, prevPage, refresh } = useWarehouses(1, 10);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouses | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (loading && warehouses.length === 0) return <div className="p-4">Cargando bodegas...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  const handleCreateWarehouse = async (data: { code: string; name: string }) => {
    setActionError(null);
    try {
      await createWarehouse(data);
      setIsCreateModalOpen(false);
      await refresh();
      setSuccessMessage('Bodega creada exitosamente');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setActionError(err.response?.data?.message || 'Error al crear bodega');
    }
  };

  const handleUpdateWarehouse = async (data: { code: string; name: string }) => {
    if (!selectedWarehouse) return;
    setActionError(null);
    try {
      await updateWarehouse(selectedWarehouse._id, data);
      setIsEditModalOpen(false);
      setSelectedWarehouse(null);
      await refresh(); //forza refresco de datos después de actualizar el almacén
      setSuccessMessage('Bodega actualizada exitosamente');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setActionError(err.response?.data?.message || 'Error al actualizar bodega');
    }
  };

  const handleToggleWarehouseStatus = async () => {
    if (!selectedWarehouse) return;
    setActionLoading(true);
    setActionError(null);
    try {
      const newStatus = !selectedWarehouse.disabled;
      await updateWarehouse(selectedWarehouse._id, { disabled: newStatus });
      setIsDeleteModalOpen(false);
      setSelectedWarehouse(null);
      await refresh(); // forzar refresco de datos después de cambiar el estado
      setSuccessMessage(`Bodega ${newStatus ? 'desactivada' : 'activada'} exitosamente`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setActionError(err.response?.data?.message || 'Error al cambiar el estado de la bodega');
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (warehouse: Warehouses) => {
    setSelectedWarehouse(warehouse);
    setIsEditModalOpen(true);
    setActionError(null);
  };

  const openToggleStatusModal = (warehouse: Warehouses) => {
    setSelectedWarehouse(warehouse);
    setIsDeleteModalOpen(true);
    setActionError(null);
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedWarehouse(null);
    setActionError(null);
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
          onClick={() => setIsCreateModalOpen(true)}
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
                        onClick={() => openEditModal(warehouse)}
                        className="text-gray-500 hover:text-gray-700 transition-colors p-1 hover:bg-gray-50 rounded cursor-pointer"
                        title="Editar bodega"
                      >
                        <EditIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => openToggleStatusModal(warehouse)}
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
        isOpen={isCreateModalOpen}
        onClose={closeModals}
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
          onCancel={closeModals}
        />
      </Modal>

      {/* Modal Editar Bodega */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeModals}
        title="Editar Bodega"
        size="md"
      >
        {actionError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            ❌ {actionError}
          </div>
        )}
        {selectedWarehouse && (
          <WarehouseForm
            onSubmit={handleUpdateWarehouse}
            onCancel={closeModals}
            initialData={{
              code: selectedWarehouse.code,
              name: selectedWarehouse.name
            }}
            isEditing={true}
          />
        )}
      </Modal>

      {/* Modal Confirmar Cambio de Estado */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeModals}
        title={selectedWarehouse?.disabled ? 'Activar Bodega' : 'Desactivar Bodega'}
        size="sm"
      >
        {actionError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            ❌ {actionError}
          </div>
        )}
        {selectedWarehouse && (
          <div>
            <p className="text-gray-700 mb-6">
              ¿Estás seguro de que deseas {selectedWarehouse.disabled ? 'activar' : 'desactivar'} la bodega{' '}
              <span className="font-bold">{selectedWarehouse.name}</span> (
              {selectedWarehouse.code})?
            </p>
            {!selectedWarehouse.disabled && (
              <p className="text-sm text-amber-600 mb-6">
                ⚠️ La bodega quedará inactiva pero no se eliminará.
              </p>
            )}
            <ModalActions
              onCancel={closeModals}
              onConfirm={handleToggleWarehouseStatus}
              confirmText={selectedWarehouse.disabled ? 'Activar' : 'Desactivar'}
              isLoading={actionLoading}
              loadingText={selectedWarehouse.disabled ? 'Activando...' : 'Desactivando...'}
              confirmVariant={selectedWarehouse.disabled ? 'success' : 'danger'}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}

export default WarehouseListPage;
