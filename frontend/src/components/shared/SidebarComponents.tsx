import type { ReactNode } from 'react';

/**
 * Componente para items simples del sidebar (ej: Dashboard, Warehouse)
 */
interface SidebarLinkProps {
  icon: ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
  badge?: string;
}

export function SidebarLink({
  icon,
  label,
  href = '#',
  onClick,
  isActive = false,
  badge,
}: SidebarLinkProps) {
  const Element = onClick ? 'button' : 'a';
  const className =
    'flex items-center w-full px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group transition-all duration-200 active:scale-95 active:bg-neutral-tertiary cursor-pointer transform hover:scale-[1.02]' +
    (isActive ? ' bg-neutral-tertiary text-fg-brand' : '');

  return (
    <li className="px-3 mb-0 hover:rounded-base transition border border-transparent hover:border-gray-200">
      <Element
        {...(onClick ? { type: 'button', onClick } : { href })}
        className={className}
      >
        <div className="flex items-center flex-1 justify-between">
          <div className="flex items-center">
            {icon && (
              <div className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-fg-brand">
                {icon}
              </div>
            )}
            <span className="ms-3">{label}</span>
          </div>
          {badge && (
            <span className="bg-neutral-secondary-medium border border-default-medium text-heading text-xs font-medium px-1.5 py-0.5 rounded-sm">
              {badge}
            </span>
          )}
        </div>
      </Element>
    </li>
  );
}

/**
 * Componente para items expandibles del sidebar (ej: Users, Companies, EPPs)
 */
interface SidebarDropdownProps {
  icon: ReactNode;
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  chevron: ReactNode;
  children: ReactNode;
}

export function SidebarDropdown({
  icon,
  label,
  isOpen,
  onToggle,
  chevron,
  children,
}: SidebarDropdownProps) {
  return (
    <li className="px-3 mb-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center w-full justify-between px-2 pt-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group transition-all duration-200 active:scale-95 active:bg-neutral-secondary-medium cursor-pointer transform hover:scale-[1.02]"
        aria-expanded={isOpen}
      >
        <div className="flex items-center flex-1">
          <div className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-fg-brand">
            {icon}
          </div>
          <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
            {label}
          </span>
        </div>
        <div
          className={`w-5 h-5 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          {chevron}
        </div>
      </button>
      <ul
        className={`transition-all duration-700 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } py-2 space-y-2`}
      >
        {children}
      </ul>
    </li>
  );
}

/**
 * Componente para items dentro de los dropdowns del sidebar
 */
interface SidebarDropdownItemProps {
  label: string;
  href: string;
  isActive?: boolean;
}

export function SidebarDropdownItem({
  label,
  href,
  isActive = false,
}: SidebarDropdownItemProps) {
  return (
    <li>
      <a
        href={href}
        className={
          'pl-10 flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group transition-all duration-200 active:scale-95 active:bg-neutral-secondary-medium cursor-pointer transform hover:scale-[1.02]' +
          (isActive ? ' bg-neutral-tertiary text-fg-brand' : '')
        }
      >
        {label}
      </a>
    </li>
  );
}
