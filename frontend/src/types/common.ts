/**
 * Información de paginación compartida por todos los hooks de API
 * Proporciona datos completos del estado actual de la paginación
 */
export interface PaginationInfo {
  /** Página actual (base 1) */
  currentPage: number;
  /** Total de páginas disponibles */
  totalPages: number;
  /** Total de elementos en toda la colección */
  totalItems: number;
  /** Cantidad de elementos por página */
  itemsPerPage: number;
  /** Indica si existe una página siguiente */
  hasNextPage: boolean;
  /** Indica si existe una página anterior */
  hasPrevPage: boolean;
}

/**
 * Estadísticas de registros
 * Proporciona contadores de elementos totales, activos e inactivos
 * Usada por usuarios, bodegas, empresas, etc.
 */
export interface Stats {
  /** Total de registros en la colección */
  total: number;
  /** Registros activos (disabled: false) */
  active: number;
  /** Registros inactivos (disabled: true) */
  inactive: number;
}
