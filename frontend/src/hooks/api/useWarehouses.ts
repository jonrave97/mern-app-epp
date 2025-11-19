import { useState, useEffect } from 'react';
import { getWarehouses } from '../../services/warehouseService';

export const useWarehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const data = await getWarehouses();
        if (data.success) {
          setWarehouses(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchWarehouses();
  }, []);

  return { warehouses, loading, error };
};
