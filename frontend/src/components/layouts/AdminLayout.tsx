import { Outlet } from 'react-router-dom';
import Header from './shared/Header';
import Navbar from './shared/admin/navbar';
import Aside from './shared/admin/aside';
import Footer from './shared/Footer';

export default function AdminLayout()
{
    return (
        <div>
            <Header />
            <Navbar />
            <Aside />
            <div className='p-4 sm:ml-64 mt-14'>
            <Outlet />
            </div>
                  {/* Las páginas hijas se renderizan aquí */}
            <Footer />
        </div>
    );
}