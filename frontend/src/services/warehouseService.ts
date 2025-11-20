import API from './api';

// Obtener todas las bodegas
export const getWarehouses = async () => {
  try {
    const response = await API.get('/warehouses/all');
    // console.log('Bodegas obtenidas:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener bodegas:', error);
    throw error;
  }
};
