import { useState, useEffect, useRef, useCallback } from 'react';
import { getEpps } from '@services/eppService';
import type { Epp } from '../../types/epp';
import type { PaginationInfo, Stats } from '../../types/common';

/**
 * Valor de retorno del hook useEpps
 */
interface UseEppsReturn {
  /** Lista de EPPs de la página actual */
  epps: Epp[];
  /** Indica si se están cargando los EPPs */
  loading: boolean;
  /** Mensaje de error si ocurre algún problema */
  error: string | null;
  /** Información de paginación */
  pagination: PaginationInfo | null;
  /** Estadísticas de EPPs (total, activos, inactivos) */
  stats: Stats | null;
  /** Página actual */
  currentPage: number;
  /** Término de búsqueda actual */
  searchTerm: string;
  /** Actualiza el término de búsqueda */
  setSearchTerm: (term: string) => void;
  /** Navega a una página específica */
  goToPage: (page: number) => void;
  /** Navega a la página siguiente */
  nextPage: () => void;
  /** Navega a la página anterior */
  prevPage: () => void;
  /** Recarga los EPPs de la página actual */
  refresh: () => Promise<void>;
}

/**
 * Hook personalizado para obtener y gestionar EPPs con paginación y búsqueda
 * 
 * Maneja automáticamente la carga de datos, paginación, estadísticas y búsqueda.
 * No implementa caché de datos (cada cambio de página o búsqueda hace una petición al backend).
 * 
 * @param initialPage - Página inicial a cargar (por defecto 1)
 * @param itemsPerPage - Cantidad de EPPs por página (por defecto 10)
 * @returns {UseEppsReturn} Objeto con EPPs, estados de carga y funciones de navegación
 * 
 * @example
 * ```tsx
 * const { epps, loading, searchTerm, setSearchTerm, pagination, stats, goToPage } = useEpps(1, 10);
 * 
 * if (loading) return <div>Cargando...</div>;
 * 
 * return (
 *   <>
 *     <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
 *     {epps.map(epp => (
 *       <div key={epp._id}>{epp.name} - {epp.category}</div>
 *     ))}
 *   </>
 * );
 * ```
 */
export const useEpps = (initialPage = 1, itemsPerPage = 10): UseEppsReturn => {
  const [epps, setEpps] = useState<Epp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchTerm, setSearchTerm] = useState('');
  const isMountedRef = useRef(true);

  /**
   * Carga los EPPs de una página específica
   * Actualiza el estado solo si el componente está montado
   */
  const fetchEpps = useCallback(async (page: number, search = '') => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEpps(page, itemsPerPage, search);
      
      if (isMountedRef.current) {
        setEpps(data.epps || []);
        setPagination(data.pagination || null);
        setStats(data.stats || null);
        setCurrentPage(page);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Error al cargar EPPs');
        setEpps([]);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [itemsPerPage]);

  /**
   * Efecto para cargar EPPs al montar el componente o cambiar búsqueda
   * Limpia la referencia al desmontar para evitar actualizaciones de estado
   */
  useEffect(() => {
    isMountedRef.current = true;
    fetchEpps(initialPage, searchTerm);

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchEpps, initialPage, searchTerm]);

  /**
   * Navega a una página específica
   */
  const goToPage = useCallback((page: number) => {
    if (pagination && page >= 1 && page <= pagination.totalPages) {
      fetchEpps(page, searchTerm);
    }
  }, [pagination, fetchEpps, searchTerm]);

  /**
   * Navega a la página siguiente
   */
  const nextPage = useCallback(() => {
    if (pagination?.hasNextPage) {
      fetchEpps(currentPage + 1, searchTerm);
    }
  }, [pagination, currentPage, fetchEpps, searchTerm]);

  /**
   * Navega a la página anterior
   */
  const prevPage = useCallback(() => {
    if (pagination?.hasPrevPage) {
      fetchEpps(currentPage - 1, searchTerm);
    }
  }, [pagination, currentPage, fetchEpps, searchTerm]);

  /**
   * Recarga los EPPs de la página actual
   */
  const refresh = useCallback(async () => {
    await fetchEpps(currentPage, searchTerm);
  }, [currentPage, fetchEpps, searchTerm]);

  return {
    epps,
    loading,
    error,
    pagination,
    stats,
    currentPage,
    searchTerm,
    setSearchTerm,
    goToPage,
    nextPage,
    prevPage,
    refresh
  };
};
