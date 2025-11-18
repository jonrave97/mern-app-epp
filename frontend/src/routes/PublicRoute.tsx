import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * Componente PublicRoute - Permite acceso solo si NO está autenticado
 * Si ya está autenticado, redirige a la página de inicio
 * 
 * @param children - Componente a renderizar si NO está autenticado
 * 
 * @example
 * <PublicRoute>
 *   <LoginPage />
 * </PublicRoute>
 */
export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { auth, loading } = useContext(AuthContext);

  // Si está cargando, mostrar un loader
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  // Si ya está autenticado, redirigir a inicio
  if (auth) {
    console.log('🔄 PublicRoute: Usuario ya autenticado, redirigiendo a /');
    return <Navigate to="/" replace />;
  }

  console.log('✅ PublicRoute: Acceso permitido a ruta pública');
  return <>{children}</>;
};
