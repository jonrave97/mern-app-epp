import { useUsers } from '../../../hooks/useUsers';
import type { User } from '../../../types/user';

function UserListPage() {
  const { users, loading, error } = useUsers();

  if (loading) return <div className="p-4">Cargando usuarios...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 0 min-h-screen">
      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lista de Usuarios</h1>
        <p className="text-gray-600">Gestiona todos los usuarios del sistema</p>
      </div>

      {/* Mensajes de estado */}
      {loading && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg mb-4">
          ⏳ Cargando usuarios...
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
              <th className="px-6 py-4 text-left font-semibold">Nombre</th>
              <th className="px-6 py-4 text-left font-semibold">Email</th>
              <th className="px-6 py-4 text-left font-semibold">Rol</th>
              <th className="px-6 py-4 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No hay usuarios disponibles
                </td>
              </tr>
            ) : (
              users.map((user: User) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4 text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      {user.role || 'usuario'}
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

export default UserListPage;