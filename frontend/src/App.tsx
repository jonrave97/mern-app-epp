import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { PublicRoute } from "./routes/PublicRoute";
import NotFoundPage from "./pages/common/NotFoundPage.tsx";
import LoginPage from "./pages/auth/LoginPage.tsx";
import AdminRoutes from "./routes/AdminRoutes.tsx"; // Rutas específicas para el área de administración
import ForgotPassword from "./pages/auth/ForgotPasswordPage.tsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Aquí podrían ir otros componentes comunes, como un header */}
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/admin/dashboard" replace />
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
          <Route path="/admin/*" element={<AdminRoutes />} />
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
  );
}
export default App;
