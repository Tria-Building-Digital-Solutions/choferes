import { MonthlySummary } from "../models/MonthlySummary";
import api from "./api";

export const fetchMonthlySummaries = async () => {
  const response = await api.get("/api/monthly-summary");
  return response.data;
};

export const addMonthlySummary = async (newMonthlySummary: MonthlySummary) => {
  await api.post("/api/monthly-summary", newMonthlySummary);
};

export const updateMonthlySummary = async (
  id: number,
  updatedMonthlySummary: Partial<MonthlySummary>
) => {
  await api.put(`/api/monthly-summary/${id}`, updatedMonthlySummary);
};

export const deleteMonthlySummary = async (id: number) => {
  await api.delete(`/api/monthly-summary/${id}`);
};
