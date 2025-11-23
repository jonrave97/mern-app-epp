import { useForm } from '@hooks/form/useForm';
import { ModalActions } from '@components/shared/ModalActions';

interface UserFormProps {
  onSubmit: (data: { name: string; email: string; password?: string; rol?: string }) => Promise<void>;
  onCancel: () => void;
  initialData?: {
    name: string;
    email: string;
    rol?: string;
  };
  isEditing?: boolean;
}

export function UserForm({ onSubmit, onCancel, initialData, isEditing = false }: UserFormProps) {
  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm({
    initialValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      password: '',
      rol: initialData?.rol || 'usuario',
    },
    validationRules: {
      name: {
        required: true,
        minLength: 3,
        maxLength: 50,
      },
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      },
      password: isEditing
        ? {
            minLength: 6,
          }
        : {
            required: true,
            minLength: 6,
          },
    },
    onSubmit: async (data) => {
      const submitData: { name: string; email: string; password?: string; rol?: string } = {
        name: data.name,
        email: data.email,
        rol: data.rol,
      };
      // Solo incluir contraseña si se proporcionó
      if (data.password) {
        submitData.password = data.password;
      }
      await onSubmit(submitData);
    },
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nombre */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={values.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            touched.name && errors.name
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-primary'
          }`}
          placeholder="Juan Pérez"
        />
        {touched.name && errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          value={values.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            touched.email && errors.email
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-primary'
          }`}
          placeholder="juan@ejemplo.com"
        />
        {touched.email && errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Contraseña */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña {!isEditing && <span className="text-red-500">*</span>}
          {isEditing && <span className="text-gray-500 text-xs">(Dejar vacío para no cambiar)</span>}
        </label>
        <input
          type="password"
          id="password"
          value={values.password}
          onChange={(e) => handleChange('password', e.target.value)}
          onBlur={() => handleBlur('password')}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            touched.password && errors.password
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-primary'
          }`}
          placeholder={isEditing ? '••••••' : 'Mínimo 6 caracteres'}
        />
        {touched.password && errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      {/* Rol */}
      <div>
        <label htmlFor="rol" className="block text-sm font-medium text-gray-700 mb-1">
          Rol
        </label>
        <select
          id="rol"
          value={values.rol}
          onChange={(e) => handleChange('rol', e.target.value)}
          onBlur={() => handleBlur('rol')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="usuario">Usuario</option>
          <option value="admin">Administrador</option>
          <option value="supervisor">Supervisor</option>
        </select>
      </div>

      {/* Botones */}
      <ModalActions
        onCancel={onCancel}
        onConfirm={handleSubmit}
        confirmText={isEditing ? 'Actualizar' : 'Crear'}
        isLoading={isSubmitting}
        loadingText={isEditing ? 'Actualizando...' : 'Creando...'}
        confirmType="submit"
      />
    </form>
  );
}
