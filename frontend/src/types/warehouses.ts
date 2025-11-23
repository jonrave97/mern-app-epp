/**
 * Bodega de almacenamiento de equipos de protección personal (EPP)
 * Representa un lugar físico donde se almacenan y gestionan los equipos
 */
export interface Warehouses {
  /** ID único de la bodega en MongoDB */
  _id: string;
  /** Código único identificador de la bodega */
  code: string;
  /** Nombre descriptivo de la bodega */
  name: string;
  /** Indica si la bodega está deshabilitada (soft delete) */
  disabled?: boolean;
  /** Versión del documento en MongoDB */
  __v?: number;
  /** Fecha de creación del registro */
  createdAt?: string;
  /** Fecha de última actualización */
  updatedAt?: string;
}
