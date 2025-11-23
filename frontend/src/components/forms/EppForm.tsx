import { useState, useEffect } from 'react';
import { useForm } from '@hooks/form/useForm';
import { ModalActions } from '@components/shared/ModalActions';
import { SearchableSelect } from '@components/shared/SearchableSelect';
import { getCategories } from '@services/categoryService';
import type { Category } from '../../types/category';

interface EppFormData {
  code: string;
  name: string;
  price: number;
  category: string;
}

interface EppFormProps {
  onSubmit: (data: EppFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: EppFormData;
  isEditing?: boolean;
}

export const EppForm = ({ onSubmit, onCancel, initialData, isEditing = false }: EppFormProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories(1, 100);
        if (response.categories) {
          setCategories(response.categories.filter((category: Category) => !category.disabled));
        }
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

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
      code: initialData?.code || '',
      name: initialData?.name || '',
      price: initialData?.price || 0,
      category: initialData?.category || ''
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
      price: {
        required: true,
        min: 0,
        max: 999999.99,
      },
      category: {
        required: true,
        maxLength: 50,
      }
    },
    onSubmit: async (data) => {
      await onSubmit({
        code: data.code,
        name: data.name,
        price: Number(data.price),
        category: data.category
      });
    },
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Código */}
      <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
          Código <span className="text-red-500">*</span>
        </label>
        <input
          id="code"
          type="text"
          name="code"
          value={values.code}
          onChange={(e) => handleChange('code', e.target.value)}
          onBlur={() => handleBlur('code')}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            touched.code && errors.code
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-gray-300'
          }`}
          placeholder="Ej: CL_99_001"
        />
        {touched.code && errors.code && (
          <p className="mt-1 text-sm text-red-600">{errors.code}</p>
        )}
      </div>

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
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            touched.name && errors.name
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-gray-300'
          }`}
          placeholder="Ej: Casco de seguridad"
        />
        {touched.name && errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Precio */}
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
          Precio <span className="text-red-500">*</span>
        </label>
        <input
          id="price"
          type="number"
          name="price"
          min="0"
          max="999999.99"
          step="0.01"
          value={values.price}
          onChange={(e) => handleChange('price', Number(e.target.value))}
          onBlur={() => handleBlur('price')}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            touched.price && errors.price
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-gray-300'
          }`}
          placeholder="15000"
        />
        {touched.price && errors.price && (
          <p className="mt-1 text-sm text-red-600">{errors.price}</p>
        )}
      </div>

      {/* Categoría */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Categoría <span className="text-red-500">*</span>
        </label>
        <SearchableSelect
          options={categories.map(category => ({
            value: category.name,
            label: category.name,
            subtitle: category.description
          }))}
          value={values.category}
          onChange={(value) => handleChange('category', value)}
          onBlur={() => handleBlur('category')}
          placeholder="Seleccionar categoría"
          loading={loadingCategories}
        />
        {touched.category && errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category}</p>
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
