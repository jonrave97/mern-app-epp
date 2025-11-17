import {Routes, Route} from 'react-router-dom';
import AdminLayout from '../components/layouts/AdminLayout.tsx';
// import AdminDashboardPage from '../pages/admin/AdminDashboard.tsx';
import UserCreatePage from '../pages/admin/users/UserCreatePage.tsx';
import UserListPage from '../pages/admin/users/UserListPage.tsx';
import AdminDashboardPage  from '../pages/admin/AdminDashboardPage.tsx';

function AdminRoutes()
{
   return (
        <Routes>
            {/**Ya no se agrega /admin porque ya está en App.tsx */}
            <Route path='/' element={<AdminLayout />}>
            {/* <Route path='/admin/index' element={<AdminDashboardPage />} /> */}
                <Route path='dashboard' element={<AdminDashboardPage />} />
                <Route path='users/create' element={<UserCreatePage />} />
                <Route path='users' element={<UserListPage />} />
            </Route>
        </Routes>
    ) 
}

export default AdminRoutes;