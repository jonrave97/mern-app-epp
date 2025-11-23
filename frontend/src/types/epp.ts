/**
 * Equipo de Protección Personal (EPP)
 * Representa un artículo de protección que puede ser asignado a los trabajadores
 */
export interface Epp {
  /** ID único del EPP en MongoDB */
  _id: string;
  /** Código único identificador del equipo */
  code: string;
  /** Nombre descriptivo del equipo */
  name: string;
  /** Precio unitario del equipo */
  price: number;
  /** Categoría del equipo (casco, guantes, calzado, etc.) */
  category: string;
  /** Indica si el equipo está deshabilitado (soft delete) */
  disabled?: boolean;
  /** Versión del documento en MongoDB */
  __v?: number;
  /** Fecha de creación del registro */
  createdAt?: string;
  /** Fecha de última actualización */
  updatedAt?: string;
}
