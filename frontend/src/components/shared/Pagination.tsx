interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  onNext,
  onPrev
}: PaginationProps) => {
  // Si solo hay 1 página, no mostrar paginación
  if (totalPages <= 1) return null;

  // Calcular qué páginas mostrar (máximo 5 números)
  const getPageNumbers = () => {
    const maxVisible = 5;
    const pages: number[] = [];

    if (totalPages <= maxVisible) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas alrededor de la actual
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);

      // Ajustar si estamos cerca del inicio
      if (currentPage <= 3) {
        end = maxVisible;
      }

      // Ajustar si estamos cerca del final
      if (currentPage >= totalPages - 2) {
        start = totalPages - maxVisible + 1;
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-6 flex items-center justify-between bg-white px-6 py-4 rounded-lg shadow">
      {/* Información de página */}
      <div className="text-sm text-gray-700">
        Mostrando página <span className="font-medium">{currentPage}</span> de{' '}
        <span className="font-medium">{totalPages}</span>
        {' '}({totalItems} {totalItems === 1 ? 'elemento' : 'elementos'} en total)
      </div>

      {/* Botones de navegación */}
      <div className="flex gap-2">
        {/* Botón Anterior */}
        <button
          onClick={onPrev}
          disabled={!hasPrevPage}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            hasPrevPage
              ? 'bg-primary text-white hover:bg-primary-hover cursor-pointer'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          aria-label="Página anterior"
        >
          ← Anterior
        </button>

        {/* Números de página */}
        <div className="flex gap-1">
          {/* Primera página si no está visible */}
          {pageNumbers[0] > 1 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="px-3 py-2 rounded-lg font-medium transition bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                1
              </button>
              {pageNumbers[0] > 2 && (
                <span className="px-3 py-2 text-gray-500">...</span>
              )}
            </>
          )}

          {/* Páginas visibles */}
          {pageNumbers.map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 rounded-lg font-medium transition ${
                currentPage === page
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-label={`Ir a página ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          ))}

          {/* Última página si no está visible */}
          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <span className="px-3 py-2 text-gray-500">...</span>
              )}
              <button
                onClick={() => onPageChange(totalPages)}
                className="px-3 py-2 rounded-lg font-medium transition bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {/* Botón Siguiente */}
        <button
          onClick={onNext}
          disabled={!hasNextPage}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            hasNextPage
              ? 'bg-primary text-white hover:bg-primary-hover cursor-pointer'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          aria-label="Página siguiente"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
};
