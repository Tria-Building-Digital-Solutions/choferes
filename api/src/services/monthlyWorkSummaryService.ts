import { MonthlyWorkSummary } from '../models/MonthlyWorkSummary';

export const createMonthlyWorkSummary = async (data: { month: number; year: number; totalHours: number }) => {
  return MonthlyWorkSummary.create(data);
};

export const getAllMonthlyWorkSummaries = async () => {
  return MonthlyWorkSummary.findAll();
};

export const getMonthlyWorkSummaryById = async (id: number) => {
  return MonthlyWorkSummary.findByPk(id);
};

export const updateMonthlyWorkSummary = async (
  id: number,
  data: { month?: number; year?: number; totalHours?: number }
) => {
  await MonthlyWorkSummary.update(data, { where: { id } });
  return MonthlyWorkSummary.findByPk(id);
};

export const deleteMonthlyWorkSummary = async (id: number) => {
  return MonthlyWorkSummary.destroy({ where: { id } });
};
