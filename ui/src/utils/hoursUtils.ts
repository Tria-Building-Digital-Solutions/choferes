import { HoursWorked } from "../models/HoursWorked";
import { Schedule } from "../models/Schedule"; 
// import { WeeklySummary } from "../models/WeeklySummary";
// import { BiweeklySummary } from "../models/BiweeklySummary";
// import { MonthlySummary } from "../models/MonthlySummary";

export const getHoursWorkedForEmployee = async (employeeId: number, date: Date): Promise<HoursWorked[]> => {
  const response = await fetch(`/api/hours-worked?employeeId=${employeeId}&date=${date.toISOString()}`);
  const data = await response.json();
  return data; 
};

export const calculateTotalHoursWeekly = (hoursWorked: HoursWorked[], schedules: Schedule[]): number => {
  return hoursWorked.reduce((total, record) => {
    const schedule = schedules.find(s => s.id === record.scheduleId); 
    return total + (schedule?.hours || 0); 
  }, 0);
};

export const calculateTotalHoursBiweekly = (hoursWorked: HoursWorked[], schedules: Schedule[]): number => {
  return calculateTotalHoursWeekly(hoursWorked, schedules); // Ajusta según tu lógica
};

export const calculateTotalHoursMonthly = (hoursWorked: HoursWorked[], schedules: Schedule[]): number => {
  return calculateTotalHoursWeekly(hoursWorked, schedules); // Ajusta según tu lógica
};

export const getWeekNumber = (date: Date): number => {
  const startDate = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.valueOf() - startDate.valueOf()) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + startDate.getDay() + 1) / 7);
};

export const getBiweekNumber = (date: Date): number => {
  const dayOfMonth = date.getDate();
  return Math.ceil(dayOfMonth / 15);
};

export default {
  getHoursWorkedForEmployee,
  calculateTotalHoursWeekly,
  calculateTotalHoursBiweekly,
  calculateTotalHoursMonthly,
  getWeekNumber,
  getBiweekNumber,
};
