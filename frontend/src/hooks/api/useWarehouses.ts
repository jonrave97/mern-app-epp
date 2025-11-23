import { useState, useEffect, useRef } from 'react';
import { getWarehouses } from '@services/warehouseService';
import type { PaginationInfo, Stats } from '../../types/common';
import type { Warehouses } from '../../types/warehouses';

/** Entrada de caché con datos de una página específica */
interface CachedPage {
  data: Warehouses[];
  pagination: PaginationInfo;
  stats: Stats;
  timestamp: number;
}

/**
 * Caché global compartido entre todas las instancias del hook
 * Usa un Map con claves únicas por página y límite: "warehouses_p1_l10"
 */
const pageCache = new Map<string, CachedPage>();

/** Duración del caché: 5 minutos */
const CACHE_DURATION = 5 * 60 * 1000;

/**
 * Hook personalizado para gestionar bodegas con paginación y caché global
 * 
 * Implementa un sistema de caché global que comparte datos entre instancias
 * y persiste durante 5 minutos. Útil para evitar múltiples llamadas al servidor.
 * 
 * @param initialPage - Página inicial a cargar (por defecto 1)
 * @param initialLimit - Cantidad de bodegas por página (por defecto 10)
 * 
 * @returns Objeto con:
 * - warehouses: Array de bodegas de la página actual
 * - loading: Estado de carga
 * - error: Mensaje de error si existe
 * - pagination: Información de paginación
 * - stats: Estadísticas (total, activas, inactivas)
 * - currentPage: Página actual
 * - goToPage: Navegar a una página específica
 * - nextPage: Ir a la siguiente página
 * - prevPage: Ir a la página anterior
 * - clearCache: Limpiar todo el caché manualmente
 * - refresh: Refrescar página actual (limpia solo su caché)
 * 
 * @example
 * const { warehouses, loading, refresh, clearCache } = useWarehouses(1, 10);
 */
export const useWarehouses = (initialPage: number = 1, initialLimit: number = 10) => {
  const [warehouses, setWarehouses] = useState<Warehouses[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit] = useState(initialLimit);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  /** Ref para verificar si el componente sigue montado (evita memory leaks) */
  const isMountedRef = useRef(true);

  // Efecto para rastrear si el componente está montado
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Efecto principal que carga datos cuando cambia la página
  useEffect(() => {
    /**
     * Función interna que obtiene bodegas del caché o del servidor
     * Implementa lógica de caché con clave única por página/límite
     */
    const fetchData = async () => {
      const cacheKey = `warehouses_p${currentPage}_l${limit}_s${searchTerm}`;
      const now = Date.now();

      // 1. Verificar si existe en caché y no ha expirado (< 5 minutos)
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
        const response = await getWarehouses(currentPage, limit, searchTerm);
        
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
  }, [currentPage, limit, refreshTrigger]);

  // When search term changes, clear cache, reset to page 1, and trigger refresh
  useEffect(() => {
    pageCache.clear();
    setCurrentPage(1);
    setRefreshTrigger(prev => prev + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

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

  /**
   * Limpia todo el caché global de bodegas
   * Útil después de crear/editar/eliminar para forzar recarga completa
   */
  const clearCache = () => {
    pageCache.clear();
    console.log('🗑️ Caché limpiado');
  };

  /**
   * Refresca la página actual eliminando su entrada del caché
   * y obteniendo datos frescos del servidor
   */
  const refresh = async () => {
    const cacheKey = `warehouses_p${currentPage}_l${limit}_s${searchTerm}`;
    pageCache.delete(cacheKey);
    
    setLoading(true);
    try {
      const response = await getWarehouses(currentPage, limit, searchTerm);
      
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
    searchTerm,
    setSearchTerm,
    goToPage,
    nextPage,
    prevPage,
    clearCache,
    refresh
  };
};
