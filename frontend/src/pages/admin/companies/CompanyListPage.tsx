import { usePageTitle } from '@hooks/page/usePageTitle';
import { useCompanies } from '@hooks/api/useCompanies';
import { useModal } from '@hooks/modal/useModal';
import { useCrudActions } from '@hooks/crud/useCrudActions';
import { createCompany, updateCompany } from '@services/companyService';
import { Modal } from '@components/shared/Modal';
import { CompanyForm } from '@components/forms/CompanyForm';
import { EditIcon } from '@components/icons';
import type { Company } from '../../../types/company';

function CompanyListPage() {
  usePageTitle('Empresas');
  const { companies, loading, error, stats, refresh } = useCompanies(1, 10);
  const createModal = useModal<Company>();
  const editModal = useModal<Company>();
  const { actionError, successMessage, clearMessages, handleError, handleSuccess } = useCrudActions();

  if (loading && companies.length === 0) return <div className="p-4">Cargando empresas...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  const handleCreateCompany = async (data: { name: string }) => {
    clearMessages();
    try {
      await createCompany(data);
      createModal.close();
      await refresh();
      handleSuccess('Empresa creada exitosamente');
    } catch (error: unknown) {
      handleError(error, 'Error al crear empresa');
    }
  };

  const handleUpdateCompany = async (data: { name: string }) => {
    if (!editModal.selectedItem) return;
    clearMessages();
    try {
      await updateCompany(editModal.selectedItem._id, data);
      editModal.close();
      await refresh();
      handleSuccess('Empresa actualizada exitosamente');
    } catch (error: unknown) {
      handleError(error, 'Error al actualizar empresa');
    }
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Encabezado */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lista de Empresas</h1>
          <p className="text-gray-600">Gestiona todas las empresas del sistema</p>
        </div>
        <button
          onClick={() => createModal.open()}
          className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition font-medium shadow-lg hover:shadow-xl cursor-pointer"
        >
          + Nueva Empresa
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
              <p className="text-gray-500 text-sm font-medium mb-1">Total de Empresas</p>
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
              <p className="text-gray-500 text-sm font-medium mb-1">Empresas Activas</p>
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
              <p className="text-gray-500 text-sm font-medium mb-1">Empresas Inactivas</p>
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
              <th className="px-6 py-4 text-left font-semibold">Estado</th>
              <th className="px-6 py-4 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {companies.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  No hay empresas disponibles
                </td>
              </tr>
            ) : (
              companies.map((company: Company) => (
                <tr
                  key={company._id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4 text-gray-900 font-medium">{company.name}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      company.disabled 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {company.disabled ? 'Inactiva' : 'Activa'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button 
                        onClick={() => editModal.open(company)}
                        className="text-gray-500 hover:text-gray-700 transition-colors p-1 hover:bg-gray-50 rounded cursor-pointer"
                        title="Editar empresa"
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

      {/* Modal Crear Empresa */}
      <Modal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
        title="Crear Nueva Empresa"
        size="md"
      >
        {actionError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            ❌ {actionError}
          </div>
        )}
        <CompanyForm
          onSubmit={handleCreateCompany}
          onCancel={createModal.close}
        />
      </Modal>

      {/* Modal Editar Empresa */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.close}
        title="Editar Empresa"
        size="md"
      >
        {actionError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            ❌ {actionError}
          </div>
        )}
        {editModal.selectedItem && (
          <CompanyForm
            onSubmit={handleUpdateCompany}
            onCancel={editModal.close}
            initialData={{
              name: editModal.selectedItem.name
            }}
            isEditing={true}
          />
        )}
      </Modal>
    </div>
  );
}

export default CompanyListPage;
