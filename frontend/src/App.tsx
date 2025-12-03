import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { PublicRoute } from "./routes/PublicRoute";
import NotFoundPage from "./pages/common/NotFoundPage.tsx";
import LoginPage from "./pages/auth/LoginPage.tsx";
import AdminRoutes from "./routes/AdminRoutes.tsx"; // Rutas específicas para el área de administración
import UserRoutes from "./routes/UserRoutes.tsx"; // Rutas específicas para usuarios comunes
import RoleBasedRoute from "./routes/RoleBasedRoute.tsx"; // Redirección basada en rol
import ForgotPassword from "./pages/auth/ForgotPasswordPage.tsx";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
        {/* Aquí podrían ir otros componentes comunes, como un header */}
        <Routes>
          {/* Ruta raíz - redirige según el rol del usuario */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <RoleBasedRoute />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          
          {/* Rutas de administrador */}
          <Route path="/admin/*" element={<AdminRoutes />} />
          
          {/* Rutas de usuario común */}
          <Route path="/user/*" element={<UserRoutes />} />
          
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />

          {/* En caso de que la ruta no exista muestra el 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
export default App;
