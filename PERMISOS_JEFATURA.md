# Sistema de Permisos para Jefatura

## 📋 Resumen

Se ha implementado un sistema completo de permisos basado en base de datos que permite al administrador controlar qué módulos puede ver y usar cada usuario, incluyendo los usuarios con rol de Jefatura.

---

## 🔧 Cambios Implementados

### 1. **Backend - API con Token**

#### ✅ Interceptor de Axios (`frontend/src/services/api.ts`)
- Ahora **automáticamente** envía el token JWT en todas las peticiones
- Maneja errores 401 y redirige al login si el token expira
- **Solución al error**: "Token no proporcionado" ❌ → Ahora funciona ✅

#### ✅ Middleware de Permisos (`backend/src/middlewares/permissionMiddleware.js`)
- Corregido: usa `user.id` en lugar de `user._id`
- Verifica permisos desde la base de datos en cada petición

#### ✅ Rutas Protegidas (`backend/src/routes/requestRoutes.js`)
```javascript
// Antes - Sin verificación de permisos
router.get('/my-requests', getMyRequests);

// Ahora - Con verificación de permisos
router.get('/my-requests', requirePermissionNew('requests', 'canView'), getMyRequests);
```

**Rutas protegidas:**
- `/api/requests/my-requests` → Requiere `requests.canView`
- `/api/requests/team-requests` → Requiere `requests.canViewAll`
- `/api/requests/my-team` → Requiere `requests.canViewAll`
- `/api/requests/:id/approve` → Requiere `requests.canApprove`
- `/api/requests/:id/reject` → Requiere `requests.canReject`

---

### 2. **Frontend - Hook de Permisos**

#### ✅ Hook `usePermissions` (`frontend/src/hooks/auth/usePermissions.ts`)

Ahora carga los permisos desde la **base de datos** en lugar de usar permisos estáticos por rol.

**Funciones disponibles:**
```typescript
const {
  permissions,           // Objeto con todos los permisos del usuario
  loading,              // Estado de carga
  error,                // Errores al cargar
  hasPermission,        // Verificar permiso específico
  canViewRequests,      // ¿Puede ver solicitudes?
  canApproveRequests,   // ¿Puede aprobar?
  canViewAllRequests,   // ¿Puede ver equipo?
  canCreateRequests,    // ¿Puede crear?
  canManageUsers,       // ¿Puede gestionar usuarios?
  canAccessAdmin        // ¿Puede acceder al admin?
} = usePermissions();
```

#### ✅ Sidebar Dinámico (`frontend/src/components/layouts/shared/user/sidebar.tsx`)

El menú ahora se muestra **solo si el usuario tiene permisos**:

```tsx
{/* Mis Solicitudes - Solo si tiene permiso */}
{canViewRequests() && (
  <li>
    <Link to="/user/solicitudes">Mis Solicitudes</Link>
  </li>
)}

{/* Mi Equipo - Solo si puede ver todas las solicitudes */}
{canViewAllRequests() && (
  <li>
    <Link to="/user/equipo">Mi Equipo</Link>
  </li>
)}

{/* Aprobaciones - Solo si puede aprobar */}
{canApproveRequests() && (
  <li>
    <Link to="/user/aprobaciones">Aprobaciones Pendientes</Link>
  </li>
)}
```

---

## 🎯 Cómo Habilitar Módulos para Jefatura

### Paso 1: Acceder al Panel de Administrador

1. Iniciar sesión como **Administrador**
2. Ir a **Admin** → **Permisos de Usuario**

### Paso 2: Seleccionar el Usuario de Jefatura

Buscar y seleccionar el usuario que tiene rol "Jefatura"

### Paso 3: Habilitar Permisos de Solicitudes

En la sección **"Solicitudes EPP"**, marcar los siguientes checkboxes:

#### Para ver "Mis Solicitudes":
- ✅ `canView` - Ver sus solicitudes
- ✅ `canCreate` - Crear solicitudes

#### Para ver "Mi Equipo":
- ✅ `canViewAll` - Ver todas las solicitudes del equipo

#### Para ver "Aprobaciones Pendientes":
- ✅ `canApprove` - Aprobar solicitudes
- ✅ `canReject` - Rechazar solicitudes

### Paso 4: Guardar Cambios

Hacer clic en **"Guardar Permisos"**

### Paso 5: Verificar

El usuario de Jefatura debe:
1. Cerrar sesión
2. Volver a iniciar sesión
3. Ver los módulos habilitados en el menú lateral

---

## 📊 Estructura de Permisos en la Base de Datos

### Modelo UserPermission

```javascript
{
  userId: ObjectId,
  permissions: {
    requests: {
      canCreate: true,      // ✅ Crear solicitudes
      canView: true,        // ✅ Ver sus solicitudes
      canViewAll: true,     // ✅ Ver solicitudes del equipo
      canEdit: false,       // ❌ Editar solicitudes
      canApprove: true,     // ✅ Aprobar solicitudes
      canReject: true,      // ✅ Rechazar solicitudes
      canDelete: false      // ❌ Eliminar solicitudes
    },
    // ... otros módulos
  }
}
```

---

## 🔒 Permisos por Defecto según Rol

### Administrador
- ✅ **TODOS** los permisos en **TODOS** los módulos

### Jefatura (Por defecto al crear permisos)
```javascript
requests: {
  canCreate: true,
  canView: true,
  canViewAll: true,    // Ver equipo
  canApprove: true,    // Aprobar
  canReject: true      // Rechazar
}
```

### Usuario/Supervisor (Por defecto)
```javascript
requests: {
  canCreate: true,     // Solo crear
  canView: true        // Solo ver propias
}
```

---

## 🧪 Pruebas

### Verificar que funciona:

1. **Login como Jefatura sin permisos**:
   - No debe ver ningún módulo en el menú

2. **Habilitar permisos desde Admin**:
   - Admin → Permisos → Seleccionar usuario Jefatura
   - Marcar: `canView`, `canCreate`, `canViewAll`, `canApprove`, `canReject`
   - Guardar

3. **Login nuevamente como Jefatura**:
   - Debe ver: Dashboard, Mis Solicitudes, Mi Equipo, Aprobaciones Pendientes

4. **Probar funcionalidad**:
   - Crear solicitud
   - Ver equipo
   - Aprobar/rechazar solicitudes

---

## 🚨 Solución de Problemas

### "Token no proporcionado"
✅ **SOLUCIONADO**: El interceptor de axios ahora envía automáticamente el token.

### "No tienes permisos para canView en requests"
➡️ **Solución**: Ir a Admin → Permisos y habilitar el checkbox `canView` en la sección "Solicitudes EPP"

### El menú no muestra los módulos
➡️ **Solución**: 
1. Cerrar sesión completamente
2. Volver a iniciar sesión
3. El hook `usePermissions` cargará los nuevos permisos

### Los permisos no se actualizan
➡️ **Solución**:
1. Verificar en MongoDB que se guardaron los permisos
2. Hacer logout/login
3. Revisar la consola del navegador por errores

---

## 📝 Ejemplo Completo

### Habilitar todos los módulos de Jefatura:

**En MongoDB Compass o desde el panel de Admin:**

```javascript
{
  userId: ObjectId("ID_DEL_USUARIO_JEFATURA"),
  permissions: {
    requests: {
      canCreate: true,      // Crear solicitudes
      canView: true,        // Ver mis solicitudes
      canViewAll: true,     // Ver solicitudes del equipo
      canEdit: false,       // No editar
      canApprove: true,     // Aprobar solicitudes
      canReject: true,      // Rechazar solicitudes
      canDelete: false      // No eliminar
    }
  },
  isActive: true
}
```

**Resultado en el menú:**
- 📊 Dashboard
- 📝 Mis Solicitudes
- 👥 Mi Equipo
- ✅ Aprobaciones Pendientes

---

## ✨ Ventajas del Sistema

1. **Granular**: Control por cada acción en cada módulo
2. **Flexible**: El admin puede personalizar para cada usuario
3. **Seguro**: Verificación en backend y frontend
4. **Dinámico**: Cambios sin modificar código
5. **Escalable**: Fácil agregar nuevos módulos y permisos

---

## 🎓 Siguientes Pasos

Para agregar un nuevo módulo (ejemplo: Reportes):

1. **Backend**: Agregar sección en `userPermissionModel.js`
2. **Frontend**: Agregar funciones en `usePermissions.ts`
3. **Rutas**: Proteger con `requirePermissionNew('reportes', 'canView')`
4. **Menú**: Agregar condición en sidebar
5. **Admin**: Ya aparecerá automáticamente en el panel de permisos
