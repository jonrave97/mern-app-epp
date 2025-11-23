import { useState, useEffect, useRef } from 'react';
import { getUsers } from '@services/userService';
import type { PaginationInfo, Stats } from '../../types/common';

/** Estructura de un usuario */
interface User {
  _id: string;
  name: string;
  email: string;
  rol?: string;
  disabled: boolean;
  __v: number;
}

/** Entrada de caché con usuarios, paginación, estadísticas y timestamp */
interface CacheEntry {
  users: User[];
  pagination: PaginationInfo;
  stats: Stats;
  timestamp: number;
}

/** Duración del caché: 5 minutos */
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * Hook personalizado para gestionar usuarios con paginación y caché en memoria
 * 
 * Implementa un sistema de caché que guarda los datos de cada página durante 5 minutos
 * para evitar peticiones redundantes al servidor.
 * 
 * @param initialPage - Página inicial a cargar (por defecto 1)
 * @param itemsPerPage - Cantidad de usuarios por página (por defecto 10)
 * 
 * @returns Objeto con:
 * - users: Array de usuarios de la página actual
 * - loading: Estado de carga
 * - error: Mensaje de error si existe
 * - pagination: Información de paginación
 * - stats: Estadísticas (total, activos, inactivos)
 * - currentPage: Página actual
 * - goToPage: Navegar a una página específica
 * - nextPage: Ir a la siguiente página
 * - prevPage: Ir a la página anterior
 * - refresh: Forzar recarga limpiando el caché
 * 
 * @example
 * const { users, loading, refresh } = useUsers(1, 10);
 */
export const useUsers = (initialPage = 1, itemsPerPage = 10) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  /** Caché en memoria para almacenar usuarios por página */
  const cache = useRef<Map<number, CacheEntry>>(new Map());

  /**
   * Obtiene usuarios del servidor o del caché
   * @param page - Número de página a obtener
   * @param forceRefresh - Si es true, ignora el caché y fuerza petición al servidor
   */
  const fetchUsers = async (page: number, forceRefresh = false) => {
    const now = Date.now();
    const cachedData = cache.current.get(page);

    // Si hay datos en caché y no han expirado, usarlos
    if (!forceRefresh && cachedData && (now - cachedData.timestamp) < CACHE_DURATION) {
      setUsers(cachedData.users);
      setPagination(cachedData.pagination);
      setStats(cachedData.stats);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getUsers(page, itemsPerPage, searchTerm);
      if (data.success) {
        const userData = data.data || [];
        const paginationData = data.pagination;
        const statsData = data.stats;

        setUsers(userData);
        setPagination(paginationData);
        setStats(statsData);

        cache.current.set(page, {
          users: userData,
          pagination: paginationData,
          stats: statsData,
          timestamp: now,
        });
      } else {
        setError(data.message || 'Error al cargar usuarios');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // When search term changes, clear cache, reset to page 1, and trigger refresh
    cache.current.clear();
    setCurrentPage(1);
    setRefreshTrigger(prev => prev + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  useEffect(() => {
    fetchUsers(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, refreshTrigger]);

  const goToPage = (page: number) => {
    if (page >= 1 && (!pagination || page <= pagination.totalPages)) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (pagination?.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (pagination?.hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const refresh = async () => {
    cache.current.clear();
    await fetchUsers(currentPage, true);
  };

  return {
    users,
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
    refresh,
  };
};

