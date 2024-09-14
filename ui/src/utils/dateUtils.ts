import { WeeklySummary } from '../models/WeeklySummary';

export const getCurrentWeekDates = (offsetWeeks = 0) => {
  const currentDate = new Date();
  
  currentDate.setDate(currentDate.getDate() + offsetWeeks * 7);
  
  const currentDay = currentDate.getDay();
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDay + 1); 
  
  const daysOfWeek: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const monthsOfYear: string[] = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  
  const weekDates = daysOfWeek.map((day, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);
    return {
      day,
      date: `${date.getDate()} ${monthsOfYear[date.getMonth()]}`,
    };
  });
  
  return weekDates;
};

export const initializeWeeklySummary = (employeeId: number): WeeklySummary => {
  return {
    weekNumber: 1,
    totalHours: 0,  
  }
};
