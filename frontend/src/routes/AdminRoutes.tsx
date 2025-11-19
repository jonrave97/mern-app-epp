import {Routes, Route} from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import AdminLayout from '../components/layouts/AdminLayout.tsx';
import UserCreatePage from '../pages/admin/users/UserCreatePage.tsx';
import UserListPage from '../pages/admin/users/UserListPage.tsx';
import AdminDashboardPage  from '../pages/admin/AdminDashboardPage.tsx';
import WarehouseListPage from '../pages/admin/warehouses/WarehouseListPage.tsx';

function AdminRoutes()
{
   return (
        <ProtectedRoute>
            <Routes>
                {/**Ya no se agrega /admin porque ya está en App.tsx */}
                <Route path='/' element={<AdminLayout />}>
                {/* <Route path='/admin/index' element={<AdminDashboardPage />} /> */}
                    <Route path='dashboard' element={<AdminDashboardPage />} />
                    <Route path='users' element={<UserListPage />} />
                    <Route path='users/create' element={<UserCreatePage />} />
                    <Route path='warehouses' element={<WarehouseListPage />} />
                </Route>
            </Routes>
        </ProtectedRoute>
    ) 
}

export default AdminRoutes;