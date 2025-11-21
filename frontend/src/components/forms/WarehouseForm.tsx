import { useState, useEffect } from 'react';

interface WarehouseFormProps {
  onSubmit: (data: { code: string; name: string }) => Promise<void>;
  onCancel: () => void;
  initialData?: { code: string; name: string };
  isEditing?: boolean;
}

export const WarehouseForm = ({ onSubmit, onCancel, initialData, isEditing = false }: WarehouseFormProps) => {
  const [formData, setFormData] = useState({
    code: initialData?.code || '',
    name: initialData?.name || ''
  });
  const [errors, setErrors] = useState<{ code?: string; name?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-limpiar errores después de 5 segundos
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const timer = setTimeout(() => {
        setErrors({});
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [errors]);

  const validate = () => {
    const newErrors: { code?: string; name?: string } = {};

    if (!formData.code.trim()) {
      newErrors.code = 'El código es obligatorio';
    } else if (formData.code.length < 2) {
      newErrors.code = 'El código debe tener al menos 2 caracteres';
    } else if (formData.code.length > 20) {
      newErrors.code = 'El código no puede exceder 20 caracteres';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    } else if (formData.name.length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    } else if (formData.name.length > 100) {
      newErrors.name = 'El nombre no puede exceder 100 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: 'code' | 'name', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo al escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

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
          value={formData.code}
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
          value={formData.name}
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
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin">⏳</span>
              {isEditing ? 'Actualizando...' : 'Creando...'}
            </>
          ) : (
            <>{isEditing ? 'Actualizar' : 'Crear Bodega'}</>
          )}
        </button>
      </div>
    </form>
  );
};
