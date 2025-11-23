import { useState } from 'react';

/**
 * Valor de retorno del hook useCrudActions
 */
interface UseCrudActionsReturn {
  /** Mensaje de error actual (null si no hay error) */
  actionError: string | null;
  /** Mensaje de éxito actual (null si no hay mensaje) */
  successMessage: string | null;
  /** Establece manualmente un mensaje de error */
  setActionError: (error: string | null) => void;
  /** Establece manualmente un mensaje de éxito */
  setSuccessMessage: (message: string | null) => void;
  /** Limpia ambos mensajes (error y éxito) */
  clearMessages: () => void;
  /** Maneja errores de operaciones CRUD extrayendo el mensaje del backend */
  handleError: (error: unknown, defaultMessage?: string) => void;
  /** Muestra un mensaje de éxito temporal que se auto-oculta */
  handleSuccess: (message: string, duration?: number) => void;
}

/**
 * Hook reutilizable para manejar mensajes de error y éxito en operaciones CRUD
 * 
 * Centraliza la lógica de feedback al usuario, evitando duplicar código en cada página.
 * Maneja automáticamente errores de Axios y mensajes de éxito con auto-ocultación.
 * 
 * @returns {UseCrudActionsReturn} Objeto con estados de mensajes y funciones de manejo
 * 
 * @example
 * ```tsx
 * const { actionError, successMessage, clearMessages, handleError, handleSuccess } = useCrudActions();
 * 
 * const handleCreate = async (data) => {
 *   clearMessages(); // Limpiar mensajes anteriores
 *   try {
 *     await createItem(data);
 *     handleSuccess('Item creado exitosamente'); // Auto-oculta en 3 segundos
 *   } catch (error) {
 *     handleError(error, 'Error al crear item'); // Extrae mensaje del backend
 *   }
 * };
 * 
 * return (
 *   <>
 *     {actionError && <div className="error">{actionError}</div>}
 *     {successMessage && <div className="success">{successMessage}</div>}
 *   </>
 * );
 * ```
 */
export const useCrudActions = (): UseCrudActionsReturn => {
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Limpia todos los mensajes (error y éxito)
   * Útil antes de ejecutar una nueva operación CRUD
   */
  const clearMessages = () => {
    setActionError(null);
    setSuccessMessage(null);
  };

  /**
   * Maneja errores de operaciones CRUD
   * Extrae automáticamente el mensaje de error desde la respuesta de Axios
   * 
   * @param error - Error capturado (generalmente de Axios)
   * @param defaultMessage - Mensaje por defecto si no se encuentra mensaje en el error
   */
  const handleError = (error: unknown, defaultMessage: string = 'Error en la operación') => {
    const err = error as { response?: { data?: { message?: string } } };
    setActionError(err.response?.data?.message || defaultMessage);
  };

  /**
   * Muestra un mensaje de éxito temporal
   * El mensaje se auto-oculta después del tiempo especificado
   * 
   * @param message - Mensaje de éxito a mostrar
   * @param duration - Duración en milisegundos antes de ocultar (por defecto 3000ms)
   */
  const handleSuccess = (message: string, duration: number = 3000) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), duration);
  };

  return {
    actionError,
    successMessage,
    setActionError,
    setSuccessMessage,
    clearMessages,
    handleError,
    handleSuccess,
  };
};
