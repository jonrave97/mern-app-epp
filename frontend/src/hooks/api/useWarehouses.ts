import { useState, useEffect, useRef } from 'react';
import { getWarehouses } from '@services/warehouseService';

interface Warehouse {
  _id: string;
  code: string;
  name: string;
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

interface WarehouseStats {
  total: number;
  active: number;
  inactive: number;
}

interface CachedPage {
  data: Warehouse[];
  pagination: PaginationInfo;
  stats: WarehouseStats;
  timestamp: number;
}

// Caché global para compartir entre instancias del hook
const pageCache = new Map<string, CachedPage>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos en milisegundos

export const useWarehouses = (initialPage: number = 1, initialLimit: number = 10) => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [stats, setStats] = useState<WarehouseStats | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit] = useState(initialLimit);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const cacheKey = `warehouses_p${currentPage}_l${limit}`;
      const now = Date.now();

      // 1. Verificar si existe en caché y no ha expirado
      const cached = pageCache.get(cacheKey);
      if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        console.log(`✅ Usando caché para página ${currentPage}`);
        setWarehouses(cached.data);
        setPagination(cached.pagination);
        setStats(cached.stats);
        setLoading(false);
        return;
      }

      // 2. Si no hay caché o expiró, hacer petición al servidor
      console.log(`🌐 Petición al servidor para página ${currentPage}`);
      setLoading(true);
      try {
        const response = await getWarehouses(currentPage, limit);
        
        if (!isMountedRef.current) return;
        
        if (response.data && Array.isArray(response.data)) {
          // Guardar en caché
          pageCache.set(cacheKey, {
            data: response.data,
            pagination: response.pagination,
            stats: response.stats,
            timestamp: now
          });

          setWarehouses(response.data);
          setPagination(response.pagination);
          setStats(response.stats);
          setError(null);
        } else {
          setError('Error: Formato de datos inválido');
        }
      } catch (err) {
        if (!isMountedRef.current) return;
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [currentPage, limit]);

  const goToPage = (page: number) => {
    if (pagination && page >= 1 && page <= pagination.totalPages) {
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

  // Función para limpiar el caché manualmente (útil después de crear/editar/eliminar)
  const clearCache = () => {
    pageCache.clear();
    console.log('🗑️ Caché limpiado');
  };

  // Función para refrescar datos (sin caché)
  const refresh = async () => {
    const cacheKey = `warehouses_p${currentPage}_l${limit}`;
    pageCache.delete(cacheKey);
    
    setLoading(true);
    try {
      const response = await getWarehouses(currentPage, limit);
      
      if (response.data && Array.isArray(response.data)) {
        // Actualizar caché con datos frescos
        pageCache.set(cacheKey, {
          data: response.data,
          pagination: response.pagination,
          stats: response.stats,
          timestamp: Date.now()
        });

        setWarehouses(response.data);
        setPagination(response.pagination);
        setStats(response.stats);
        setError(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { 
    warehouses, 
    loading, 
    error, 
    pagination,
    stats,
    currentPage,
    goToPage,
    nextPage,
    prevPage,
    clearCache,
    refresh
  };
};
