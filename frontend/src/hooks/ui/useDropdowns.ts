import { useState } from 'react';

export const useDropdowns = (initialState: { [key: string]: boolean }) => {
  const [openDropdowns, setOpenDropdowns] = useState(initialState);

  const toggleDropdown = (key: string) => {
    setOpenDropdowns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const closeAll = () => {
    const allClosed = Object.keys(openDropdowns).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {} as { [key: string]: boolean });
    setOpenDropdowns(allClosed);
  };

  const isOpen = (key: string) => openDropdowns[key] || false;

  return { openDropdowns, toggleDropdown, closeAll, isOpen };
};
