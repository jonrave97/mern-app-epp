interface ModalActionsProps {
  onCancel: () => void;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
  confirmType?: 'submit' | 'button';
  isLoading?: boolean;
  loadingText?: string;
  confirmVariant?: 'primary' | 'danger' | 'success';
  showConfirm?: boolean;
}

export const ModalActions = ({
  onCancel,
  onConfirm,
  cancelText = 'Cancelar',
  confirmText = 'Confirmar',
  confirmType = 'button',
  isLoading = false,
  loadingText,
  confirmVariant = 'primary',
  showConfirm = true
}: ModalActionsProps) => {
  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-hover',
    danger: 'bg-red-600 hover:bg-red-700',
    success: 'bg-green-600 hover:bg-green-700'
  };

  return (
    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
      <button
        type="button"
        onClick={onCancel}
        disabled={isLoading}
        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
      >
        {cancelText}
      </button>
      
      {showConfirm && (
        <button
          type={confirmType}
          onClick={confirmType === 'button' ? onConfirm : undefined}
          disabled={isLoading}
          className={`px-6 py-2 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95 flex items-center gap-2 ${variantClasses[confirmVariant]}`}
        >
          {isLoading ? (
            <>
              <span className="animate-spin">⏳</span>
              {loadingText || confirmText}
            </>
          ) : (
            confirmText
          )}
        </button>
      )}
    </div>
  );
};
