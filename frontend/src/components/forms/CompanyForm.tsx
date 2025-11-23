import { useForm } from '@hooks/form/useForm';
import { ModalActions } from '@components/shared/ModalActions';

interface CompanyFormProps {
  onSubmit: (data: { name: string }) => Promise<void>;
  onCancel: () => void;
  initialData?: {
    name: string;
  };
  isEditing?: boolean;
}

export function CompanyForm({ onSubmit, onCancel, initialData, isEditing = false }: CompanyFormProps) {
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
    },
    validationRules: {
      name: {
        required: true,
        minLength: 2,
        maxLength: 100,
      },
    },
    onSubmit: async (data) => {
      await onSubmit({
        name: data.name,
      });
    },
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nombre */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de la Empresa <span className="text-red-500">*</span>
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
          placeholder="Ej: Kal Tire Mining"
        />
        {touched.name && errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
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
