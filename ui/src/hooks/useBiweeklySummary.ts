import { useState, useEffect } from 'react';
import * as BiweeklySummaryService from '../services/biweeklySummaryService';
import { BiweeklySummary } from '../models/BiweeklySummary';

export const useBiweeklySummaries = () => {
  const [biweeklySummaries, setBiweeklySummaries] = useState<BiweeklySummary[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const fetchBiweeklySummaries = async () => {
    const data = await BiweeklySummaryService.fetchBiweeklySummaries();
    setBiweeklySummaries(data);
    setTotalCount(data.length);
  };

  const handleAddBiweeklySummary = async (newBiweeklySummary: BiweeklySummary) => {
    await BiweeklySummaryService.addBiweeklySummary(newBiweeklySummary);
    setBiweeklySummaries(prev => [...prev, newBiweeklySummary]);
    setTotalCount(prev => prev + 1);
  };

  const handleUpdateBiweeklySummary = async (id: number, updatedBiweeklySummary: Partial<BiweeklySummary>) => {
    await BiweeklySummaryService.updateBiweeklySummary(id, updatedBiweeklySummary);
    setBiweeklySummaries(prev =>
      prev.map(biweeklySummary => (biweeklySummary.id === id ? { ...biweeklySummary, ...updatedBiweeklySummary } : biweeklySummary))
    );
  };

  const handleDeleteBiweeklySummary = async (id: number) => {
    await BiweeklySummaryService.deleteBiweeklySummary(id);
    setBiweeklySummaries(prev => prev.filter(biweeklySummary => biweeklySummary.id !== id));
    setTotalCount(prev => prev - 1);
  };

  useEffect(() => {
    fetchBiweeklySummaries();
  }, []);

  return {
    biweeklySummaries,
    totalCount,
    fetchBiweeklySummaries,
    handleAddBiweeklySummary,
    handleUpdateBiweeklySummary,
    handleDeleteBiweeklySummary,
  };
};
