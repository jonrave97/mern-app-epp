import API from './api';

// Obtener todas las bodegas
export const getWarehouses = async () => {
  try {
    const response = await API.get('/warehouses');
    return response.data;
  } catch (error) {
    console.error('Error al obtener bodegas:', error);
    throw error;
  }
};
