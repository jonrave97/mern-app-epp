import { useState, useEffect } from 'react';
import { getUsers } from '../services/userService';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        if (data.success) {
          setUsers(data.data);
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

    fetchUsers();
  }, []);

  return { users, loading, error };
};
