import API from './api';

// Obtener todos los usuarios con paginación
export const getUsers = async (page = 1, limit = 10) => {
  try {
    const response = await API.get(`/users?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

// Crear un nuevo usuario
export const createUser = async (userData: { name: string; email: string; password: string; rol?: string }) => {
  try {
    const response = await API.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
};

// Actualizar un usuario
export const updateUser = async (id: string, userData: Partial<{ name: string; email: string; rol: string; disabled: boolean }>) => {
  try {
    const response = await API.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
};

// Eliminar un usuario
export const deleteUser = async (id: string) => {
  try {
    const response = await API.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
};

