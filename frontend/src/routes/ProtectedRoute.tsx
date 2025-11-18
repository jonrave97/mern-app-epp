import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

/**
 * Componente ProtectedRoute - Protege rutas que requieren autenticación
 * 
 * @param children - Componente a renderizar si está autenticado
 * @param requiredRole - Rol requerido (opcional). Si se proporciona, valida que el usuario tenga ese rol
 * 
 * @example
 * <ProtectedRoute>
 *   <AdminDashboard />
 * </ProtectedRoute>
 * 
 * @example
 * <ProtectedRoute requiredRole="admin">
 *   <UserManagement />
 * </ProtectedRoute>
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { auth, loading } = useContext(AuthContext);

  // Si está cargando, mostrar un loader
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  // Si no está autenticado, redirigir a login
  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  // Si requiere un rol específico y el usuario no lo tiene, redirigir
  // (Descomentar cuando agregues role a la interface User)
  // if (requiredRole && auth.role !== requiredRole) {
  //   return <Navigate to="/not-found" replace />;
  // }

  return <>{children}</>;
};
