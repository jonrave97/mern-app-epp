import {Routes, Route} from 'react-router-dom';
import AdminLayout from '../components/layouts/AdminLayout.tsx';
// import AdminDashboardPage from '../pages/admin/AdminDashboard.tsx';
import UserCreatePage from '../pages/admin/users/UserCreatePage.tsx';
import UserListPage from '../pages/admin/users/UserListPage.tsx';

function AdminRoutes()
{
   return (
        <Routes>
            <Route path='/admin' element={<AdminLayout />}>
            {/* <Route path='/admin/index' element={<AdminDashboardPage />} /> */}
                <Route path='users/create' element={<UserCreatePage />} />
                <Route path='users' element={<UserListPage />} />
            </Route>
        </Routes>
    ) 
}

export default AdminRoutes;