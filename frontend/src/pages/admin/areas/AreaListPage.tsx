import { usePageTitle } from '@hooks/page/usePageTitle';
import { useAreas } from '@hooks/api/useAreas';
import { useModal } from '@hooks/modal/useModal';
import { useCrudActions } from '@hooks/crud/useCrudActions';
import { createArea, updateArea } from '@services/areaService';
import { Modal } from '@components/shared/Modal';
import { AreaForm } from '@components/forms/AreaForm';
import { EditIcon } from '@components/icons';
import type { Area } from '../../../types/area';

function AreaListPage() {
  usePageTitle('Áreas');
  const { areas, loading, error, stats, refresh } = useAreas(1, 10);
  const createModal = useModal<Area>();
  const editModal = useModal<Area>();
  const { actionError, successMessage, clearMessages, handleError, handleSuccess } = useCrudActions();

  if (loading && areas.length === 0) return <div className="p-4">Cargando áreas...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  const handleCreateArea = async (data: { name: string; costCenter: string }) => {
    clearMessages();
    try {
      await createArea(data);
      createModal.close();
      await refresh();
      handleSuccess('Área creada exitosamente');
    } catch (error: unknown) {
      handleError(error, 'Error al crear área');
    }
  };

  const handleUpdateArea = async (data: { name: string; costCenter: string }) => {
    if (!editModal.selectedItem) return;
    clearMessages();
    try {
      await updateArea(editModal.selectedItem._id, data);
      editModal.close();
      await refresh();
      handleSuccess('Área actualizada exitosamente');
    } catch (error: unknown) {
      handleError(error, 'Error al actualizar área');
    }
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Encabezado */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lista de Áreas</h1>
          <p className="text-gray-600">Gestiona todas las áreas del sistema</p>
        </div>
        <button
          onClick={() => createModal.open()}
          className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition font-medium shadow-lg hover:shadow-xl cursor-pointer"
        >
          + Nueva Área
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
              <p className="text-gray-500 text-sm font-medium mb-1">Total de Áreas</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats?.total || 0}</h3>
            </div>
            <div className="bg-primary-light p-3 rounded-full">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Áreas Activas</p>
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
              <p className="text-gray-500 text-sm font-medium mb-1">Áreas Inactivas</p>
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

      {/* Tabla */}
      <div className="bg-white shadow-2xl rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="px-6 py-4 text-left font-semibold">Nombre</th>
              <th className="px-6 py-4 text-left font-semibold">Centro de Costo</th>
              <th className="px-6 py-4 text-left font-semibold">Estado</th>
              <th className="px-6 py-4 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {areas.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No hay áreas disponibles
                </td>
              </tr>
            ) : (
              areas.map((area: Area) => (
                <tr
                  key={area._id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4 text-gray-900 font-medium">{area.name}</td>
                  <td className="px-6 py-4 text-gray-700">{area.costCenter}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      area.disabled 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {area.disabled ? 'Inactiva' : 'Activa'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button 
                        onClick={() => editModal.open(area)}
                        className="text-gray-500 hover:text-gray-700 transition-colors p-1 hover:bg-gray-50 rounded cursor-pointer"
                        title="Editar área"
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

      {/* Modal Crear Área */}
      <Modal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
        title="Crear Nueva Área"
        size="md"
      >
        {actionError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            ❌ {actionError}
          </div>
        )}
        <AreaForm
          onSubmit={handleCreateArea}
          onCancel={createModal.close}
        />
      </Modal>

      {/* Modal Editar Área */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.close}
        title="Editar Área"
        size="md"
      >
        {actionError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            ❌ {actionError}
          </div>
        )}
        {editModal.selectedItem && (
          <AreaForm
            onSubmit={handleUpdateArea}
            onCancel={editModal.close}
            initialData={{
              name: editModal.selectedItem.name,
              costCenter: editModal.selectedItem.costCenter
            }}
            isEditing={true}
          />
        )}
      </Modal>
    </div>
  );
}

export default AreaListPage;
