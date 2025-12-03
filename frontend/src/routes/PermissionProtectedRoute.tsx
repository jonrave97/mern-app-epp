import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import usePermissions from '@hooks/auth/usePermissions';

interface PermissionProtectedRouteProps {
  children: ReactNode;
  requiredPermission: keyof ReturnType<typeof usePermissions>;
}

/**
 * Componente PermissionProtectedRoute - Protege rutas basándose en permisos
 * 
 * Si el usuario NO tiene el permiso requerido, redirige al dashboard
 * Si el usuario SÍ tiene el permiso, muestra el contenido
 * 
 * @example
 * <PermissionProtectedRoute requiredPermission="canViewWarehouses">
 *   <WarehouseListPage />
 * </PermissionProtectedRoute>
 */
export default function PermissionProtectedRoute({ 
  children, 
  requiredPermission 
}: PermissionProtectedRouteProps) {
  const permissions = usePermissions();
  
  // Mientras carga, no renderizar nada (evita flash de contenido)
  if (permissions.loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Verificar si el usuario tiene el permiso requerido
  const hasPermission = permissions[requiredPermission];
  
  // Si la función de permiso existe y retorna true, mostrar contenido
  if (typeof hasPermission === 'function' && hasPermission()) {
    return <>{children}</>;
  }
  
  // Si no tiene permiso, redirigir al dashboard
  return <Navigate to="/user/dashboard" replace />;
}
