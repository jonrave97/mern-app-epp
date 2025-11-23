import { useState, useEffect } from 'react';
import { useForm } from '@hooks/form/useForm';
import { ModalActions } from '@components/shared/ModalActions';
import { SearchableSelect } from '@components/shared/SearchableSelect';
import { MultiSearchableSelect } from '@components/shared/MultiSearchableSelect';
import { getCompanies } from '@services/companyService';
import { getAreas } from '@services/areaService';
import { getJefaturaUsers } from '@services/userService';

interface Company {
  _id: string;
  name: string;
  costCenter?: string;
  disabled?: boolean;
}

interface Area {
  _id: string;
  name: string;
  costCenter: string;
  disabled?: boolean;
}

interface JefaturaUser {
  _id: string;
  name: string;
  email: string;
  rol: string;
  disabled?: boolean;
}

interface UserFormProps {
  onSubmit: (data: { name: string; email: string; password?: string; rol?: string; company?: string; area?: string; costCenter?: string; approverIds?: string[] }) => Promise<void>;
  onCancel: () => void;
  initialData?: {
    name: string;
    email: string;
    rol?: string;
    company?: string;
    area?: string;
    costCenter?: string;
    approverIds?: string[];
  };
  isEditing?: boolean;
}

export function UserForm({ onSubmit, onCancel, initialData, isEditing = false }: UserFormProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loadingAreas, setLoadingAreas] = useState(true);
  const [jefaturaUsers, setJefaturaUsers] = useState<JefaturaUser[]>([]);
  const [loadingJefatura, setLoadingJefatura] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await getCompanies(1, 100);
        if (response.data) {
          setCompanies(response.data.filter((company: Company) => !company.disabled));
        }
      } catch (error) {
        console.error('Error al cargar empresas:', error);
      } finally {
        setLoadingCompanies(false);
      }
    };

    const fetchAreas = async () => {
      try {
        const response = await getAreas(1, 100);
        if (response.areas) {
          setAreas(response.areas.filter((area: Area) => !area.disabled));
        }
      } catch (error) {
        console.error('Error al cargar áreas:', error);
      } finally {
        setLoadingAreas(false);
      }
    };

    const fetchJefaturaUsers = async () => {
      try {
        const response = await getJefaturaUsers();
        if (response.users) {
          // Filtrar solo usuarios activos (disabled !== true)
          setJefaturaUsers(response.users.filter((user: JefaturaUser) => !user.disabled));
        }
      } catch (error) {
        console.error('Error al cargar usuarios de jefatura:', error);
      } finally {
        setLoadingJefatura(false);
      }
    };

    fetchCompanies();
    fetchAreas();
    fetchJefaturaUsers();
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
      email: initialData?.email || '',
      password: '',
      rol: initialData?.rol || 'usuario',
      company: initialData?.company || '',
      area: initialData?.area || '',
      costCenter: initialData?.costCenter || '',
      approverIds: initialData?.approverIds || [],
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
      const submitData: { name: string; email: string; password?: string; rol?: string; company?: string; area?: string; costCenter?: string; approverIds?: string[] } = {
        name: data.name,
        email: data.email,
        rol: data.rol,
        company: data.company,
        area: data.area,
        costCenter: data.costCenter,
        approverIds: data.approverIds && data.approverIds.length > 0 ? data.approverIds : undefined,
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

      {/* Empresa */}
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
          Empresa
        </label>
        <SearchableSelect
          options={companies.map(company => ({
            value: company.name,
            label: company.name
          }))}
          value={values.company}
          onChange={(value) => handleChange('company', value)}
          onBlur={() => handleBlur('company')}
          placeholder="Seleccionar empresa"
          loading={loadingCompanies}
        />
      </div>

      {/* Área */}
      <div>
        <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
          Área
        </label>
        <SearchableSelect
          options={areas.map(area => ({
            value: area.name,
            label: area.name,
            subtitle: area.costCenter
          }))}
          value={values.area}
          onChange={(value) => {
            const selectedArea = areas.find(area => area.name === value);
            handleChange('area', value);
            if (selectedArea) {
              handleChange('costCenter', selectedArea.costCenter);
            } else {
              handleChange('costCenter', '');
            }
          }}
          onBlur={() => handleBlur('area')}
          placeholder="Seleccionar área"
          loading={loadingAreas}
        />
      </div>

      {/* Centro de Costo (readonly, se actualiza automáticamente) */}
      <div>
        <label htmlFor="costCenter" className="block text-sm font-medium text-gray-700 mb-1">
          Centro de Costo
        </label>
        <input
          type="text"
          id="costCenter"
          value={values.costCenter}
          readOnly
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
          placeholder="Se asigna automáticamente al seleccionar área"
        />
        <p className="mt-1 text-xs text-gray-500">Se asigna automáticamente al seleccionar un área</p>
      </div>

      {/* Jefatura/Aprobadores (múltiples) */}
      <div>
        <label htmlFor="approverIds" className="block text-sm font-medium text-gray-700 mb-1">
          Jefatura/Aprobadores
        </label>
        <MultiSearchableSelect
          options={jefaturaUsers.map(user => ({
            value: user._id,
            label: user.name,
            subtitle: user.email
          }))}
          value={values.approverIds as string[]}
          onChange={(values) => handleChange('approverIds', values)}
          onBlur={() => handleBlur('approverIds')}
          placeholder="Seleccionar jefaturas (puede seleccionar múltiples)"
          loading={loadingJefatura}
        />
        <p className="mt-1 text-xs text-gray-500">Selecciona uno o más usuarios con rol de jefatura que aprobarán a este usuario</p>
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
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
