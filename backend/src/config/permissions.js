// Configuración de permisos por rol - No requiere cambios en BD
export const ROLE_PERMISSIONS = {
  'Administrador': {
    users: ['create', 'read', 'update', 'delete', 'manage'],
    warehouses: ['create', 'read', 'update', 'delete', 'manage'],
    epp: ['create', 'read', 'update', 'delete', 'manage'],
    requests: ['create', 'read', 'update', 'delete', 'approve', 'reject', 'manage'],
    reports: ['read', 'export', 'manage'],
    settings: ['read', 'update', 'manage'],
    dashboard: ['access', 'admin']
  },
  
  // Jefatura puede aprobar solicitudes EPP (capacidad especial)
  'Jefatura': {
    epp: ['read'],
    requests: ['create', 'read', 'approve', 'reject'], // Puede aprobar solicitudes
    dashboard: ['access', 'user']
  },
  
  'Supervisor': {
    epp: ['read'],
    requests: ['create', 'read'], // Solo sus propias solicitudes
    dashboard: ['access', 'user']
  },
  
  'Usuario': {
    epp: ['read'],
    requests: ['create', 'read'], // Solo sus propias solicitudes
    dashboard: ['access', 'user']
  }
};

// Recursos disponibles en el sistema
export const RESOURCES = {
  USERS: 'users',
  WAREHOUSES: 'warehouses',
  EPP: 'epp',
  REQUESTS: 'requests',
  REPORTS: 'reports',
  SETTINGS: 'settings',
  DASHBOARD: 'dashboard'
};

// Acciones disponibles
export const ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  APPROVE: 'approve',
  REJECT: 'reject',
  EXPORT: 'export',
  MANAGE: 'manage',
  ACCESS: 'access'
};

/**
 * Verifica si un rol tiene permiso para realizar una acción en un recurso
 * @param {string} userRole - Rol del usuario (usando campo 'rol' existente)
 * @param {string} resource - Recurso al que intenta acceder
 * @param {string} action - Acción que intenta realizar
 * @returns {boolean} - true si tiene permiso, false si no
 */
export const hasPermission = (userRole, resource, action) => {
  if (!userRole || !ROLE_PERMISSIONS[userRole]) {
    return false;
  }
  
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  const resourcePermissions = rolePermissions[resource];
  
  if (!resourcePermissions) {
    return false;
  }
  
  return resourcePermissions.includes(action);
};

/**
 * Obtiene todos los permisos de un rol específico
 * @param {string} userRole - Rol del usuario
 * @returns {object} - Objeto con todos los permisos del rol
 */
export const getRolePermissions = (userRole) => {
  return ROLE_PERMISSIONS[userRole] || {};
};

/**
 * Verifica si un usuario puede acceder a una ruta específica
 * @param {string} userRole - Rol del usuario
 * @param {string} route - Ruta a verificar (ej: '/admin/users')
 * @returns {boolean} - true si puede acceder, false si no
 */
export const canAccessRoute = (userRole, route) => {
  const routePermissions = {
    '/admin': ['Administrador'],
    '/admin/users': ['Administrador'],
    '/admin/warehouses': ['Administrador'],
    '/admin/reports': ['Administrador', 'Jefatura'],
    '/dashboard': ['Administrador', 'Jefatura', 'Supervisor', 'Usuario'],
    '/requests': ['Administrador', 'Jefatura', 'Supervisor', 'Usuario'],
    '/profile': ['Administrador', 'Jefatura', 'Supervisor', 'Usuario']
  };

  // Verificar rutas exactas
  if (routePermissions[route]) {
    return routePermissions[route].includes(userRole);
  }

  // Verificar rutas que empiezan con cierto patrón
  for (const [allowedRoute, allowedRoles] of Object.entries(routePermissions)) {
    if (route.startsWith(allowedRoute)) {
      return allowedRoles.includes(userRole);
    }
  }

  return false;
};