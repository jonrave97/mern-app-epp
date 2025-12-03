import { Navigate } from 'react-router-dom';
import { useAuth } from '@hooks/auth/useAuthContext';

/**
 * Componente que redirige a usuarios según su rol
 * - Administrador -> /admin/dashboard
 * - otros roles -> /user/dashboard
 */
export default function RoleBasedRoute() {
  const { auth } = useAuth();

  // Si es admin, redirigir al panel de administración
  if (auth?.rol === 'Administrador') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Todos los demás roles van al portal de usuario
  return <Navigate to="/user/dashboard" replace />;
}
