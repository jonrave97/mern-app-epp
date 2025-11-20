import { useWarehouses } from '../../../hooks/api/useWarehouses';
import type { Warehouses } from '../../../types/warehouses';

function WarehouseListPage() {
  const { warehouses, loading, error } = useWarehouses();

  if (loading) return <div className="p-4">Cargando bodegas...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;


  return (
    <div className="p-6 min-h-screen">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lista de Bodegas</h1>
        <p className="text-gray-600">Gestiona todas las bodegas del sistema</p>
      </div>

      {/* Mensajes de estado */}
      {loading && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg mb-4">
          ⏳ Cargando bodegas...
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          ❌ Error: {error}
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white shadow-2xl rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-primary text-white">
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
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-sm transition">
                        Editar
                      </button>
                      <button className="text-red-600 hover:text-red-800 font-medium text-sm transition">
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WarehouseListPage;
