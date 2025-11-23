import api from './api';
import type { Company } from '../types/company';

/**
 * Obtiene una lista paginada de empresas desde el backend
 * @param page - Número de página (por defecto 1)
 * @param limit - Cantidad de empresas por página (por defecto 100)
 * @returns Promesa con los datos de empresas, paginación y estadísticas
 */
export const getCompanies = async (page = 1, limit = 100) => {
  try {
    const response = await api.get(`/companies/all?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener empresas:', error);
    throw error;
  }
};

/**
 * Crea una nueva empresa en el sistema
 * @param companyData - Datos de la empresa (name requerido, disabled opcional)
 * @returns Promesa con la empresa creada
 * @example
 * createCompany({ name: 'Kal Tire' })
 * createCompany({ name: 'Kal Tire', disabled: false })
 */
export const createCompany = async (companyData: Partial<Omit<Company, '_id' | 'createdAt' | 'updatedAt'>> & { name: string }) => {
  try {
    const response = await api.post('/companies/create', companyData);
    return response.data;
  } catch (error) {
    console.error('Error al crear empresa:', error);
    throw error;
  }
};

/**
 * Actualiza una empresa existente
 * @param id - ID de la empresa a actualizar
 * @param companyData - Datos parciales a actualizar (name y/o disabled)
 * @returns Promesa con la empresa actualizada
 * @example
 * updateCompany('123abc', { name: 'Nuevo Nombre' })
 * updateCompany('123abc', { disabled: true })
 */
export const updateCompany = async (id: string, companyData: Partial<Omit<Company, '_id' | 'createdAt' | 'updatedAt'>>) => {
  try {
    const response = await api.put(`/companies/update/${id}`, companyData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar empresa:', error);
    throw error;
  }
};

/**
 * Elimina (soft delete) o activa/desactiva una empresa
 * @param id - ID de la empresa
 * @returns Promesa con la respuesta del servidor
 * @deprecated Esta función no debería usarse ya que se removió la ruta DELETE del backend
 */
export const deleteCompany = async (id: string) => {
  try {
    const response = await api.delete(`/companies/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al cambiar estado de empresa:', error);
    throw error;
  }
};
