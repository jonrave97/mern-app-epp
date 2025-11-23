import api from './api';
import type { Category } from '../types/category';

/**
 * Obtiene una lista paginada de categorías desde el backend
 * @param page - Número de página (por defecto 1)
 * @param limit - Cantidad de categorías por página (por defecto 100)
 * @param search - Término de búsqueda opcional para filtrar por nombre o descripción
 * @returns Promesa con los datos de categorías, paginación y estadísticas
 */
export const getCategories = async (page = 1, limit = 100, search = '') => {
  try {
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
    const response = await api.get(`/categories?page=${page}&limit=${limit}${searchParam}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    throw error;
  }
};

/**
 * Crea una nueva categoría en el sistema
 * @param categoryData - Datos de la categoría (name requerido, description y disabled opcionales)
 * @returns Promesa con la categoría creada
 * @example
 * createCategory({ name: 'CASCO', description: 'Protección de cabeza' })
 */
export const createCategory = async (categoryData: { name: string; description?: string; disabled?: boolean }) => {
  try {
    const response = await api.post('/categories', categoryData);
    return response.data;
  } catch (error) {
    console.error('Error al crear categoría:', error);
    throw error;
  }
};

/**
 * Actualiza una categoría existente
 * @param id - ID de la categoría a actualizar
 * @param categoryData - Datos parciales a actualizar (name, description y/o disabled)
 * @returns Promesa con la categoría actualizada
 * @example
 * updateCategory('123abc', { name: 'NUEVO NOMBRE' })
 * updateCategory('123abc', { description: 'Nueva descripción' })
 * updateCategory('123abc', { disabled: true })
 */
export const updateCategory = async (id: string, categoryData: Partial<Omit<Category, '_id' | 'createdAt' | 'updatedAt' | '__v'>>) => {
  try {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    throw error;
  }
};

/**
 * @deprecated No se debe eliminar categorías, usar updateCategory con disabled: true
 */
export const deleteCategory = async (id: string) => {
  console.warn('deleteCategory está deprecado. Usa updateCategory con disabled: true');
  try {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    throw error;
  }
};
