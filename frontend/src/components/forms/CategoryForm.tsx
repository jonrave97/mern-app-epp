import { useForm } from '@hooks/form/useForm';
import { ModalActions } from '@components/shared/ModalActions';

interface CategoryFormData {
  name: string;
  description: string;
}

interface CategoryFormProps {
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: CategoryFormData;
  isEditing?: boolean;
}

export const CategoryForm = ({ onSubmit, onCancel, initialData, isEditing = false }: CategoryFormProps) => {
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
      description: initialData?.description || ''
    },
    validationRules: {
      name: {
        required: true,
        minLength: 2,
        maxLength: 50,
      },
      description: {
        maxLength: 200,
      }
    },
    onSubmit: async (data) => {
      await onSubmit({
        name: data.name.toUpperCase(),
        description: data.description
      });
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
          id="name"
          type="text"
          name="name"
          value={values.name}
          onChange={(e) => handleChange('name', e.target.value.toUpperCase())}
          onBlur={() => handleBlur('name')}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            touched.name && errors.name
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-gray-300'
          }`}
          placeholder="Ej: CASCO, GUANTES, CALZADO"
        />
        {touched.name && errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">Se convertirá automáticamente a mayúsculas</p>
      </div>

      {/* Descripción */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={values.description}
          onChange={(e) => handleChange('description', e.target.value)}
          onBlur={() => handleBlur('description')}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            touched.description && errors.description
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-gray-300'
          }`}
          placeholder="Descripción opcional de la categoría"
        />
        {touched.description && errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
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
};
