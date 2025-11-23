import { usePageTitle } from '@hooks/page/usePageTitle';
import { usePositions } from '@hooks/api/usePositions';
import { useModal } from '@hooks/modal/useModal';
import { useCrudActions } from '@hooks/crud/useCrudActions';
import { createPosition, updatePosition } from '@services/positionService';
import { Modal } from '@components/shared/Modal';
import { Pagination } from '@components/shared/Pagination';
import { PositionForm } from '@components/forms/PositionForm';
import { EditIcon } from '@components/icons';
import type { Position } from '../../../types/position';
import type { Epp } from '../../../types/epp';

function PositionListPage() {
  usePageTitle('Posiciones');
  const { positions, loading, error, stats, pagination, currentPage, searchTerm, setSearchTerm, nextPage, prevPage, goToPage, refresh } = usePositions(1, 10);
  const createModal = useModal<Position>();
  const editModal = useModal<Position>();
  const { actionError, successMessage, clearMessages, handleError, handleSuccess } = useCrudActions();

  // Solo mostrar pantalla de carga completa en la primera carga
  const isInitialLoading = loading && positions.length === 0 && !searchTerm;
  
  if (isInitialLoading) return <div className="p-4">Cargando posiciones...</div>;
  if (error && positions.length === 0) return <div className="p-4 text-red-500">Error: {error}</div>;

  const handleCreatePosition = async (data: { name: string; epps: string[] }) => {
    clearMessages();
    try {
      await createPosition(data);
      createModal.close();
      await refresh();
      handleSuccess('Posición creada exitosamente');
    } catch (error: unknown) {
      handleError(error, 'Error al crear posición');
    }
  };

  const handleUpdatePosition = async (data: { name: string; epps: string[] }) => {
    if (!editModal.selectedItem) return;
    clearMessages();
    try {
      await updatePosition(editModal.selectedItem._id, data);
      editModal.close();
      await refresh();
      handleSuccess('Posición actualizada exitosamente');
    } catch (error: unknown) {
      handleError(error, 'Error al actualizar posición');
    }
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Encabezado */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lista de Posiciones</h1>
          <p className="text-gray-600">Gestiona todas las posiciones y sus EPPs asignados</p>
        </div>
        <button
          onClick={() => createModal.open()}
          className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition font-medium shadow-lg hover:shadow-xl cursor-pointer"
        >
          + Nueva Posición
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
              <p className="text-gray-500 text-sm font-medium mb-1">Total de Posiciones</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats?.total || 0}</h3>
            </div>
            <div className="bg-primary-light p-3 rounded-full">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Posiciones Activas</p>
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
              <p className="text-gray-500 text-sm font-medium mb-1">Posiciones Inactivas</p>
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
        <input
          type="text"
          placeholder="Buscar posición por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
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
              <th className="px-6 py-4 text-left font-semibold">Nombre</th>
              <th className="px-6 py-4 text-left font-semibold">EPPs Asignados</th>
              <th className="px-6 py-4 text-left font-semibold">Estado</th>
              <th className="px-6 py-4 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {positions.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  {loading ? 'Buscando...' : searchTerm ? 'No se encontraron posiciones' : 'No hay posiciones disponibles'}
                </td>
              </tr>
            ) : (
              positions.map((position: Position) => (
                <tr
                  key={position._id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4 text-gray-900 font-medium">{position.name}</td>
                  <td className="px-6 py-4">
                    {position.epps.length === 0 ? (
                      <span className="text-gray-400">Sin EPPs asignados</span>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-gray-700">
                          {position.epps.length} EPP{position.epps.length !== 1 ? 's' : ''}
                        </span>
                        {position.epps.some((epp: Epp) => epp.disabled) && (
                          <span className="text-xs text-amber-600 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Incluye EPPs inactivos
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      position.disabled 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {position.disabled ? 'Inactiva' : 'Activa'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button 
                        onClick={() => editModal.open(position)}
                        className="text-gray-500 hover:text-gray-700 transition-colors p-1 hover:bg-gray-50 rounded cursor-pointer"
                        title="Editar posición"
                      >
                        <EditIcon className="w-5 h-5" />
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

      {/* Modal Crear Posición */}
      <Modal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
        title="Crear Nueva Posición"
        size="lg"
      >
        {actionError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            ❌ {actionError}
          </div>
        )}
        <PositionForm
          onSubmit={handleCreatePosition}
          onCancel={createModal.close}
        />
      </Modal>

      {/* Modal Editar Posición */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.close}
        title="Editar Posición"
        size="lg"
      >
        {actionError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            ❌ {actionError}
          </div>
        )}
        {editModal.selectedItem && (
          <PositionForm
            onSubmit={handleUpdatePosition}
            onCancel={editModal.close}
            initialData={{
              name: editModal.selectedItem.name,
              epps: editModal.selectedItem.epps.map(epp => epp._id)
            }}
            isEditing={true}
          />
        )}
      </Modal>
    </div>
  );
}

export default PositionListPage;
