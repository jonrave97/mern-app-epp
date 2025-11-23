import { useState } from 'react';

interface Option {
  value: string;
  label: string;
  subtitle?: string;
}

interface MultiCheckboxSelectProps {
  options: Option[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  loading?: boolean;
}

export function MultiCheckboxSelect({
  options,
  value,
  onChange,
  placeholder = 'Seleccionar opciones...',
  loading = false,
}: MultiCheckboxSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCheckboxChange = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const selectedLabels = options
    .filter(opt => value.includes(opt.value))
    .map(opt => opt.label)
    .join(', ');

  return (
    <div className="relative">
      {/* Botón que muestra seleccionados */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-left focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
      >
        <div className="flex items-center justify-between">
          <span className={selectedLabels ? 'text-gray-900' : 'text-gray-500'}>
            {selectedLabels || placeholder}
          </span>
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </button>

      {/* Dropdown con checkboxes */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl">
          <div className="max-h-96 overflow-y-auto min-h-64">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Cargando...</div>
            ) : options.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No hay opciones disponibles</div>
            ) : (
              options.map(option => (
                <label
                  key={option.value}
                  className="flex items-start px-4 py-4 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={value.includes(option.value)}
                    onChange={() => handleCheckboxChange(option.value)}
                    className="mt-1 rounded cursor-pointer w-4 h-4"
                  />
                  <div className="ml-3 flex-1">
                    <p className="text-gray-900 font-medium text-sm">{option.label}</p>
                    {option.subtitle && (
                      <p className="text-xs text-gray-500 mt-0.5">{option.subtitle}</p>
                    )}
                  </div>
                </label>
              ))
            )}
          </div>

          {/* Botones de acción */}
          <div className="border-t border-gray-100 p-3 flex gap-2 bg-gray-50">
            <button
              type="button"
              onClick={() => onChange([])}
              className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded transition"
            >
              Limpiar
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 px-3 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded transition"
            >
              Listo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
