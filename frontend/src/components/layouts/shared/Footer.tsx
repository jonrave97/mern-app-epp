export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appName = import.meta.env.VITE_APP_NAME || 'Sistema EPP';
  const appVersion = import.meta.env.VITE_VERSION || '1.0.0';

  return (
    <footer className="mt-8 border-t border-gray-200 bg-white">
      <div className="px-6 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-600">
          <p>
            © {currentYear} <span className="font-semibold text-primary">{appName}</span>. 
            Todos los derechos reservados.
          </p>
          <p className="text-gray-500">
            Versión {appVersion}
          </p>
        </div>
      </div>
    </footer>
  );
}   