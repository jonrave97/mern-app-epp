import API from './api';

/**
 * Obtener todos los usuarios con paginación y búsqueda
 * @param {number} page - Número de página
 * @param {number} limit - Elementos por página
 * @param {string} search - Término de búsqueda por nombre o email
 * @returns {Promise} Respuesta con usuarios, paginación y estadísticas
 */
export const getUsers = async (page = 1, limit = 10, search = '') => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search })
    });
    const response = await API.get(`/users?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

/**
 * Obtener usuarios con rol de Jefatura
 * @returns {Promise} Respuesta con usuarios de jefatura
 */
export const getJefaturaUsers = async () => {
  try {
    const response = await API.get(`/users?rol=Jefatura&limit=100`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener usuarios de jefatura:', error);
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

