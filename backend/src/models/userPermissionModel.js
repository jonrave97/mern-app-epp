import mongoose from 'mongoose';

/**
 * Modelo para permisos personalizados por usuario
 * Se mantiene separado del modelo User existente para no afectar los 500 registros
 */
const userPermissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // Un registro por usuario
  },
  
  // Permisos específicos con checkbox en el frontend
  permissions: {
    // Gestión de Usuarios
    users: {
      canView: { type: Boolean, default: false },
      canCreate: { type: Boolean, default: false },
      canEdit: { type: Boolean, default: false },
      canDelete: { type: Boolean, default: false },
      canManage: { type: Boolean, default: false }
    },
    
    // Gestión de Bodegas
    warehouses: {
      canView: { type: Boolean, default: false },
      canCreate: { type: Boolean, default: false },
      canEdit: { type: Boolean, default: false },
      canDelete: { type: Boolean, default: false }
    },
    
    // Gestión de EPP
    epp: {
      canView: { type: Boolean, default: true }, // Por defecto todos pueden ver EPP
      canCreate: { type: Boolean, default: false },
      canEdit: { type: Boolean, default: false },
      canDelete: { type: Boolean, default: false }
    },
    
    // Solicitudes EPP
    requests: {
      canCreate: { type: Boolean, default: true }, // Por defecto todos pueden crear solicitudes
      canView: { type: Boolean, default: true }, // Ver sus propias solicitudes
      canViewAll: { type: Boolean, default: false }, // Ver todas las solicitudes
      canEdit: { type: Boolean, default: false },
      canApprove: { type: Boolean, default: false }, // Solo Jefatura por defecto
      canReject: { type: Boolean, default: false },
      canDelete: { type: Boolean, default: false }
    },
    
    // Reportes
    reports: {
      canView: { type: Boolean, default: false },
      canExport: { type: Boolean, default: false },
      canManage: { type: Boolean, default: false }
    },
    
    // Configuraciones del Sistema
    settings: {
      canView: { type: Boolean, default: false },
      canEdit: { type: Boolean, default: false }
    },
    
    // Panel Administrativo
    admin: {
      canAccess: { type: Boolean, default: false },
      canManagePermissions: { type: Boolean, default: false }
    }
  },
  
  // Metadatos
  isActive: {
    type: Boolean,
    default: true
  },
  
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  notes: {
    type: String,
    maxlength: 500,
    trim: true
  }
}, {
  timestamps: true
});

// Middleware para establecer permisos por defecto según el rol del usuario
userPermissionSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      // Obtener el usuario para conocer su rol
      const User = mongoose.model('User');
      const user = await User.findById(this.userId);
      
      if (user && user.rol) {
        // Establecer permisos por defecto según el rol
        switch (user.rol) {
          case 'Administrador':
            // Administrador tiene todos los permisos
            this.permissions = {
              users: { canView: true, canCreate: true, canEdit: true, canDelete: true, canManage: true },
              warehouses: { canView: true, canCreate: true, canEdit: true, canDelete: true },
              epp: { canView: true, canCreate: true, canEdit: true, canDelete: true },
              requests: { canCreate: true, canView: true, canViewAll: true, canEdit: true, canApprove: true, canReject: true, canDelete: true },
              reports: { canView: true, canExport: true, canManage: true },
              settings: { canView: true, canEdit: true },
              admin: { canAccess: true, canManagePermissions: true }
            };
            break;
            
          case 'Jefatura':
            // Jefatura puede aprobar solicitudes
            this.permissions.requests.canApprove = true;
            this.permissions.requests.canReject = true;
            this.permissions.requests.canViewAll = true;
            break;
            
          case 'Supervisor':
          case 'Usuario':
          default:
            // Permisos básicos (ya establecidos por defecto)
            break;
        }
      }
    } catch (error) {
      console.error('Error al establecer permisos por defecto:', error);
    }
  }
  next();
});

// Índices para optimizar consultas
// userId ya tiene índice único por la declaración en el schema
userPermissionSchema.index({ isActive: 1 });
userPermissionSchema.index({ 'permissions.admin.canAccess': 1 });

export default mongoose.model('UserPermission', userPermissionSchema);