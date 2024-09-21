import { MonthOfYear } from '../types/MonthOfYear';
import { translateMonthToSpanish } from './calculationUtils';

export const getCurrentWeekDates = (weekOffset: number) => {
  const today = new Date();
  const firstDayOfWeek = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1);
  const startDate = new Date(today.setDate(firstDayOfWeek + weekOffset * 7));

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return {
      day: date.toLocaleString('en-US', { weekday: 'long' }), 
      date: `${date.getDate()} ${date.toLocaleDateString('en-US', { month: 'short' })} ${date.getFullYear()}`,
      isoDate: date.toISOString(), 
    };
  });
};

export const formatHeaderDate = (dateStr: string) => {
  const [day, month] = dateStr.split(" ");
  const transformedMonth = translateMonthToSpanish(month as MonthOfYear);
  return `${day} ${transformedMonth}`;
};