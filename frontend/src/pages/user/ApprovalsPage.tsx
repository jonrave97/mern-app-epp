import { useState } from 'react';
import { useTeamRequests } from '@hooks/api/useRequests';
import { usePageTitle } from '@hooks/page/usePageTitle';
import { Pagination } from '@components/shared/Pagination';

/**
 * Página de aprobaciones pendientes para jefatura
 * Muestra las solicitudes de los miembros del equipo que requieren aprobación
 */
export default function ApprovalsPage() {
  usePageTitle('Aprobaciones Pendientes');
  const { requests, loading, error, pagination, approveRequest, rejectRequest, setPage, setFilters } = useTeamRequests();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<{ show: boolean; requestId: string | null }>({ 
    show: false, 
    requestId: null 
  });
  const [rejectObservation, setRejectObservation] = useState('');

  // Filtrar solo pendientes por defecto
  useState(() => {
    setFilters({ status: 'Pendiente' });
  });

  const handleApprove = async (requestId: string) => {
    if (!confirm('¿Estás seguro de aprobar esta solicitud?')) return;
    
    setActionLoading(requestId);
    try {
      await approveRequest(requestId);
      alert('Solicitud aprobada exitosamente');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al aprobar solicitud';
      alert(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectClick = (requestId: string) => {
    setRejectModal({ show: true, requestId });
    setRejectObservation('');
  };

  const handleRejectConfirm = async () => {
    if (!rejectModal.requestId) return;
    
    setActionLoading(rejectModal.requestId);
    try {
      await rejectRequest(rejectModal.requestId, rejectObservation);
      alert('Solicitud rechazada');
      setRejectModal({ show: false, requestId: null });
      setRejectObservation('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al rechazar solicitud';
      alert(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading && requests.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Cargando aprobaciones...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.status === 'Pendiente');

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Aprobaciones Pendientes</h1>
        <p className="text-gray-600">Gestiona las solicitudes de tu equipo</p>
      </div>

      {/* Stats Card */}
      <div className="bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-lg rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-amber-100 text-sm font-medium mb-1">Solicitudes Pendientes de Aprobación</p>
            <h3 className="text-4xl font-bold">{pendingRequests.length}</h3>
          </div>
          <div className="bg-white bg-opacity-20 p-4 rounded-full">
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Tabla de solicitudes */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {pendingRequests.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay aprobaciones pendientes</h3>
            <p className="mt-1 text-sm text-gray-500">Todas las solicitudes han sido procesadas</p>
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Empleado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Razón
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bodega
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    EPPs
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingRequests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{request.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{request.employee.name}</div>
                      <div className="text-sm text-gray-500">{request.employee.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.reason}
                      {request.special && (
                        <span className="ml-2 px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                          Especial
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.warehouse.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="max-w-xs">
                        {request.epps.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="text-xs">
                            {typeof item.epp === 'object' ? item.epp.name : ''} x{item.quantity}
                          </div>
                        ))}
                        {request.epps.length > 2 && (
                          <div className="text-xs text-gray-400">
                            +{request.epps.length - 2} más
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleApprove(request._id)}
                        disabled={actionLoading === request._id}
                        className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {actionLoading === request._id ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Procesando...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                            Aprobar
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleRejectClick(request._id)}
                        disabled={actionLoading === request._id}
                        className="inline-flex items-center px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                        Rechazar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Paginación */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={setPage}
                  totalItems={pagination.total}
                  itemsPerPage={pagination.limit}
                  hasNextPage={pagination.page < pagination.totalPages}
                  hasPrevPage={pagination.page > 1}
                  onNext={() => setPage(pagination.page + 1)}
                  onPrev={() => setPage(pagination.page - 1)}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de rechazo */}
      {rejectModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Rechazar Solicitud</h3>
            <p className="text-sm text-gray-600 mb-4">
              Opcionalmente, puedes agregar una observación sobre el motivo del rechazo:
            </p>
            <textarea
              value={rejectObservation}
              onChange={(e) => setRejectObservation(e.target.value)}
              placeholder="Motivo del rechazo (opcional)..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
              rows={4}
              maxLength={500}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setRejectModal({ show: false, requestId: null })}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={actionLoading !== null}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {actionLoading ? 'Procesando...' : 'Confirmar Rechazo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
