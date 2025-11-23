import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '@services/authService';
import { useAuth } from './useAuthContext';

export const useLogin = () => {

  const [email, setEmail] = useState<string>(''); // Estado para el email recibido y actualizado
  const [password, setPassword] = useState<string>(''); // Estado para la contraseña recibida y actualizada
  const [loading, setLoading] = useState<boolean>(false); // Estado para indicar si la solicitud de login está en proceso
  const [error, setError] = useState<string | null>(null); // Estado para almacenar errores de login
  const [success, setSuccess] = useState<boolean>(false); // Estado para indicar si el login fue exitoso
  const [isBlocked, setIsBlocked] = useState<boolean>(false); // Estado para indicar si la cuenta está bloqueada
  const [remainingTime, setRemainingTime] = useState<number>(0); // Tiempo restante de bloqueo en segundos
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null); // Intentos restantes
  const navigate = useNavigate(); // Hook de React Router para navegación programática
  const { setAuth } = useAuth(); // Usar el contexto de autenticación

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Enviando login...');
      console.log('Email:', email, 'Contraseña:', password);

      if(!email || !password) {
        console.error('❌ Error: Email y contraseña son obligatorios');
        setError('Email y contraseña son obligatorios');
        setLoading(false);
        return; 
      }

      // Llamada al servicio de login
      // incluimos al email y password en la petición para autenticar al usuario
      const response = await loginUser(email, password);
      
      console.log('✅ Login exitoso:', response);
      setSuccess(true);
      
      // Guardar token en localStorage
      localStorage.setItem('token', response.token);
      
      // Actualizar el contexto de autenticación con los datos del usuario
      setAuth({
        id: response.id,
        email: response.email,
        name: response.name || response.email, // Si no viene name, usa email
        rol: response.rol, // Nota: en el backend es 'rol'
        createdAt: response.createdAt,
      });
      
      // Limpiar formulario
      setEmail('');
      setPassword('');

      // Redirigir al dashboard del admin
      navigate('/admin/dashboard');

    } catch (err: any) {
        // Manejo de errores
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      
      // Manejar diferentes tipos de error
      if (err.status === 429) {
        // Cuenta bloqueada
        setIsBlocked(true);
        setRemainingTime(err.remainingTime || 0);
        setAttemptsRemaining(null);
      } else if (err.status === 401) {
        // Credenciales incorrectas
        setIsBlocked(false);
        setRemainingTime(0);
        setAttemptsRemaining(err.attemptsRemaining || null);
      } else {
        // Error genérico
        setIsBlocked(false);
        setRemainingTime(0);
        setAttemptsRemaining(null);
      }
      
      // Actualizar estado de error
      setError(errorMessage);
      console.error('❌ Error:', errorMessage);
    } finally {
        // Siempre se ejecuta al final
        // independientemente de si hubo éxito o error
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    success,
    isBlocked,
    remainingTime,
    attemptsRemaining,
    handleLogin,
  };
};
