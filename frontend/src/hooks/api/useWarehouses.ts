import { useState, useEffect } from 'react';
import { getWarehouses } from '../../services/warehouseService';

interface Warehouse {
  _id: string;
  code: string;
  name: string;
  disabled: boolean;
  __v: number;
}

export const useWarehouses = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const data = await getWarehouses();
        console.log("📦 Estructura de data:", data);
        if(Array.isArray(data))
        {
          setWarehouses(data);
        }else{
          setError('Error: Formato de datos inválido');
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
