import api from './api';
import type { Position } from '../types/position';

/**
 * Obtiene una lista paginada de posiciones desde el backend
 * @param page - Número de página (por defecto 1)
 * @param limit - Cantidad de posiciones por página (por defecto 100)
 * @param search - Término de búsqueda opcional para filtrar por nombre
 * @returns Promesa con los datos de posiciones, paginación y estadísticas
 */
export const getPositions = async (page = 1, limit = 100, search = '') => {
  try {
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
    const response = await api.get(`/positions?page=${page}&limit=${limit}${searchParam}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener posiciones:', error);
    throw error;
  }
};

/**
 * Crea una nueva posición en el sistema
 * @param positionData - Datos de la posición (name requerido, epps y disabled opcionales)
 * @returns Promesa con la posición creada
 * @example
 * createPosition({ name: 'Operador de Planta', epps: ['epp_id_1', 'epp_id_2'] })
 * createPosition({ name: 'Supervisor', disabled: false })
 */
export const createPosition = async (positionData: { name: string; epps?: string[]; disabled?: boolean }) => {
  try {
    const response = await api.post('/positions', positionData);
    return response.data;
  } catch (error) {
    console.error('Error al crear posición:', error);
    throw error;
  }
};

/**
 * Actualiza una posición existente
 * @param id - ID de la posición a actualizar
 * @param positionData - Datos parciales a actualizar (name, epps y/o disabled)
 * @returns Promesa con la posición actualizada
 * @example
 * updatePosition('123abc', { name: 'Nuevo Nombre' })
 * updatePosition('123abc', { epps: ['epp_id_3', 'epp_id_4'] })
 * updatePosition('123abc', { disabled: true })
 */
export const updatePosition = async (id: string, positionData: Partial<Omit<Position, '_id' | 'createdAt' | 'updatedAt' | 'epps'> & { epps?: string[] }>) => {
  try {
    const response = await api.put(`/positions/${id}`, positionData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar posición:', error);
    throw error;
  }
};

/**
 * @deprecated No se debe eliminar posiciones, usar updatePosition con disabled: true
 */
export const deletePosition = async (id: string) => {
  console.warn('deletePosition está deprecado. Usa updatePosition con disabled: true');
  try {
    const response = await api.delete(`/positions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar posición:', error);
    throw error;
  }
};
