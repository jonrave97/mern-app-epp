import { useState, useEffect, useRef } from 'react';

export default function Navbar({ sidebarOpen, setSidebarOpen }: { sidebarOpen: boolean; setSidebarOpen: (open: boolean) => void }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <nav className="fixed top-0 z-50 w-full bg-neutral-primary-soft bg-primary border-gray-300 shadow-lg">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start rtl:justify-end">
            <button
              onClick={toggleSidebar}
              type="button"
              className="sm:hidden text-heading bg-transparent box-border border border-transparent hover:bg-neutral-secondary-medium focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 rounded-base text-sm p-2 focus:outline-none"
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6"
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
                  strokeWidth="2"
                  d="M5 7h14M5 12h14M5 17h10"
                />
              </svg>
            </button>
            <a href="/" className="flex ms-10 md:me-24">
              <img
                src="/kaltire.png"
                className="h-6 me-3"
                alt="Kaltire Logo"
              />
            </a>
          </div>
          <div className="flex items-center">
            <div className="flex items-center ms-3 relative" ref={dropdownRef}>
              <div>
                <button
                  type="button"
                  onClick={toggleDropdown}
                  className="flex text-sm bg-gray-800 rounded-full focus:ring-2 focus:ring-gray-50"
                  aria-expanded={dropdownOpen}
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-8 h-8 rounded-full"
                    src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                    alt="user photo"
                  />
                </button>
              </div>
              <div
                className={`${dropdownOpen ? '' : 'hidden'} absolute top-full right-0 mt-2 bg-neutral-primary-medium border border-gray-200 rounded-md shadow-2xl w-44 bg-gray-50` }
              >
                <div
                  className="px-4 py-3 border-b border-default-medium"
                  role="none"
                >
                  <p className="text-sm font-medium text-heading" role="none">
                    Administrador
                  </p>
                  <p className="text-sm text-body truncate" role="none">
                    correo@correo.com
                  </p>
                </div>
                <ul className="py-2 px-0 text-sm text-body font-light" role="none">
                  <li className="hover:bg-gray-200 hover:font-medium transition border border-transparent hover:border-gray-200">
                    <a
                      href="#"
                      className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                      role="menuitem"
                    >
                      Dashboard
                    </a>
                  </li>
                  <li className='hover:bg-gray-200 hover:font-medium transition border border-transparent hover:border-gray-200'>
                    <a
                      href="#"
                      className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                      role="menuitem"
                    >
                      Settings
                    </a>
                  </li>
                  <li className='hover:bg-gray-200 hover:font-medium transition border border-transparent hover:border-gray-200'>
                    <a
                      href="#"
                      className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                      role="menuitem"
                    >
                      Earnings
                    </a>
                  </li>
                  <li className='hover:bg-gray-200 hover:font-medium transition border border-transparent hover:border-gray-200'>
                    <a
                      href="#"
                      className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                      role="menuitem"
                    >
                      Sign out
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
