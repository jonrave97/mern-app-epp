import { useState, useEffect, useRef, useCallback } from 'react';
import { getAreas } from '@services/areaService';
import type { Area } from '../../types/area';
import type { PaginationInfo, Stats } from '../../types/common';

/**
 * Valor de retorno del hook useAreas
 */
interface UseAreasReturn {
  /** Lista de áreas de la página actual */
  areas: Area[];
  /** Indica si se están cargando las áreas */
  loading: boolean;
  /** Mensaje de error si ocurre algún problema */
  error: string | null;
  /** Información de paginación */
  pagination: PaginationInfo | null;
  /** Estadísticas de áreas (total, activas, inactivas) */
  stats: Stats | null;
  /** Página actual */
  currentPage: number;
  /** Navega a una página específica */
  goToPage: (page: number) => void;
  /** Navega a la página siguiente */
  nextPage: () => void;
  /** Navega a la página anterior */
  prevPage: () => void;
  /** Recarga las áreas de la página actual */
  refresh: () => Promise<void>;
}

/**
 * Hook personalizado para obtener y gestionar áreas con paginación
 * 
 * Maneja automáticamente la carga de datos, paginación y estadísticas.
 * No implementa caché de datos (cada cambio de página hace una petición al backend).
 * 
 * @param initialPage - Página inicial a cargar (por defecto 1)
 * @param itemsPerPage - Cantidad de áreas por página (por defecto 10)
 * @returns {UseAreasReturn} Objeto con áreas, estados de carga y funciones de navegación
 * 
 * @example
 * ```tsx
 * const { areas, loading, error, pagination, stats, goToPage, nextPage, prevPage } = useAreas(1, 10);
 * 
 * if (loading) return <div>Cargando...</div>;
 * if (error) return <div>Error: {error}</div>;
 * 
 * return (
 *   <>
 *     {areas.map(area => <div key={area._id}>{area.name}</div>)}
 *     <button onClick={prevPage} disabled={!pagination?.hasPrevPage}>Anterior</button>
 *     <button onClick={nextPage} disabled={!pagination?.hasNextPage}>Siguiente</button>
 *   </>
 * );
 * ```
 */
export const useAreas = (initialPage = 1, itemsPerPage = 10): UseAreasReturn => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const isMountedRef = useRef(true);

  /**
   * Carga las áreas de una página específica
   * Actualiza el estado solo si el componente está montado
   */
  const fetchAreas = useCallback(async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAreas(page, itemsPerPage);
      
      if (isMountedRef.current) {
        setAreas(data.areas || []);
        setPagination(data.pagination || null);
        setStats(data.stats || null);
        setCurrentPage(page);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Error al cargar áreas');
        setAreas([]);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [itemsPerPage]);

  /**
   * Efecto para cargar áreas al montar el componente
   * Limpia la referencia al desmontar para evitar actualizaciones de estado
   */
  useEffect(() => {
    isMountedRef.current = true;
    fetchAreas(currentPage);

    return () => {
      isMountedRef.current = false;
    };
  }, [currentPage, fetchAreas]);

  /**
   * Navega a una página específica
   */
  const goToPage = (page: number) => {
    if (page > 0 && pagination && page <= pagination.totalPages) {
      setCurrentPage(page);
    }
  };

  /**
   * Navega a la página siguiente si existe
   */
  const nextPage = () => {
    if (pagination?.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  /**
   * Navega a la página anterior si existe
   */
  const prevPage = () => {
    if (pagination?.hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  /**
   * Recarga los datos de la página actual
   * Útil después de crear, actualizar o eliminar un área
   */
  const refresh = async () => {
    await fetchAreas(currentPage);
  };

  return {
    areas,
    loading,
    error,
    pagination,
    stats,
    currentPage,
    goToPage,
    nextPage,
    prevPage,
    refresh
  };
};
