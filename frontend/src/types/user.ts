/**
 * Tallas de elementos de protección personal (EPP) del usuario
 * Almacena las medidas específicas para cada tipo de equipo de protección
 */
export interface UserSizes {
  /** Talla de calzado (número) */
  footwear?: string;
  /** Talla de guantes (número) */
  gloves?: string;
  /** Talla de pantalones */
  pants?: {
    /** Letra de la talla (S, M, L, XL, etc.) */
    letter?: string;
    /** Número de la talla */
    number?: string;
  };
  /** Talla de camisa/chaqueta (S, M, L, XL, etc.) */
  shirtJacket?: string;
}

/**
 * Usuario del sistema de gestión de EPP
 * Representa un trabajador con toda su información personal, organizacional y de asignación de equipos
 */
export interface User {
  /** ID único del usuario en MongoDB */
  _id: string;
  /** Nombre completo del usuario */
  name: string;
  /** Correo electrónico (único, usado para autenticación) */
  email: string;
  /** Contraseña encriptada (opcional en respuestas del backend) */
  password?: string;
  /** Rol del usuario en el sistema (admin, user, etc.) */
  rol?: string;
  /** Indica si el usuario ha confirmado su cuenta por email */
  confirmed?: boolean;
  /** Indica si el usuario está deshabilitado (soft delete) */
  disabled?: boolean;
  /** Nombre de la empresa a la que pertenece */
  company?: string;
  /** Área o departamento dentro de la empresa */
  area?: string;
  /** Centro de costo asociado */
  costCenter?: string;
  /** Cargo o posición del usuario (ID como string) */
  position?: string; // ObjectId como string
  /** Array de IDs de los jefes directos del usuario */
  bosses?: string[]; // Array de ObjectIds como strings
  /** Token de autenticación JWT (opcional) */
  token?: string;
  /** RUT del usuario (identificación chilena) */
  rut?: number;
  /** Tallas de EPP del usuario */
  sizes?: UserSizes;
  /** Fecha de creación del registro */
  createdAt?: string;
  /** Fecha de última actualización */
  updatedAt?: string;
  /** Versión del documento en MongoDB */
  __v?: number;
}
