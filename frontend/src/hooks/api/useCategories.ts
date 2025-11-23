import { useState, useEffect, useRef, useCallback } from 'react';
import { getCategories } from '@services/categoryService';
import type { Category } from '../../types/category';
import type { PaginationInfo, Stats } from '../../types/common';

/**
 * Valor de retorno del hook useCategories
 */
interface UseCategoriesReturn {
  /** Lista de categorías de la página actual */
  categories: Category[];
  /** Indica si se están cargando las categorías */
  loading: boolean;
  /** Mensaje de error si ocurre algún problema */
  error: string | null;
  /** Información de paginación */
  pagination: PaginationInfo | null;
  /** Estadísticas de categorías (total, activas, inactivas) */
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
  /** Recarga las categorías de la página actual */
  refresh: () => Promise<void>;
}

/**
 * Hook personalizado para obtener y gestionar categorías con paginación y búsqueda
 * 
 * Maneja automáticamente la carga de datos, paginación, estadísticas y búsqueda.
 * No implementa caché de datos (cada cambio de página o búsqueda hace una petición al backend).
 * 
 * @param initialPage - Página inicial a cargar (por defecto 1)
 * @param itemsPerPage - Cantidad de categorías por página (por defecto 10)
 * @returns {UseCategoriesReturn} Objeto con categorías, estados de carga y funciones de navegación
 * 
 * @example
 * ```tsx
 * const { categories, loading, searchTerm, setSearchTerm, pagination, stats, goToPage } = useCategories(1, 10);
 * 
 * if (loading) return <div>Cargando...</div>;
 * 
 * return (
 *   <>
 *     <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
 *     {categories.map(category => (
 *       <div key={category._id}>{category.name}</div>
 *     ))}
 *   </>
 * );
 * ```
 */
export const useCategories = (initialPage = 1, itemsPerPage = 10): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchTerm, setSearchTerm] = useState('');
  const isMountedRef = useRef(true);

  /**
   * Carga las categorías de una página específica
   * Actualiza el estado solo si el componente está montado
   */
  const fetchCategories = useCallback(async (page: number, search = '') => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategories(page, itemsPerPage, search);
      
      if (isMountedRef.current) {
        setCategories(data.categories || []);
        setPagination(data.pagination || null);
        setStats(data.stats || null);
        setCurrentPage(page);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Error al cargar categorías');
        setCategories([]);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [itemsPerPage]);

  /**
   * Efecto para cargar categorías al montar el componente o cambiar búsqueda
   * Limpia la referencia al desmontar para evitar actualizaciones de estado
   */
  useEffect(() => {
    isMountedRef.current = true;
    fetchCategories(initialPage, searchTerm);

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchCategories, initialPage, searchTerm]);

  /**
   * Navega a una página específica
   */
  const goToPage = useCallback((page: number) => {
    if (pagination && page >= 1 && page <= pagination.totalPages) {
      fetchCategories(page, searchTerm);
    }
  }, [pagination, fetchCategories, searchTerm]);

  /**
   * Navega a la página siguiente
   */
  const nextPage = useCallback(() => {
    if (pagination?.hasNextPage) {
      fetchCategories(currentPage + 1, searchTerm);
    }
  }, [pagination, currentPage, fetchCategories, searchTerm]);

  /**
   * Navega a la página anterior
   */
  const prevPage = useCallback(() => {
    if (pagination?.hasPrevPage) {
      fetchCategories(currentPage - 1, searchTerm);
    }
  }, [pagination, currentPage, fetchCategories, searchTerm]);

  /**
   * Recarga las categorías de la página actual
   */
  const refresh = useCallback(async () => {
    await fetchCategories(currentPage, searchTerm);
  }, [currentPage, fetchCategories, searchTerm]);

  return {
    categories,
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
