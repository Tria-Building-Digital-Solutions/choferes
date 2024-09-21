import { HoursWorked } from '../models/HoursWorked';
import api from './api'; 

export const fetchHours = async () => {
  const response = await api.get("/hours");
  return response.data;
};

export const addHours = async (newHours: HoursWorked) => {
  await api.post("/hours", newHours);
};

export const updateHours = async (id: number, updatedHours: Partial<HoursWorked>) => {
  await api.put(`/hours/${id}`, updatedHours);
};

export const deleteHours = async (id: number) => {
  await api.delete(`/hours/${id}`);
};
