import { Schedule } from '../models/Schedule';
import api from './api';

export const fetchSchedules = async () => {
  const response = await api.get("/schedules");
  return response.data;
};

export const addSchedule = async (newSchedule: Schedule) => {
  await api.post("/schedules", newSchedule);
};

export const updateSchedule = async (id: number, updatedSchedule: Partial<Schedule>) => {
  await api.put(`/schedules/${id}`, updatedSchedule);
};

export const deleteSchedule = async (id: number) => {
  await api.delete(`/schedules/${id}`);
};
