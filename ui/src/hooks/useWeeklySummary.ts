import { useState, useEffect } from 'react';
import * as WeeklySummaryService from '../services/weeklySummaryService';
import { WeeklySummary } from '../models/WeeklySummary';

export const useWeeklySummaries = () => {
  const [weeklySummaries, setWeeklySummaries] = useState<WeeklySummary[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const fetchWeeklySummaries = async () => {
    const data = await WeeklySummaryService.fetchWeeklySummaries();
    setWeeklySummaries(data);
    setTotalCount(data.length);
  };

  const handleAddWeeklySummary = async (newWeeklySummary: WeeklySummary) => {
    await WeeklySummaryService.addWeeklySummary(newWeeklySummary);
    setWeeklySummaries(prev => [...prev, newWeeklySummary]);
    setTotalCount(prev => prev + 1);
  };

  const handleUpdateWeeklySummary = async (id: number, updatedWeeklySummary: Partial<WeeklySummary>) => {
    await WeeklySummaryService.updateWeeklySummary(id, updatedWeeklySummary);
    setWeeklySummaries(prev =>
      prev.map(weeklySummary => (weeklySummary.id === id ? { ...weeklySummary, ...updatedWeeklySummary } : weeklySummary))
    );
  };

  const handleDeleteWeeklySummary = async (id: number) => {
    await WeeklySummaryService.deleteWeeklySummary(id);
    setWeeklySummaries(prev => prev.filter(weeklySummary => weeklySummary.id !== id));
    setTotalCount(prev => prev - 1);
  };

  useEffect(() => {
    fetchWeeklySummaries();
  }, []);

  return {
    weeklySummaries,
    totalCount,
    fetchWeeklySummaries,
    handleAddWeeklySummary,
    handleUpdateWeeklySummary,
    handleDeleteWeeklySummary,
  };
};
