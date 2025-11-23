import { useState, useEffect } from 'react';
import { getCompanies } from '@services/companyService';
import type { Company } from '../../types/company';
import type { PaginationInfo, Stats } from '../../types/common';

/**
 * Hook personalizado para gestionar el listado de empresas con paginación
 * 
 * @param initialPage - Página inicial a cargar (por defecto 1)
 * @param initialLimit - Cantidad de empresas por página (por defecto 10)
 * 
 * @returns Objeto con:
 * - companies: Array de empresas
 * - loading: Estado de carga
 * - error: Mensaje de error si existe
 * - pagination: Información de paginación
 * - stats: Estadísticas (total, activas, inactivas)
 * - currentPage: Página actual
 * - goToPage: Función para ir a una página específica
 * - nextPage: Función para ir a la siguiente página
 * - prevPage: Función para ir a la página anterior
 * - refresh: Función para recargar los datos actuales
 * 
 * @example
 * const { companies, loading, error, refresh } = useCompanies(1, 10);
 */
export const useCompanies = (initialPage = 1, initialLimit = 10) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  /**
   * Función interna para obtener empresas del servidor
   * @param page - Número de página a cargar
   * @param limit - Cantidad de items por página
   */
  const fetchCompanies = async (page: number = currentPage, limit: number = initialLimit) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCompanies(page, limit);
      
      if (response.data) {
        setCompanies(response.data);
        setPagination(response.pagination);
        setStats(response.stats);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener empresas';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies(initialPage, initialLimit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    fetchCompanies(page, initialLimit);
  };

  const nextPage = () => {
    if (pagination?.hasNextPage) {
      goToPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (pagination?.hasPrevPage) {
      goToPage(currentPage - 1);
    }
  };

  const refresh = async () => {
    await fetchCompanies(currentPage, initialLimit);
  };

  return {
    companies,
    loading,
    error,
    pagination,
    stats,
    currentPage,
    goToPage,
    nextPage,
    prevPage,
    refresh,
  };
};
