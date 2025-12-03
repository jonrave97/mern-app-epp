import {
  WarehouseIcon,
  DashboardIcon,
  UsersIcon,
  EppsIcon,
  ChevronDownIcon,
  CompanyIcon,
} from "@components/icons/index";
import { useDropdowns } from "@hooks/ui/useDropdowns";
import { SidebarLink, SidebarDropdown, SidebarDropdownItem } from "@components/shared/SidebarComponents";

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
          <li className="px-3 pt-20"></li>
          <SidebarLink
            icon={<DashboardIcon className="w-5 h-5" />}
            label="Dashboard"
            href="#"
          />

          <SidebarDropdown
            icon={<UsersIcon className="w-5 h-5" />}
            label="Users"
            isOpen={openDropdowns.users}
            onToggle={() => toggleDropdown('users')}
            chevron={<ChevronDownIcon className="w-5 h-5" />}
          >
            <SidebarDropdownItem label="Lista de Usuarios" href="/admin/users" />
            <SidebarDropdownItem label="Gestionar Permisos" href="/admin/permissions" />
            <SidebarDropdownItem label="Posiciones" href="/admin/positions" />
          </SidebarDropdown>

          <SidebarLink
            icon={<WarehouseIcon className="w-5 h-5" />}
            label="Warehouse"
            href="/admin/warehouses"
            badge="Pro"
          />

          <SidebarDropdown
            icon={<CompanyIcon className="w-5 h-5" />}
            label="Empresas"
            isOpen={openDropdowns.companies}
            onToggle={() => toggleDropdown('companies')}
            chevron={<ChevronDownIcon className="w-5 h-5" />}
          >
            <SidebarDropdownItem label="Lista de Empresas" href="/admin/companies" />
            <SidebarDropdownItem label="Áreas" href="/admin/areas" />
          </SidebarDropdown>

          <SidebarDropdown
            icon={<EppsIcon className="w-5 h-5" />}
            label="EPPs"
            isOpen={openDropdowns.epps}
            onToggle={() => toggleDropdown('epps')}
            chevron={<ChevronDownIcon className="w-5 h-5" />}
          >
            <SidebarDropdownItem label="Lista de EPPs" href="/admin/epps" />
            <SidebarDropdownItem label="Categorías" href="/admin/categories" />
          </SidebarDropdown>
        </ul>
      </div>
    </aside>
  );
}
