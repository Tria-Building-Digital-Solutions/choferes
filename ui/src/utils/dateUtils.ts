import { EnglishAbrevMonthOfYear } from "./englishAbrevMonthOfYear";
import { translateMonthToAbrevSpanish } from "./stringUtils";

export const formatDate = (date: Date, withTimePart: boolean) => {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  const formattedDate = date.toLocaleString("es-ES", options);

  const [datePart, timePart] = formattedDate.split(", ");

  if (withTimePart) {
    return `${datePart} de ${timePart}`;
  }

  return datePart;
};

export const isValidDate = (date: any): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

export const formatHeaderDate = (dateStr: string) => {
  const [day, month] = dateStr.split(" ");
  const transformedMonth = translateMonthToAbrevSpanish(
    month as EnglishAbrevMonthOfYear
  );
  return `${day} ${transformedMonth}`;
};

export const formatHeaderDateWithYear = (dateStr: string) => {
  const [day, month, year] = dateStr.split(" ");
  const transformedMonth = translateMonthToAbrevSpanish(
    month as EnglishAbrevMonthOfYear
  );
  return `${day} ${transformedMonth} ${year}`;
};

export const getCurrentWeekDates = (weekOffset: number) => {
  const today = new Date();
  const firstDayOfWeek =
    today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1);
  const startDate = new Date(today.setDate(firstDayOfWeek + weekOffset * 7));

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    return {
      day: date.toLocaleString("en-US", { weekday: "long" }),
      date: `${date.getDate()} ${date.toLocaleDateString("en-US", {
        month: "short",
      })} ${date.getFullYear()}`,
      isoDate: date.toISOString(),
    };
  });
};

const getEndOfNextWeek = (today: Date): Date => {
  let dayOfWeek = today.getDay();

  if (dayOfWeek === 0) {
    dayOfWeek = 7;
  }

  const daysUntilEndOfNextWeek = 14 - dayOfWeek; 
  const endOfNextWeek = new Date(today);
  endOfNextWeek.setDate(today.getDate() + daysUntilEndOfNextWeek);
  endOfNextWeek.setHours(23, 59, 59, 999);

  return endOfNextWeek;
};

export const isValidDateForSelect = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  const endOfNextWeek = getEndOfNextWeek(today); 
  return date <= endOfNextWeek;
};

export const getWeekNumber = (date: Date): number => {
  const startDate = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor(
    (date.valueOf() - startDate.valueOf()) / (24 * 60 * 60 * 1000)
  );
  return Math.ceil((days + startDate.getDay() + 1) / 7);
};

export const getBiweekNumber = (date: Date): number => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const daysDifference = Math.floor(
    (date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)
  );
  return Math.floor(daysDifference / 15) + 1;
};


export const getMonthNumber = (date: Date): number => {
  return date.getMonth() + 1;
};