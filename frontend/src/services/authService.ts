import API from './api';

// Función para iniciar sesión de usuario
// Recibe email y password como parámetros
// Realiza una petición POST al endpoint /users/login
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await API.post('/users/login', { email, password });
    console.log('✅ Respuesta del servidor:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Error al login:', error);
    
    // Extraer mensaje específico del backend
    if (error.response && error.response.data && error.response.data.message) {
      const errorData = error.response.data;
      const customError = new Error(errorData.message) as any;
      
      // Agregar datos adicionales del backend
      customError.status = error.response.status;
      customError.isBlocked = errorData.isBlocked || false;
      customError.remainingTime = errorData.remainingTime || 0;
      customError.attemptsRemaining = errorData.attemptsRemaining;
      customError.attempts = errorData.attempts;
      
      throw customError;
    }
    
    // Error genérico si no hay mensaje específico
    throw new Error('Error de conexión. Intenta nuevamente.');
  }
};
