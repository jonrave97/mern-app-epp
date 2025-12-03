import { useState } from 'react';
import { useMyRequests } from '@hooks/api/useRequests';
import { usePageTitle } from '@hooks/page/usePageTitle';
import { Pagination } from '@components/shared/Pagination';

/**
 * Página de solicitudes del usuario
 * Muestra todas las solicitudes creadas por el usuario actual
 */
export default function RequestListPage() {
  usePageTitle('Mis Solicitudes');
  const { requests, loading, error, pagination, setPage, setFilters } = useMyRequests();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [reasonFilter, setReasonFilter] = useState<string>('');

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    if (status) {
      setFilters({ status: status as 'Pendiente' | 'Aprobado' | 'Entregado' | 'Rechazado' });
    } else {
      setFilters({ status: undefined });
    }
  };

  const handleReasonFilter = (reason: string) => {
    setReasonFilter(reason);
    if (reason) {
      setFilters({ reason: reason as 'Deterioro' | 'Reposición' | 'Nuevo Ingreso' | 'Otro' });
    } else {
      setFilters({ reason: undefined });
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      'Pendiente': 'bg-yellow-100 text-yellow-800',
      'Aprobado': 'bg-green-100 text-green-800',
      'Entregado': 'bg-blue-100 text-blue-800',
      'Rechazado': 'bg-red-100 text-red-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getStockBadge = (stock: string) => {
    const badges: Record<string, string> = {
      'Con Stock': 'bg-green-100 text-green-700',
      'Sin Stock': 'bg-red-100 text-red-700',
      'Parcial': 'bg-yellow-100 text-yellow-700',
    };
    return badges[stock] || 'bg-gray-100 text-gray-700';
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
        <div className="text-gray-500">Cargando solicitudes...</div>
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Solicitudes</h1>
        <p className="text-gray-600">Gestiona tus solicitudes de EPP</p>
      </div>

      {/* Filtros */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Todos</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Aprobado">Aprobado</option>
              <option value="Entregado">Entregado</option>
              <option value="Rechazado">Rechazado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Razón
            </label>
            <select
              value={reasonFilter}
              onChange={(e) => handleReasonFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Todas</option>
              <option value="Deterioro">Deterioro</option>
              <option value="Reposición">Reposición</option>
              <option value="Nuevo Ingreso">Nuevo Ingreso</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setStatusFilter('');
                setReasonFilter('');
                setFilters({});
              }}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow-md rounded-lg p-4 border-l-4 border-yellow-500">
          <p className="text-gray-600 text-sm">Pendientes</p>
          <p className="text-2xl font-bold text-gray-900">
            {requests.filter(r => r.status === 'Pendiente').length}
          </p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Aprobadas</p>
          <p className="text-2xl font-bold text-gray-900">
            {requests.filter(r => r.status === 'Aprobado').length}
          </p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Entregadas</p>
          <p className="text-2xl font-bold text-gray-900">
            {requests.filter(r => r.status === 'Entregado').length}
          </p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4 border-l-4 border-red-500">
          <p className="text-gray-600 text-sm">Rechazadas</p>
          <p className="text-2xl font-bold text-gray-900">
            {requests.filter(r => r.status === 'Rechazado').length}
          </p>
        </div>
      </div>

      {/* Tabla de solicitudes */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {requests.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay solicitudes</h3>
            <p className="mt-1 text-sm text-gray-500">Comienza creando una nueva solicitud de EPP</p>
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
                    Razón
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bodega
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    EPPs
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
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
                {requests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{request.code}
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStockBadge(request.stock)}`}>
                        {request.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-primary hover:text-primary-dark">
                        Ver
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
    </div>
  );
}
