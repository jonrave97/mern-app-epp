import type { ReactNode } from "react";
import { createContext, useState, useEffect } from "react";
import API from "@services/api";

// Definición de la interfaz User utilizada en el contexto de autenticación
export interface User {
    id: string;
    email: string;
    name: string;
    rol?: string;
    createdAt?: string;
    updatedAt?: string;
}

// Definición de la interfaz para el contexto de autenticación
export interface AuthContextType {
    auth: User | null;
    setAuth: (user: User | null) => void;
    loading: boolean;
    logOut: () => void;
}

// Crear el contexto con un valor por defecto
const AuthContext = createContext<AuthContextType>({
    auth: null,
    setAuth: () => {},
    loading: true,
    logOut: () => {},
});

// Componente AuthProvider
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [auth, setAuth] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // useEffect para verificar si hay token guardado al cargar la app
    useEffect(() => {
        const authenticateUser = async () => {
            console.log('🔍 AuthProvider: Verificando si hay token en localStorage...');
            const token = localStorage.getItem("token");
            
            // Si no hay token, terminar el proceso de carga
            if (!token) {
                console.log('❌ AuthProvider: No hay token en localStorage');
                setLoading(false);
                return;
            }

            console.log('✅ AuthProvider: Token encontrado en localStorage');
            console.log('🔄 AuthProvider: Validando token con el servidor...');

            // Si hay token, verificar que sea válido con el servidor
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };

            try {
                const response = await API.get("/users/profile", config);
                console.log('✅ AuthProvider: Token válido. Usuario autenticado:', response.data.user);
                setAuth(response.data.user);
            } catch (error) {
                console.error("❌ AuthProvider: Error verificando token:", error);
                // Si el token es inválido, limpiar
                localStorage.removeItem("token");
                setAuth(null);
                console.log('🧹 AuthProvider: Token eliminado por ser inválido');
            } finally {
                setLoading(false);
            }
        };

        authenticateUser();
    }, []);

    // Función para cerrar sesión
    const logOut = () => {
        localStorage.removeItem("token");
        setAuth(null);
    };

    const value: AuthContextType = {
        auth,
        setAuth,
        loading,
        logOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;


