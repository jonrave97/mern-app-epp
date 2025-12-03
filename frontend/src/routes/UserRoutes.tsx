import { Routes, Route, Navigate } from 'react-router-dom';
import UserLayout from '@components/layouts/UserLayout';
import UserDashboardPage from '@pages/user/UserDashboardPage';
import RequestListPage from '@pages/user/RequestListPage';
import TeamPage from '@pages/user/TeamPage';
import ApprovalsPage from '@pages/user/ApprovalsPage';
import WarehouseListPage from '@pages/admin/warehouses/WarehouseListPage';
import UserListPage from '@pages/admin/users/UserListPage';
import PermissionProtectedRoute from './PermissionProtectedRoute';

/**
 * Rutas para usuarios comunes (no administradores)
 * Incluye dashboard, solicitudes, inventario y secciones de Jefatura
 * También incluye rutas administrativas protegidas por permisos
 */
export default function UserRoutes() {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<UserDashboardPage />} />
        
        {/* Solicitudes */}
        <Route path="solicitudes" element={<RequestListPage />} />
        
        {/* Inventario - Placeholder */}
        <Route path="inventario" element={<div className="p-6">Mi Inventario EPP - En desarrollo</div>} />
        
        {/* Secciones de Jefatura */}
        <Route path="equipo" element={<TeamPage />} />
        <Route path="aprobaciones" element={<ApprovalsPage />} />
        
        {/* Módulos Administrativos protegidos por permisos */}
        <Route 
          path="usuarios" 
          element={
            <PermissionProtectedRoute requiredPermission="canViewUsers">
              <UserListPage />
            </PermissionProtectedRoute>
          } 
        />
        <Route 
          path="bodegas" 
          element={
            <PermissionProtectedRoute requiredPermission="canViewWarehouses">
              <WarehouseListPage />
            </PermissionProtectedRoute>
          } 
        />
        <Route 
          path="epp" 
          element={
            <PermissionProtectedRoute requiredPermission="canViewEpp">
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Gestión de EPP</h1>
                <p className="text-gray-600">Módulo en desarrollo</p>
              </div>
            </PermissionProtectedRoute>
          } 
        />
        <Route 
          path="reportes" 
          element={
            <PermissionProtectedRoute requiredPermission="canViewReports">
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Reportes</h1>
                <p className="text-gray-600">Módulo en desarrollo</p>
              </div>
            </PermissionProtectedRoute>
          } 
        />
        
        {/* Redirect any unknown routes to dashboard */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
}
