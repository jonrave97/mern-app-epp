import API from './api';

/**
 * Obtener todas las bodegas con paginación y búsqueda
 * @param {number} page - Número de página
 * @param {number} limit - Elementos por página
 * @param {string} search - Término de búsqueda por nombre o código
 * @returns {Promise} Respuesta con bodegas, paginación y estadísticas
 */
export const getWarehouses = async (page: number = 1, limit: number = 10, search: string = '') => {
  try {
    const params: { page: number; limit: number; search?: string } = { page, limit };
    if (search) {
      params.search = search;
    }
    const response = await API.get('/warehouses/all', { params });
    // console.log('Bodegas obtenidas:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener bodegas:', error);
    throw error;
  }
};

// Crear nueva bodega
export const createWarehouse = async (data: { code: string; name: string }) => {
  try {
    const response = await API.post('/warehouses/create', data);
    return response.data;
  } catch (error) {
    console.error('Error al crear bodega:', error);
    throw error;
  }
};

// Actualizar bodega
export const updateWarehouse = async (id: string, data: { code?: string; name?: string; disabled?: boolean }) => {
  try {
    const response = await API.put(`/warehouses/update/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar bodega:', error);
    throw error;
  }
};

// Eliminar bodega
export const deleteWarehouse = async (id: string) => {
  try {
    const response = await API.delete(`/warehouses/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar bodega:', error);
    throw error;
  }
};
