/**
 * Área o departamento dentro del sistema de gestión de EPP
 * Representa una división organizacional con centro de costo asociado
 */
export interface Area {
  /** ID único del área en MongoDB */
  _id: string;
  /** Nombre del área (único) */
  name: string;
  /** Centro de costo asociado al área */
  costCenter: string;
  /** Indica si el área está deshabilitada (soft delete) */
  disabled: boolean;
  /** Fecha de creación del registro */
  createdAt: string;
  /** Fecha de última actualización */
  updatedAt: string;
}
