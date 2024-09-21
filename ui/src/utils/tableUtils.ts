import {
  addDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
} from "date-fns";
import { DAYS } from "../constants/constants";
import { HoursWorked } from "../models/HoursWorked";
import { Schedule } from "../models/Schedule";

export const getDayOptions = () => [
  { value: "weekday", label: "Lunes a Jueves" },
  { value: "friday", label: "Viernes" },
  { value: "saturday", label: "Sábado" },
  { value: "sunday", label: "Domingo" },
];

export const getOptionsForDay = (
  day: string,
  schedules: Schedule[]
): Schedule[] => {
  let dayFilter = "";

  switch (day.toLowerCase()) {
    case "friday":
      dayFilter = DAYS.FRIDAY;
      break;
    case "saturday":
      dayFilter = DAYS.SATURDAY;
      break;
    case "sunday":
      dayFilter = DAYS.SUNDAY;
      break;
    default:
      dayFilter = "weekday";
      break;
  }

  return schedules.filter((schedule) => schedule.day === dayFilter);
};

const getDatesForPeriod = (startDate: Date, daysCount: number) => {
  return eachDayOfInterval({
    start: startDate,
    end: addDays(startDate, daysCount - 1),
  }).map((date) => ({
    day: format(date, "EEEE"),
    date: format(date, "dd-MM-yyyy"),
  }));
};

const getBiweeklyDates = (startDate: Date) => {
  const firstWeek = getDatesForPeriod(startDate, 7);
  const secondWeekStart = addDays(startDate, 7);
  const secondWeek = getDatesForPeriod(secondWeekStart, 7);
  return [...firstWeek, ...secondWeek];
};

const getMonthlyDates = (startDate: Date) => {
  const firstDayOfMonth = startOfMonth(startDate);
  const lastDayOfMonth = endOfMonth(startDate);
  return eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth }).map(
    (date) => ({
      day: format(date, "EEEE"),
      date: format(date, "dd-MM-yyyy"),
    })
  );
};

export const calculateTotalHours = (
  currentWeek: { day: string; date: string }[],
  hoursWorked: HoursWorked[],
  schedules: Schedule[],
  employeeId: number,
  period: "weekly" | "biweekly" | "monthly"
): number => {
  let days = [];
  const startDate = new Date();

  switch (period) {
    case "weekly":
      days = currentWeek;
      break;
    case "biweekly":
      days = getBiweeklyDates(startDate);
      break;
    case "monthly":
      days = getMonthlyDates(startDate);
      break;
    default:
      days = currentWeek;
  }

  return days.reduce((total, { day }) => {
    const record = hoursWorked.find(
      (record: HoursWorked) =>
        record.employeeId === employeeId &&
        isValidDate(record.date) &&
        format(record.date, "EEEE") === day
    );

    const scheduleHours = record
      ? schedules.find((schedule) => schedule.id === record.scheduleId)
          ?.hours || 0
      : 0;

    return total + scheduleHours;
  }, 0);
};

const isValidDate = (date: any): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

export const getBackgroundColor = (rowIndex: number) => {
  return rowIndex % 2 === 0 ? "white" : "#f5f5f5";
};
