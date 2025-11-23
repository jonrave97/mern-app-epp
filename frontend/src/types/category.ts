/**
 * Categoría de EPP dentro del sistema
 * Representa una clasificación para agrupar EPPs
 */
export interface Category {
  /** ID único de la categoría en MongoDB */
  _id: string;
  /** Nombre de la categoría (único, en mayúsculas) */
  name: string;
  /** Descripción opcional de la categoría */
  description?: string;
  /** Indica si la categoría está deshabilitada (soft delete) */
  disabled: boolean;
  /** Fecha de creación del registro */
  createdAt: string;
  /** Fecha de última actualización */
  updatedAt: string;
}
