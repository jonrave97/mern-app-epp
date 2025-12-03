import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@hooks/auth/useAuthContext';

interface UserNavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

/**
 * Navbar para usuarios comunes
 * Versión adaptada del navbar de administrador
 */
export default function UserNavbar({ sidebarOpen, setSidebarOpen }: UserNavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { auth, logOut } = useAuth();

  // Función para alternar el estado del dropdown de usuario
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Función para alternar el estado del sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Cerrar el dropdown si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <nav className="fixed top-0 z-50 w-full bg-neutral-primary-soft bg-primary border-gray-300 shadow-lg">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <button
              onClick={toggleSidebar}
              type="button"
              className="sm:hidden text-heading bg-transparent box-border border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-base text-sm p-2 focus:outline-none"
            >
              <span className="sr-only">Abrir sidebar</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="M5 7h14M5 12h14M5 17h10"
                />
              </svg>
            </button>
            <a href="/user/dashboard" className="flex ms-10 md:me-24">
              <img
                src="/kaltire.png"
                className="h-6 me-3"
                alt="Kaltire Logo"
              />
            </a>
          </div>
          <div className="flex items-center">
            <div className="flex items-center ms-3 relative" ref={dropdownRef}>
              <div className="flex items-center">
                <span className="text-white text-sm font-medium">{auth?.rol || 'Usuario'}</span>
                <button
                  type="button"
                  onClick={toggleDropdown}
                  className="flex text-sm rounded-full cursor-pointer pl-3"
                  aria-expanded={dropdownOpen}
                >
                  <span className="sr-only">Abrir menú de usuario</span>
                  <img
                    className="w-full h-8 rounded-full"
                    src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                    alt="foto de usuario"
                  />
                </button>
              </div>
              <div
                className={`${
                  dropdownOpen ? '' : 'hidden'
                } absolute top-full right-0 mt-2 bg-neutral-primary-medium border border-gray-200 rounded-md shadow-2xl w-44 bg-gray-50`}
              >
                <div className="px-4 py-3 border-b border-default-medium" role="none">
                  <p className="text-sm font-medium text-heading" role="none">
                    {auth?.name || 'Usuario'}
                  </p>
                  <p className="text-sm text-body truncate" role="none">
                    {auth?.email || 'email@example.com'}
                  </p>
                </div>
                <ul className="py-1" role="none">
                  <li>
                    <a
                      href="/user/dashboard"
                      className="block px-4 py-2 text-sm text-heading hover:bg-neutral-secondary-medium"
                      role="menuitem"
                    >
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <button
                      onClick={logOut}
                      className="block w-full text-left px-4 py-2 text-sm text-heading hover:bg-neutral-secondary-medium"
                      role="menuitem"
                    >
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
