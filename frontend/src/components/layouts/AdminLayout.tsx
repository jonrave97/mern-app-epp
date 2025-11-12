import { Outlet } from 'react-router-dom';
import Header from './shared/Header';
import Footer from './shared/Footer';

export default function AdminLayout()
{
    return (
        <div>
            <Header />
            <Outlet />      {/* Las páginas hijas se renderizan aquí */}
            <Footer />
        </div>
    );
}