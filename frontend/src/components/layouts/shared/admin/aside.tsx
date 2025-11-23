import {
  WarehouseIcon,
  DashboardIcon,
  UsersIcon,
  EppsIcon,
  ChevronDownIcon,
  CompanyIcon,
} from "@components/icons/index";
import { useDropdowns } from "@hooks/ui/useDropdowns";

export default function Aside({ sidebarOpen }: { sidebarOpen: boolean }) {
  const { openDropdowns, toggleDropdown } = useDropdowns({
    users: false,
    companies: false,
    epps: false,
    ecommerce: false,
  });

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-full transition-transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } sm:translate-x-0`}
      aria-label="Sidebar"
    >
      <div className="h-full  pt-4 overflow-y-auto bg-neutral-primary-soft border border-gray-300 shadow-2xl ">
        <ul className="space-y-2 font-medium">
          <li className="px-3 pt-20  hover:rounded-base transition border border-transparent hover:border-gray-200">
            <a
              href="#"
              className="flex items-center px-2 py-1.5 text-body rounded-base hover:text-fg-brand group transition-all duration-200 active:scale-95 active:bg-neutral-tertiary cursor-pointer transform hover:scale-[1.02]"
            >
              <DashboardIcon className="w-5 h-5 transition duration-75 group-hover:text-fg-brand" />
              <span className="ms-3">Dashboard</span>
            </a>
          </li>
          <li className="px-3 mb-0">
            <button
              type="button"
              onClick={() => toggleDropdown('users')}
              className="flex items-center w-full justify-between px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group transition-all duration-200 active:scale-95 active:bg-neutral-secondary-medium cursor-pointer transform hover:scale-[1.02]"
              aria-expanded={openDropdowns.users}
            >
              <UsersIcon className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-fg-brand" />
              <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                Users
              </span>
              <ChevronDownIcon
                className={`w-5 h-5 transition-transform ${
                  openDropdowns.users ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul className={`transition-all duration-700 ease-in-out overflow-hidden ${
              openDropdowns.users ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            } py-2 space-y-2`}>
              <li>
                <a
                  href="/admin/users"
                  className="pl-10 flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group transition-all duration-200 active:scale-95 active:bg-neutral-secondary-medium cursor-pointer transform hover:scale-[1.02]"
                >
                  Lista de Usuarios</a>
              </li>
              <li>
                <a
                  href="/admin/users/create"
                  className="pl-10 flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group transition-all duration-200 active:scale-95 active:bg-neutral-secondary-medium cursor-pointer transform hover:scale-[1.02]"
                >
                  Crear Usuario
                </a>
              </li>
              <li>
                <a
                  href="/admin/permissions"
                  className="pl-10 flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group transition-all duration-200 active:scale-95 active:bg-neutral-secondary-medium cursor-pointer transform hover:scale-[1.02]"
                >
                  Gestionar Permisos
                </a>
              </li>
              <li>
                <a
                  href="/admin/positions"
                  className="pl-10 flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group transition-all duration-200 active:scale-95 active:bg-neutral-secondary-medium cursor-pointer transform hover:scale-[1.02]"
                >
                  Posiciones
                </a>
              </li>
            </ul>
          </li>
          <li className="px-3 hover:bg-gray-200 hover:rounded-base transition border border-transparent hover:border-gray-200">
            <a
              href="/admin/warehouses"
              className="flex items-center px-2 py-1.5 text-body rounded-base hover:text-fg-brand group transition-all duration-200 active:scale-95 active:bg-neutral-tertiary cursor-pointer transform hover:scale-[1.02]"
            >
              <WarehouseIcon className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-fg-brand" />
              <span className="flex-1 ms-3 whitespace-nowrap">Warehouse</span>
              <span className="bg-neutral-secondary-medium border border-default-medium text-heading text-xs font-medium px-1.5 py-0.5 rounded-sm">
                Pro
              </span>
            </a>
          </li>

          <li className="px-3 mb-0">
            <button
              type="button"
              onClick={() => toggleDropdown('companies')}
              className="flex items-center w-full justify-between px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group transition-all duration-200 active:scale-95 active:bg-neutral-secondary-medium cursor-pointer transform hover:scale-[1.02]"
              aria-expanded={openDropdowns.companies}
            >
              <CompanyIcon className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-fg-brand" />
              <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                Empresas
              </span>
              <ChevronDownIcon
                className={`w-5 h-5 transition-transform ${
                  openDropdowns.companies ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul className={`transition-all duration-700 ease-in-out overflow-hidden ${
              openDropdowns.companies ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            } py-2 space-y-2`}>
              <li>
                <a
                  href="/admin/companies"
                  className="pl-10 flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group transition-all duration-200 active:scale-95 active:bg-neutral-secondary-medium cursor-pointer transform hover:scale-[1.02]"
                >
                  Lista de Empresas
                </a>
              </li>
              <li>
                <a
                  href="/admin/areas"
                  className="pl-10 flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group transition-all duration-200 active:scale-95 active:bg-neutral-secondary-medium cursor-pointer transform hover:scale-[1.02]"
                >
                  Áreas
                </a>
              </li>
            </ul>
          </li>

          <li className="px-3 mb-0">
            <button
              type="button"
              onClick={() => toggleDropdown('epps')}
              className="flex items-center w-full justify-between px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group transition-all duration-200 active:scale-95 active:bg-neutral-secondary-medium cursor-pointer transform hover:scale-[1.02]"
              aria-expanded={openDropdowns.epps}
            >
              <EppsIcon className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-fg-brand" />
              <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                EPPs
              </span>
              <ChevronDownIcon
                className={`w-5 h-5 transition-transform ${
                  openDropdowns.epps ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul className={`transition-all duration-700 ease-in-out overflow-hidden ${
              openDropdowns.epps ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            } py-2 space-y-2`}>
              <li>
                <a
                  href="/admin/epps"
                  className="pl-10 flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group transition-all duration-200 active:scale-95 active:bg-neutral-secondary-medium cursor-pointer transform hover:scale-[1.02]"
                >
                  Lista de EPPs
                </a>
              </li>
              <li>
                <a
                  href="/admin/categories"
                  className="pl-10 flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group transition-all duration-200 active:scale-95 active:bg-neutral-secondary-medium cursor-pointer transform hover:scale-[1.02]"
                >
                  Categorías
                </a>
              </li>
            </ul>
          </li>

          <li className="px-3">
            <button
              type="button"
              onClick={() => toggleDropdown('ecommerce')}
              className="flex items-center w-full justify-between px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group transition-all duration-200 active:scale-95 active:bg-neutral-secondary-medium cursor-pointer transform hover:scale-[1.02]"
              aria-expanded={openDropdowns.ecommerce}
            >
              <svg
                className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-fg-brand"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"
                />
              </svg>
              <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                E-commerce
              </span>
              <ChevronDownIcon
                className={`w-5 h-5 transition-transform ${
                  openDropdowns.ecommerce ? "rotate-180" : ""
                }`}
              />
            </button>
            <ul className={`transition-all duration-700 ease-in-out overflow-hidden ${
              openDropdowns.ecommerce ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            } py-2 space-y-2`}>
              <li>
                <a
                  href="#"
                  className="pl-10 flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group transition-all duration-200 active:scale-95 active:bg-neutral-secondary-medium cursor-pointer transform hover:scale-[1.02]"
                >
                  Products
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="pl-10 flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group transition-all duration-200 active:scale-95 active:bg-neutral-secondary-medium cursor-pointer transform hover:scale-[1.02]"
                >
                  Billing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="pl-10 flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group transition-all duration-200 active:scale-95 active:bg-neutral-secondary-medium cursor-pointer transform hover:scale-[1.02]"
                >
                  Invoice
                </a>
              </li>
            </ul>
          </li>

          {/* <li className="px-3 hover:bg-gray-200 hover:rounded-xl transition border border-transparent hover:border-gray-200">
            <a
              href="#"
              className="flex items-center px-2 py-1.5 text-body rounded-base hover:text-fg-brand group"
            >
              <svg
                className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-fg-brand"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"
                />
              </svg>
              <span className="flex-1 ms-3 whitespace-nowrap">Sign In</span>
            </a>
          </li> */}
        </ul>
      </div>
    </aside>
  );
}
