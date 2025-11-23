import { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
  subtitle?: string;
}

interface MultiSearchableSelectProps {
  options: Option[];
  value: string[]; // Array de IDs seleccionados
  onChange: (values: string[]) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  maxSelections?: number;
}

export const MultiSearchableSelect = ({
  options,
  value = [],
  onChange,
  onBlur,
  placeholder = 'Seleccionar...',
  disabled = false,
  loading = false,
  className = '',
  maxSelections,
}: MultiSearchableSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filtrar opciones basado en búsqueda y excluir seleccionadas
  const filteredOptions = options.filter(option =>
    !value.includes(option.value) &&
    (option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (option.subtitle && option.subtitle.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  // Obtener labels de opciones seleccionadas
  const selectedOptions = options.filter(opt => value.includes(opt.value));

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        onBlur?.();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onBlur]);

  const handleSelect = (optionValue: string) => {
    if (maxSelections && value.length >= maxSelections) {
      return;
    }
    const newValues = [...value, optionValue];
    onChange(newValues);
    setSearchTerm('');
    inputRef.current?.focus();
  };

  const handleRemove = (optionValue: string) => {
    const newValues = value.filter(v => v !== optionValue);
    onChange(newValues);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Input display con tags */}
      <div
        onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
        className={`w-full px-4 py-2 border rounded-lg cursor-pointer flex items-center flex-wrap gap-2 ${
          disabled || loading
            ? 'bg-gray-100 cursor-not-allowed'
            : 'bg-white hover:border-gray-400'
        } ${isOpen ? 'ring-2 ring-gray-300 border-gray-300' : 'border-gray-300'}`}
        style={{ minHeight: '42px' }}
      >
        {selectedOptions.length > 0 ? (
          selectedOptions.map(option => (
            <div
              key={option.value}
              className="bg-primary text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              <span>{option.label}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(option.value);
                }}
                className="hover:opacity-70 transition"
              >
                ✕
              </button>
            </div>
          ))
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
      </div>

      {/* Search input cuando está abierto */}
      {isOpen && !disabled && !loading && (
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="absolute top-0 left-0 right-0 px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-gray-300 z-10"
          autoFocus
        />
      )}

      {/* Dropdown list */}
      {isOpen && !disabled && !loading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map(option => (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 transition"
              >
                <div className="font-medium text-gray-900">{option.label}</div>
                {option.subtitle && (
                  <div className="text-sm text-gray-500">{option.subtitle}</div>
                )}
              </div>
            ))
          ) : (
            <div className="px-4 py-4 text-center text-gray-500 text-sm">
              {value.length > 0 && maxSelections && value.length >= maxSelections
                ? `Límite máximo de ${maxSelections} selecciones alcanzado`
                : 'No hay opciones disponibles'}
            </div>
          )}
        </div>
      )}

      {loading && (
        <div className="absolute top-0 right-0 h-full flex items-center pr-4">
          <div className="animate-spin">⟳</div>
        </div>
      )}
    </div>
  );
};
