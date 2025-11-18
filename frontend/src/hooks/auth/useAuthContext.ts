import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

/**
 * Hook personalizado para acceder al contexto de autenticación
 * 
 * @returns {AuthContextType} Objeto con auth, setAuth, loading y logOut
 * 
 * @example
 * const { auth, logOut, loading } = useAuth();
 * 
 * if (loading) return <p>Cargando...</p>;
 * if (!auth) return <p>No estás logueado</p>;
 * 
 * return <p>Bienvenido {auth.name}</p>;
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe ser usado dentro de un AuthProvider");
    }
    return context;
};
