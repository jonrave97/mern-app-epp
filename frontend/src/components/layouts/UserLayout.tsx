import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './shared/Header';
import UserNavbar from './shared/user/navbar';
import UserSidebar from './shared/user/sidebar';
import Footer from './shared/Footer';

/**
 * Layout para usuarios comunes (no administradores)
 * Incluye navegación simplificada y sidebar adaptado a permisos del usuario
 */
export default function UserLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div>
      <Header />
      <UserNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <UserSidebar sidebarOpen={sidebarOpen} />
      <div className="p-4 sm:ml-64 mt-14">
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}
