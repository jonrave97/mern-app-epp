import api from './api';
import type { Epp } from '../types/epp';

/**
 * Obtiene una lista paginada de EPPs desde el backend
 * @param page - Número de página (por defecto 1)
 * @param limit - Cantidad de EPPs por página (por defecto 100)
 * @param search - Término de búsqueda opcional para filtrar por nombre o código
 * @returns Promesa con los datos de EPPs, paginación y estadísticas
 */
export const getEpps = async (page = 1, limit = 100, search = '') => {
  try {
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
    const response = await api.get(`/epps?page=${page}&limit=${limit}${searchParam}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener EPPs:', error);
    throw error;
  }
};

/**
 * Crea un nuevo EPP en el sistema
 * @param eppData - Datos del EPP (code, name, price, category requeridos, disabled opcional)
 * @returns Promesa con el EPP creado
 * @example
 * createEpp({ code: 'CL_99_001', name: 'Casco de seguridad', price: 15000, category: 'CASCO' })
 */
export const createEpp = async (eppData: { code: string; name: string; price: number; category: string; disabled?: boolean }) => {
  try {
    const response = await api.post('/epps', eppData);
    return response.data;
  } catch (error) {
    console.error('Error al crear EPP:', error);
    throw error;
  }
};

/**
 * Actualiza un EPP existente
 * @param id - ID del EPP a actualizar
 * @param eppData - Datos parciales a actualizar (code, name, price, category y/o disabled)
 * @returns Promesa con el EPP actualizado
 * @example
 * updateEpp('123abc', { name: 'Nuevo Nombre' })
 * updateEpp('123abc', { price: 20000 })
 * updateEpp('123abc', { disabled: true })
 */
export const updateEpp = async (id: string, eppData: Partial<Omit<Epp, '_id' | 'createdAt' | 'updatedAt' | '__v'>>) => {
  try {
    const response = await api.put(`/epps/${id}`, eppData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar EPP:', error);
    throw error;
  }
};

/**
 * @deprecated No se debe eliminar EPPs, usar updateEpp con disabled: true
 */
export const deleteEpp = async (id: string) => {
  console.warn('deleteEpp está deprecado. Usa updateEpp con disabled: true');
  try {
    const response = await api.delete(`/epps/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar EPP:', error);
    throw error;
  }
};

