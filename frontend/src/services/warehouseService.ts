import API from './api';

// Obtener todas las bodegas con paginación
export const getWarehouses = async (page: number = 1, limit: number = 10) => {
  try {
    const response = await API.get('/warehouses/all', {
      params: { page, limit }
    });
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
