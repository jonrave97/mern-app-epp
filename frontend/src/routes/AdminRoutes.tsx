import {Routes, Route} from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import AdminLayout from '@components/layouts/AdminLayout.tsx';
import UserCreatePage from '../pages/admin/users/UserCreatePage.tsx';
import UserListPage from '../pages/admin/users/UserListPage.tsx';
import AdminDashboardPage  from '../pages/admin/AdminDashboardPage.tsx';
import WarehouseListPage from '../pages/admin/warehouses/WarehouseListPage.tsx';
import CompanyListPage from '../pages/admin/companies/CompanyListPage.tsx';
import AreaListPage from '../pages/admin/areas/AreaListPage.tsx';
import PositionListPage from '../pages/admin/positions/PositionListPage.tsx';
import EppListPage from '../pages/admin/epps/EppListPage.tsx';
import CategoryListPage from '../pages/admin/categories/CategoryListPage.tsx';
import PermissionPanel from '../pages/admin/permissions/PermissionPanel.tsx';

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
                    <Route path='companies' element={<CompanyListPage />} />
                    <Route path='areas' element={<AreaListPage />} />
                    <Route path='positions' element={<PositionListPage />} />
                    <Route path='epps' element={<EppListPage />} />
                    <Route path='categories' element={<CategoryListPage />} />
                    <Route path='permissions' element={<PermissionPanel />} />
                </Route>
            </Routes>
        </ProtectedRoute>
    ) 
}

export default AdminRoutes;