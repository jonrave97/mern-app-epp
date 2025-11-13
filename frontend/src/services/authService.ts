import API from './api';

// Función para iniciar sesión de usuario
// Recibe email y password como parámetros
// Realiza una petición POST al endpoint /users/login
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await API.post('/users/login', { email, password });
    console.log('✅ Respuesta del servidor:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al login:', error);
    throw error;
  }
};
