import { useState, useEffect, useRef } from 'react';
import { getUsers } from '@services/userService';

interface User {
  _id: string;
  name: string;
  email: string;
  rol?: string;
  disabled: boolean;
  __v: number;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface StatsInfo {
  total: number;
  active: number;
  inactive: number;
}

interface CacheEntry {
  users: User[];
  pagination: PaginationInfo;
  stats: StatsInfo;
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const useUsers = (initialPage = 1, itemsPerPage = 10) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [stats, setStats] = useState<StatsInfo | null>(null);
  const cache = useRef<Map<number, CacheEntry>>(new Map());

  const fetchUsers = async (page: number, forceRefresh = false) => {
    const now = Date.now();
    const cachedData = cache.current.get(page);

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
      const data = await getUsers(page, itemsPerPage);
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
    fetchUsers(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

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
    goToPage,
    nextPage,
    prevPage,
    refresh,
  };
};

