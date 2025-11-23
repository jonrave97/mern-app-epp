import { useState } from 'react';

interface UseModalReturn<T> {
  isOpen: boolean;
  selectedItem: T | null;
  open: (item?: T) => void;
  close: () => void;
}

export const useModal = <T = unknown>(): UseModalReturn<T> => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const open = (item?: T) => {
    if (item) {
      setSelectedItem(item);
    }
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setSelectedItem(null);
  };

  return {
    isOpen,
    selectedItem,
    open,
    close,
  };
};
