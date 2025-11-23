import { useState } from 'react';
import { usePageTitle } from '@hooks/page/usePageTitle';
import { useCategories } from '@hooks/api/useCategories';
import { useModal } from '@hooks/modal/useModal';
import { useCrudActions } from '@hooks/crud/useCrudActions';
import { createCategory, updateCategory } from '@services/categoryService';
import { Modal } from '@components/shared/Modal';
import { ModalActions } from '@components/shared/ModalActions';
import { Pagination } from '@components/shared/Pagination';
import { CategoryForm } from '@components/forms/CategoryForm';
import { EditIcon, SearchIcon, LockIcon } from '@components/icons';
import type { Category } from '../../../types/category';

function CategoryListPage() {
  usePageTitle('Categorías');
  const { categories, loading, error, stats, pagination, currentPage, searchTerm, setSearchTerm, nextPage, prevPage, goToPage, refresh } = useCategories(1, 10);
  const createModal = useModal<Category>();
  const editModal = useModal<Category>();
  const toggleStatusModal = useModal<Category>();
  const { actionError, successMessage, clearMessages, handleError, handleSuccess } = useCrudActions();
  const [actionLoading, setActionLoading] = useState(false);

  // Solo mostrar pantalla de carga completa en la primera carga
  const isInitialLoading = loading && categories.length === 0 && !searchTerm;
  
  if (isInitialLoading) return <div className="p-4">Cargando categorías...</div>;
  if (error && categories.length === 0) return <div className="p-4 text-red-500">Error: {error}</div>;

  const handleCreateCategory = async (data: { name: string; description: string }) => {
    clearMessages();
    try {
      await createCategory(data);
      createModal.close();
      await refresh();
      handleSuccess('Categoría creada exitosamente');
    } catch (error: unknown) {
      handleError(error, 'Error al crear categoría');
    }
  };

  const handleUpdateCategory = async (data: { name: string; description: string }) => {
    if (!editModal.selectedItem) return;
    clearMessages();
    try {
      await updateCategory(editModal.selectedItem._id, data);
      editModal.close();
      await refresh();
      handleSuccess('Categoría actualizada exitosamente');
    } catch (error: unknown) {
      handleError(error, 'Error al actualizar categoría');
    }
  };

  const handleToggleCategoryStatus = async () => {
    if (!toggleStatusModal.selectedItem) return;
    setActionLoading(true);
    clearMessages();
    try {
      const newStatus = !toggleStatusModal.selectedItem.disabled;
      await updateCategory(toggleStatusModal.selectedItem._id, { disabled: newStatus });
      toggleStatusModal.close();
      await refresh();
      handleSuccess(`Categoría ${newStatus ? 'desactivada' : 'activada'} exitosamente`);
    } catch (error: unknown) {
      handleError(error, 'Error al cambiar el estado de la categoría');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Encabezado */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lista de Categorías</h1>
          <p className="text-gray-600">Gestiona todas las categorías de EPPs</p>
        </div>
        <button
          onClick={() => createModal.open()}
          className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition font-medium shadow-lg hover:shadow-xl cursor-pointer"
        >
          + Nueva Categoría
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
              <p className="text-gray-500 text-sm font-medium mb-1">Total de Categorías</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats?.total || 0}</h3>
            </div>
            <div className="bg-primary-light p-3 rounded-full">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Categorías Activas</p>
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
              <p className="text-gray-500 text-sm font-medium mb-1">Categorías Inactivas</p>
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
            placeholder="Buscar categoría por nombre o descripción..."
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
              <th className="px-6 py-4 text-left font-semibold">Nombre</th>
              <th className="px-6 py-4 text-left font-semibold">Descripción</th>
              <th className="px-6 py-4 text-left font-semibold">Estado</th>
              <th className="px-6 py-4 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  {loading ? 'Buscando...' : searchTerm ? 'No se encontraron categorías' : 'No hay categorías disponibles'}
                </td>
              </tr>
            ) : (
              categories.map((category: Category) => (
                <tr
                  key={category._id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4 text-gray-900 font-medium">{category.name}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {category.description || <span className="text-gray-400 italic">Sin descripción</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      category.disabled 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {category.disabled ? 'Inactiva' : 'Activa'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button 
                        onClick={() => editModal.open(category)}
                        className="text-gray-500 hover:text-gray-700 transition-colors p-1 hover:bg-gray-50 rounded cursor-pointer"
                        title="Editar categoría"
                      >
                        <EditIcon className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => toggleStatusModal.open(category)}
                        className={`transition-colors p-1 rounded cursor-pointer ${
                          category.disabled
                            ? 'text-green-600 hover:text-green-700 hover:bg-green-50'
                            : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                        }`}
                        title={category.disabled ? 'Activar categoría' : 'Desactivar categoría'}
                      >
                        <LockIcon className="w-5 h-5" isLocked={category.disabled} />
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

      {/* Modal Crear Categoría */}
      <Modal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
        title="Crear Nueva Categoría"
        size="md"
      >
        {actionError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            ❌ {actionError}
          </div>
        )}
        <CategoryForm
          onSubmit={handleCreateCategory}
          onCancel={createModal.close}
        />
      </Modal>

      {/* Modal Editar Categoría */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.close}
        title="Editar Categoría"
        size="md"
      >
        {actionError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            ❌ {actionError}
          </div>
        )}
        {editModal.selectedItem && (
          <CategoryForm
            onSubmit={handleUpdateCategory}
            onCancel={editModal.close}
            initialData={{
              name: editModal.selectedItem.name,
              description: editModal.selectedItem.description || ''
            }}
            isEditing={true}
          />
        )}
      </Modal>

      {/* Modal Confirmar Cambio de Estado */}
      <Modal
        isOpen={toggleStatusModal.isOpen}
        onClose={toggleStatusModal.close}
        title={toggleStatusModal.selectedItem?.disabled ? 'Activar Categoría' : 'Desactivar Categoría'}
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
              ¿Estás seguro de que deseas {toggleStatusModal.selectedItem.disabled ? 'activar' : 'desactivar'} la categoría{' '}
              <span className="font-bold">{toggleStatusModal.selectedItem.name}</span>?
            </p>
            {!toggleStatusModal.selectedItem.disabled && (
              <p className="text-sm text-amber-600 mb-6">
                ⚠️ La categoría no estará disponible pero sus datos se conservarán.
              </p>
            )}
            <ModalActions
              onCancel={toggleStatusModal.close}
              onConfirm={handleToggleCategoryStatus}
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

export default CategoryListPage;
