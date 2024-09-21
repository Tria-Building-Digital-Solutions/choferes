import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

interface Identifiable {
  id: number; 
}

const useApi = <T extends Identifiable>(url: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<T[]>(url);
      setData(response.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [url]); 

  const createData = async (newData: T) => {
    setLoading(true);
    try {
      const response = await api.post<T>(url, newData);
      setData((prevData) => [...prevData, response.data]);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const updateData = async (id: number, updatedData: Partial<T>) => {
    setLoading(true);
    try {
      const response = await api.put<T>(`${url}/${id}`, updatedData);
      setData((prevData) =>
        prevData.map((item) => (item.id === id ? response.data : item))
      );
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const deleteData = async (id: number) => {
    setLoading(true);
    try {
      await api.delete(`${url}/${id}`);
      setData((prevData) => prevData.filter((item) => item.id !== id));
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); 
  }, [fetchData]); 

  return { data, loading, error, createData, updateData, deleteData };
};

export default useApi;
