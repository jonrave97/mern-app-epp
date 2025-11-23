import { ModalActions } from '@components/shared/ModalActions';
import { useForm } from '@hooks/form/useForm';

interface WarehouseFormProps {
  onSubmit: (data: { code: string; name: string }) => Promise<void>;
  onCancel: () => void;
  initialData?: { code: string; name: string };
  isEditing?: boolean;
}

export const WarehouseForm = ({ onSubmit, onCancel, initialData, isEditing = false }: WarehouseFormProps) => {
  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm({
    initialValues: {
      code: initialData?.code || '',
      name: initialData?.name || ''
    },
    validationRules: {
      code: {
        required: true,
        minLength: 2,
        maxLength: 20,
      },
      name: {
        required: true,
        minLength: 3,
        maxLength: 100,
      },
    },
    onSubmit,
    autoClearErrors: true,
    autoClearDelay: 5000,
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Campo Código */}
      <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
          Código <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="code"
          value={values.code}
          onChange={(e) => handleChange('code', e.target.value)}
          disabled={isEditing}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition ${
            errors.code ? 'border-red-500' : 'border-gray-300'
          } ${isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          placeholder="Ej: BOD-001"
          autoFocus
        />
        {errors.code && (
          <p className="mt-1 text-sm text-red-500">{errors.code}</p>
        )}
        {isEditing && (
          <p className="mt-1 text-sm text-gray-500">El código no se puede modificar</p>
        )}
      </div>

      {/* Campo Nombre */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Nombre <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={values.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ej: Bodega Principal"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      {/* Botones */}
      <ModalActions
        onCancel={onCancel}
        confirmType="submit"
        confirmText={isEditing ? 'Actualizar' : 'Crear Bodega'}
        isLoading={isSubmitting}
        loadingText={isEditing ? 'Actualizando...' : 'Creando...'}
        confirmVariant="primary"
      />
    </form>
  );
};
