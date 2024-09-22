import { WeeklySummary } from "../models/WeeklySummary";
import api from "./api";

export const fetchWeeklySummaries = async () => {
  const response = await api.get("/api/weekly-summary");
  return response.data;
};

export const addWeeklySummary = async (newWeeklySummary: WeeklySummary) => {
  await api.post("/api/weekly-summary", newWeeklySummary);
};

export const updateWeeklySummary = async (
  id: number,
  updatedWeeklySummary: Partial<WeeklySummary>
) => {
  await api.put(`/api/weekly-summary/${id}`, updatedWeeklySummary);
};

export const deleteWeeklySummary = async (id: number) => {
  await api.delete(`/api/weekly-summary/${id}`);
};
