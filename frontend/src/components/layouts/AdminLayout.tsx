import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './shared/Header';
import Navbar from './shared/admin/navbar';
import Aside from './shared/admin/aside';
import Footer from './shared/Footer';


export default function AdminLayout()
{
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div>
            <Header />
            <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <Aside sidebarOpen={sidebarOpen} />
            <div className='p-4 sm:ml-64 mt-14'>
            <Outlet />
             <Footer />
            </div>
                  {/* Las páginas hijas se renderizan aquí */}
           
        </div>
    );
}