import { Link, useLocation } from 'react-router-dom';
import { usePermissions } from '@hooks/auth/usePermissions';

interface UserSidebarProps {
  sidebarOpen: boolean;
}

/**
 * Sidebar para usuarios comunes
 * Muestra opciones según los permisos y rol del usuario
 */
export default function UserSidebar({ sidebarOpen }: UserSidebarProps) {
  const location = useLocation();
  
  // Usar try-catch para manejar errores en el hook de permisos
  let canViewRequests = () => false;
  let canApproveRequests = () => false;
  let canViewAllRequests = () => false;
  let canViewUsers = () => false;
  let canViewWarehouses = () => false;
  let canViewEpp = () => false;
  let canViewReports = () => false;
  
  try {
    const permissions = usePermissions();
    canViewRequests = permissions.canViewRequests;
    canApproveRequests = permissions.canApproveRequests;
    canViewAllRequests = permissions.canViewAllRequests;
    canViewUsers = permissions.canViewUsers;
    canViewWarehouses = permissions.canViewWarehouses;
    canViewEpp = permissions.canViewEpp;
    canViewReports = permissions.canViewReports;
  } catch (error) {
    console.error('Error loading permissions in sidebar:', error);
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-full transition-transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } sm:translate-x-0`}
      aria-label="Sidebar"
    >
      <div className="h-full pt-4 overflow-y-auto bg-neutral-primary-soft border border-gray-300 shadow-2xl">
        <ul className="space-y-2 font-medium">
          <li className="px-3 pt-20"></li>
          
          {/* Dashboard */}
          <li>
            <Link
              to="/user/dashboard"
              className={`flex items-center p-2 rounded-lg group mx-3 ${
                isActive('/user/dashboard')
                  ? 'bg-primary text-white'
                  : 'text-heading hover:bg-neutral-secondary-medium'
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
              <span className="ms-3">Dashboard</span>
            </Link>
          </li>

          {/* Mis Solicitudes - Solo si tiene permiso */}
          {canViewRequests() && (
            <li>
              <Link
                to="/user/solicitudes"
                className={`flex items-center p-2 rounded-lg group mx-3 ${
                  isActive('/user/solicitudes')
                    ? 'bg-primary text-white'
                    : 'text-heading hover:bg-neutral-secondary-medium'
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="ms-3">Mis Solicitudes</span>
              </Link>
            </li>
          )}

          {/* Mi Inventario EPP */}
          <li>
            <Link
              to="/user/inventario"
              className={`flex items-center p-2 rounded-lg group mx-3 ${
                isActive('/user/inventario')
                  ? 'bg-primary text-white'
                  : 'text-heading hover:bg-neutral-secondary-medium'
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
              </svg>
              <span className="ms-3">Mi Inventario EPP</span>
            </Link>
          </li>

          {/* Módulos Administrativos - Solo si tiene permisos */}
          {(canViewUsers() || canViewWarehouses() || canViewEpp() || canViewReports()) && (
            <>
              <li className="pt-4 mt-4 space-y-2 border-t border-gray-300 mx-3">
                <span className="text-xs font-semibold text-gray-400 uppercase">
                  Gestión Administrativa
                </span>
              </li>

              {/* Gestión de Usuarios */}
              {canViewUsers() && (
                <li>
                  <Link
                    to="/user/usuarios"
                    className={`flex items-center p-2 rounded-lg group mx-3 ${
                      isActive('/user/usuarios')
                        ? 'bg-primary text-white'
                        : 'text-heading hover:bg-neutral-secondary-medium'
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                    </svg>
                    <span className="ms-3">Usuarios</span>
                  </Link>
                </li>
              )}

              {/* Gestión de Bodegas */}
              {canViewWarehouses() && (
                <li>
                  <Link
                    to="/user/bodegas"
                    className={`flex items-center p-2 rounded-lg group mx-3 ${
                      isActive('/user/bodegas')
                        ? 'bg-primary text-white'
                        : 'text-heading hover:bg-neutral-secondary-medium'
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                    </svg>
                    <span className="ms-3">Bodegas</span>
                  </Link>
                </li>
              )}

              {/* Gestión de EPP */}
              {canViewEpp() && (
                <li>
                  <Link
                    to="/user/epp"
                    className={`flex items-center p-2 rounded-lg group mx-3 ${
                      isActive('/user/epp')
                        ? 'bg-primary text-white'
                        : 'text-heading hover:bg-neutral-secondary-medium'
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
                    </svg>
                    <span className="ms-3">EPP</span>
                  </Link>
                </li>
              )}

              {/* Reportes */}
              {canViewReports() && (
                <li>
                  <Link
                    to="/user/reportes"
                    className={`flex items-center p-2 rounded-lg group mx-3 ${
                      isActive('/user/reportes')
                        ? 'bg-primary text-white'
                        : 'text-heading hover:bg-neutral-secondary-medium'
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
                    </svg>
                    <span className="ms-3">Reportes</span>
                  </Link>
                </li>
              )}
            </>
          )}

          {/* Mostrar opciones adicionales para Jefatura - Basado en permisos */}
          {(canViewAllRequests() || canApproveRequests()) && (
            <>
              <li className="pt-4 mt-4 space-y-2 border-t border-gray-300 mx-3">
                <span className="text-xs font-semibold text-gray-400 uppercase">
                  Gestión de Equipo
                </span>
              </li>
              
              {/* Mi Equipo - Solo si puede ver todas las solicitudes */}
              {canViewAllRequests() && (
                <li>
                  <Link
                    to="/user/equipo"
                    className={`flex items-center p-2 rounded-lg group mx-3 ${
                      isActive('/user/equipo')
                        ? 'bg-primary text-white'
                        : 'text-heading hover:bg-neutral-secondary-medium'
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                    </svg>
                    <span className="ms-3">Mi Equipo</span>
                  </Link>
                </li>
              )}
              
              {/* Aprobaciones - Solo si puede aprobar */}
              {canApproveRequests() && (
                <li>
                  <Link
                    to="/user/aprobaciones"
                    className={`flex items-center p-2 rounded-lg group mx-3 ${
                      isActive('/user/aprobaciones')
                        ? 'bg-primary text-white'
                        : 'text-heading hover:bg-neutral-secondary-medium'
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="ms-3">Aprobaciones Pendientes</span>
                  </Link>
                </li>
              )}
            </>
          )}
        </ul>
      </div>
    </aside>
  );
}
