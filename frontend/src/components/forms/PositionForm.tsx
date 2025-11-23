import { useState, useEffect } from 'react';
import { useForm } from '@hooks/form/useForm';
import { ModalActions } from '@components/shared/ModalActions';
import { getEpps } from '@services/eppService';
import type { Epp } from '../../types/epp';

interface PositionFormData {
  name: string;
  epps: string[];
}

interface PositionFormProps {
  onSubmit: (data: PositionFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: PositionFormData;
  isEditing?: boolean;
}

export const PositionForm = ({ onSubmit, onCancel, initialData, isEditing = false }: PositionFormProps) => {
  const [availableEpps, setAvailableEpps] = useState<Epp[]>([]);
  const [loadingEpps, setLoadingEpps] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEpps = async () => {
      try {
        const response = await getEpps(1, 1000); // Obtener todos los EPPs
        if (response.epps) {
          setAvailableEpps(response.epps.filter((epp: Epp) => !epp.disabled));
        }
      } catch (error) {
        console.error('Error al cargar EPPs:', error);
      } finally {
        setLoadingEpps(false);
      }
    };

    fetchEpps();
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
      name: initialData?.name || '',
      epps: initialData?.epps || []
    },
    validationRules: {
      name: {
        required: true,
        minLength: 2,
        maxLength: 100,
      }
    },
    onSubmit: async (data) => {
      await onSubmit({
        name: data.name,
        epps: data.epps
      });
    },
  });

  const handleEppToggle = (eppId: string) => {
    const currentEpps = values.epps as string[];
    const newEpps = currentEpps.includes(eppId)
      ? currentEpps.filter(id => id !== eppId)
      : [...currentEpps, eppId];
    handleChange('epps', newEpps);
  };

  // Filtrar EPPs por término de búsqueda
  const filteredEpps = availableEpps.filter(epp => 
    epp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    epp.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nombre de la Posición */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de la Posición <span className="text-red-500">*</span>
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
          placeholder="Ej: Operador de Planta, Supervisor de Área"
        />
        {touched.name && errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Selección de EPPs */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          EPPs Asignados ({(values.epps as string[]).length} seleccionados)
        </label>
        
        {/* Input de búsqueda */}
        <input
          type="text"
          placeholder="Buscar EPPs por nombre o código..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
        
        {loadingEpps ? (
          <p className="text-gray-500">Cargando EPPs...</p>
        ) : (
          <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
            {filteredEpps.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                {searchTerm ? 'No se encontraron EPPs' : 'No hay EPPs disponibles'}
              </p>
            ) : (
              filteredEpps.map((epp) => (
                <label
                  key={epp._id}
                  className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={(values.epps as string[]).includes(epp._id)}
                    onChange={() => handleEppToggle(epp._id)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <div className="ml-3">
                    <span className="text-gray-900 font-medium">{epp.name}</span>
                    <span className="text-gray-500 text-sm ml-2">({epp.code})</span>
                  </div>
                </label>
              ))
            )}
          </div>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Selecciona los EPPs que deben asignarse a esta posición
        </p>
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
