import type { SVGProps } from 'react';

interface CheckCircleProps extends SVGProps<SVGSVGElement> {
  /** Tamaño del icono */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Color del icono */
  color?: string;
  /** Clase personalizada (opcional) */
  className?: string;
}

/**
 * CheckCircle - Icono de círculo con palomita
 * 
 * Icono reutilizable que representa un check en un círculo.
 * Soporta múltiples tamaños y colores.
 * 
 * @example
 * <CheckCircle size="lg" color="text-green-600" />
 * <CheckCircle size="md" className="text-green-500" />
 */
export const CheckCircle = ({
  size = 'md',
  color = 'text-green-600',
  className = '',
  ...props
}: CheckCircleProps) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  };

  return (
    <svg
      className={`${sizeMap[size]} ${color} ${className}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
};
