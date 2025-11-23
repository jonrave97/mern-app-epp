import { useForm } from '@hooks/form/useForm';

interface AreaFormData {
  name: string;
  costCenter: string;
}

interface AreaFormProps {
  onSubmit: (data: AreaFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: AreaFormData;
  isEditing?: boolean;
}

export const AreaForm = ({ onSubmit, onCancel, initialData, isEditing = false }: AreaFormProps) => {
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
      costCenter: initialData?.costCenter || ''
    },
    validationRules: {
      name: {
        required: true,
        minLength: 2,
        maxLength: 100,
      },
      costCenter: {
        required: true,
        pattern: /^[A-Z]{2}_\d{4}$/,
      }
    },
    onSubmit: async (data) => {
      await onSubmit({
        name: data.name,
        costCenter: data.costCenter
      });
    },
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nombre del Área */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del Área *
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={values.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Ej: Operaciones, Administración"
        />
        {touched.name && errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Centro de Costo */}
      <div>
        <label htmlFor="costCenter" className="block text-sm font-medium text-gray-700 mb-1">
          Centro de Costo *
        </label>
        <input
          id="costCenter"
          type="text"
          name="costCenter"
          value={values.costCenter}
          onChange={(e) => handleChange('costCenter', e.target.value)}
          onBlur={() => handleBlur('costCenter')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Ej: CL_0001, US_1234"
        />
        {touched.costCenter && errors.costCenter && (
          <p className="mt-1 text-sm text-red-600">Formato: 2 letras mayúsculas, guión bajo y 4 dígitos (Ej: CL_0001)</p>
        )}
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition disabled:opacity-50"
        >
          {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'} Área
        </button>
      </div>
    </form>
  );
};
