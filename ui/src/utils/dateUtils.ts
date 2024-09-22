import { MonthOfYear } from './monthOfYear';
import { translateMonthToSpanish } from './calculationUtils';
import { addDays, eachDayOfInterval, endOfMonth, format, startOfMonth } from 'date-fns';

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

export const isValidDate = (date: any): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

export const getDatesForPeriod = (startDate: Date, daysCount: number) => {
  return eachDayOfInterval({
    start: startDate,
    end: addDays(startDate, daysCount - 1),
  }).map((date) => ({
    day: format(date, "EEEE"),
    date: format(date, "dd-MM-yyyy"),
  }));
};

export const getBiweeklyDates = (startDate: Date) => {
  const firstWeek = getDatesForPeriod(startDate, 7);
  const secondWeekStart = addDays(startDate, 7);
  const secondWeek = getDatesForPeriod(secondWeekStart, 7);
  return [...firstWeek, ...secondWeek];
};

export const getMonthlyDates = (startDate: Date) => {
  const firstDayOfMonth = startOfMonth(startDate);
  const lastDayOfMonth = endOfMonth(startDate);
  return eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth }).map(
    (date) => ({
      day: format(date, "EEEE"),
      date: format(date, "dd-MM-yyyy"),
    })
  );
};