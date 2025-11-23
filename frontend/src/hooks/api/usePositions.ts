import { useState, useEffect, useRef, useCallback } from 'react';
import { getPositions } from '@services/positionService';
import type { Position } from '../../types/position';
import type { PaginationInfo, Stats } from '../../types/common';

/**
 * Valor de retorno del hook usePositions
 */
interface UsePositionsReturn {
  /** Lista de posiciones de la página actual */
  positions: Position[];
  /** Indica si se están cargando las posiciones */
  loading: boolean;
  /** Mensaje de error si ocurre algún problema */
  error: string | null;
  /** Información de paginación */
  pagination: PaginationInfo | null;
  /** Estadísticas de posiciones (total, activas, inactivas) */
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
  /** Recarga las posiciones de la página actual */
  refresh: () => Promise<void>;
}

/**
 * Hook personalizado para obtener y gestionar posiciones con paginación
 * 
 * Maneja automáticamente la carga de datos, paginación y estadísticas.
 * No implementa caché de datos (cada cambio de página hace una petición al backend).
 * 
 * @param initialPage - Página inicial a cargar (por defecto 1)
 * @param itemsPerPage - Cantidad de posiciones por página (por defecto 10)
 * @returns {UsePositionsReturn} Objeto con posiciones, estados de carga y funciones de navegación
 * 
 * @example
 * ```tsx
 * const { positions, loading, error, pagination, stats, goToPage, nextPage, prevPage } = usePositions(1, 10);
 * 
 * if (loading) return <div>Cargando...</div>;
 * if (error) return <div>Error: {error}</div>;
 * 
 * return (
 *   <>
 *     {positions.map(position => (
 *       <div key={position._id}>
 *         {position.name} - {position.epps.length} EPPs
 *       </div>
 *     ))}
 *     <button onClick={prevPage} disabled={!pagination?.hasPrevPage}>Anterior</button>
 *     <button onClick={nextPage} disabled={!pagination?.hasNextPage}>Siguiente</button>
 *   </>
 * );
 * ```
 */
export const usePositions = (initialPage = 1, itemsPerPage = 10): UsePositionsReturn => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchTerm, setSearchTerm] = useState('');
  const isMountedRef = useRef(true);

  /**
   * Carga las posiciones de una página específica
   * Actualiza el estado solo si el componente está montado
   */
  const fetchPositions = useCallback(async (page: number, search = '') => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPositions(page, itemsPerPage, search);
      
      if (isMountedRef.current) {
        setPositions(data.positions || []);
        setPagination(data.pagination || null);
        setStats(data.stats || null);
        setCurrentPage(page);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Error al cargar posiciones');
        setPositions([]);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [itemsPerPage]);

  /**
   * Efecto para cargar posiciones al montar el componente
   * Limpia la referencia al desmontar para evitar actualizaciones de estado
   */
  useEffect(() => {
    isMountedRef.current = true;
    fetchPositions(initialPage, searchTerm);

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchPositions, initialPage, searchTerm]);

  /**
   * Navega a una página específica
   */
  const goToPage = useCallback((page: number) => {
    if (pagination && page >= 1 && page <= pagination.totalPages) {
      fetchPositions(page, searchTerm);
    }
  }, [pagination, fetchPositions, searchTerm]);

  /**
   * Navega a la página siguiente
   */
  const nextPage = useCallback(() => {
    if (pagination?.hasNextPage) {
      fetchPositions(currentPage + 1, searchTerm);
    }
  }, [pagination, currentPage, fetchPositions, searchTerm]);

  /**
   * Navega a la página anterior
   */
  const prevPage = useCallback(() => {
    if (pagination?.hasPrevPage) {
      fetchPositions(currentPage - 1, searchTerm);
    }
  }, [pagination, currentPage, fetchPositions, searchTerm]);

  /**
   * Recarga las posiciones de la página actual
   */
  const refresh = useCallback(async () => {
    await fetchPositions(currentPage, searchTerm);
  }, [currentPage, fetchPositions, searchTerm]);

  return {
    positions,
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
