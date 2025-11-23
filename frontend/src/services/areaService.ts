import api from './api';
import type { Area } from '../types/area';

/**
 * Obtiene una lista paginada de áreas desde el backend
 * @param page - Número de página (por defecto 1)
 * @param limit - Cantidad de áreas por página (por defecto 100)
 * @returns Promesa con los datos de áreas, paginación y estadísticas
 */
export const getAreas = async (page = 1, limit = 100) => {
  try {
    const response = await api.get(`/areas/all?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener áreas:', error);
    throw error;
  }
};

/**
 * Crea una nueva área en el sistema
 * @param areaData - Datos del área (name, costCenter requeridos, disabled opcional)
 * @returns Promesa con el área creada
 * @example
 * createArea({ name: 'Operaciones', costCenter: '1001' })
 * createArea({ name: 'Administración', costCenter: '1002', disabled: false })
 */
export const createArea = async (areaData: Partial<Omit<Area, '_id' | 'createdAt' | 'updatedAt'>> & { name: string; costCenter: string }) => {
  try {
    const response = await api.post('/areas/create', areaData);
    return response.data;
  } catch (error) {
    console.error('Error al crear área:', error);
    throw error;
  }
};

/**
 * Actualiza un área existente
 * @param id - ID del área a actualizar
 * @param areaData - Datos parciales a actualizar (name, costCenter y/o disabled)
 * @returns Promesa con el área actualizada
 * @example
 * updateArea('123abc', { name: 'Nuevo Nombre' })
 * updateArea('123abc', { costCenter: '2001' })
 * updateArea('123abc', { disabled: true })
 */
export const updateArea = async (id: string, areaData: Partial<Omit<Area, '_id' | 'createdAt' | 'updatedAt'>>) => {
  try {
    const response = await api.put(`/areas/update/${id}`, areaData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar área:', error);
    throw error;
  }
};

/**
 * @deprecated No se debe eliminar áreas, usar updateArea con disabled: true
 */
export const deleteArea = async (id: string) => {
  console.warn('deleteArea está deprecado. Usa updateArea con disabled: true');
  try {
    const response = await api.delete(`/areas/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar área:', error);
    throw error;
  }
};
