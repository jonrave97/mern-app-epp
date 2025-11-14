import { useEffect } from "react";

// Hook para establecer el título de la página
export const usePageTitle = (title: string) => {
    // Actualiza el título del documento cuando el componente se monta o el título cambia
    useEffect(() => {   
        // Establece el título de la página
        document.title = 'Kalepp | ' + title;
    }, [title]);
};