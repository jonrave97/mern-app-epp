import { useUsers } from '../../../hooks/useUsers';
import type { User } from '../../../types/user';

function UserListPage() {
  const { users, loading, error } = useUsers();

  if (loading) return <div className="p-4">Cargando usuarios...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Usuarios</h1>
      <table className="border-collapse border border-gray-400 w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Nombre</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: User) => (
            <tr key={user._id}>
              <td className="border border-gray-300 p-2">{user.name}</td>
              <td className="border border-gray-300 p-2">{user.email}</td>
              <td className="border border-gray-300 p-2">{user.role || 'usuario'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserListPage;