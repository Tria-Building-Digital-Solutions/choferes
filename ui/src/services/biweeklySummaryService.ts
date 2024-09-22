import { BiweeklySummary } from "../models/BiweeklySummary";
import api from "./api";

export const fetchBiweeklySummaries = async () => {
  const response = await api.get("/api/biweekly-summary");
  return response.data;
};

export const addBiweeklySummary = async (
  newBiweeklySummary: BiweeklySummary
) => {
  await api.post("/api/biweekly-summary", newBiweeklySummary);
};

export const updateBiweeklySummary = async (
  id: number,
  updatedBiweeklySummary: Partial<BiweeklySummary>
) => {
  await api.put(`/api/biweekly-summary/${id}`, updatedBiweeklySummary);
};

export const deleteBiweeklySummary = async (id: number) => {
  await api.delete(`/api/biweekly-summary/${id}`);
};
