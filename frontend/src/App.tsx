import {BrowserRouter, Routes, Route} from 'react-router-dom';
import NotFoundPage from './pages/common/NotFoundPage.tsx';
import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/auth/LoginPage.tsx';
import AdminRoutes from './routes/AdminRoutes.tsx'; // Rutas específicas para el área de administración
import ForgotPassword from './pages/auth/ForgotPasswordPage.tsx';

function App() {
  return (
    <BrowserRouter>
      {/* Aquí podrían ir otros componentes comunes, como un header */}
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/admin/*' element={<AdminRoutes />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />

        {/* En caso de que la ruta no exista muestra el 404 */}
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
