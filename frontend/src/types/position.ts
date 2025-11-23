import { Epp } from './epp';

/**
 * Posición o cargo dentro del sistema de gestión de EPP
 * Representa un puesto de trabajo con EPPs asignados
 */
export interface Position {
  /** ID único de la posición en MongoDB */
  _id: string;
  /** Nombre de la posición (único) */
  name: string;
  /** Array de EPPs asignados a esta posición */
  epps: Epp[];
  /** Indica si la posición está deshabilitada (soft delete) */
  disabled: boolean;
  /** Fecha de creación del registro */
  createdAt: string;
  /** Fecha de última actualización */
  updatedAt: string;
}
