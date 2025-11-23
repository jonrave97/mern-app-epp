/**
 * Empresa dentro del sistema de gestión de EPP
 * Representa una organización que agrupa usuarios y gestiona equipos de protección
 */
export interface Company {
  /** ID único de la empresa en MongoDB */
  _id: string;
  /** Nombre de la empresa (único) */
  name: string;
  /** Indica si la empresa está deshabilitada (soft delete) */
  disabled: boolean;
  /** Fecha de creación del registro */
  createdAt: string;
  /** Fecha de última actualización */
  updatedAt: string;
}
