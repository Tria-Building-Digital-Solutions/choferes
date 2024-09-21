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
import { isValidDate } from "./dateUtils";
import { Employee } from "../models/Employee";
import { Dashboard } from "../models/Dashboard";
import { DayOfWeek } from "./dayOfWeek";
import { translateDayToSpanish } from "./calculationUtils";

export const collectTableData = (
  paginatedEmployees: Employee[],
  currentWeek: { day: string; date: string }[],
  hoursWorked: HoursWorked[],
  schedules: Schedule[],
  selectedColumn: "weekly" | "biweekly" | "monthly"
): Dashboard[] => {
  return paginatedEmployees.map((employee) => {
    const dailyHours = currentWeek.map(({ day, date }) => {
      const record = hoursWorked.find(
        (record) =>
          record.employeeId === employee.id &&
          new Date(record.date).toISOString().split("T")[0] ===
            new Date(date).toISOString().split("T")[0]
      );
      const hours = record ? String(record.scheduleId) : "Libre";
      return {
        day: translateDayToSpanish(day as DayOfWeek),
        hours,
      };
    });

    const totalHours = calculateTotalHours(
      currentWeek,
      hoursWorked,
      schedules,
      employee.id,
      selectedColumn
    );

    return {
      employeeName: `${employee.firstName} ${employee.lastName}`,
      dailyHours,
      totalHours,
    };
  });
};

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

type ColumnTranslations = {
  id: string;
  firstName: string;
  lastName: string;
  label: string;
  day: string;
  hours: string;
  createdAt: string;
  updatedAt: string;
};

export const getColumnTranslation = (
  column: string | number | symbol
): string => {
  const translations: ColumnTranslations = {
    id: "Id",
    firstName: "Nombre",
    lastName: "Apellido",
    label: "Lugar",
    day: "Día",
    hours: "Horas",
    createdAt: "Agregado",
    updatedAt: "Actualizado",
  };

  if (typeof column === "string" && column in translations) {
    return translations[column as keyof ColumnTranslations];
  }

  return String(column);
};

export const getDayTranslation = (day: string): string => {
  const translations: { [key: string]: string } = {
    weekday: "Lunes a Jueves",
    friday: "Viernes",
    saturday: "Sábado",
    sunday: "Domingo",
  };
  return translations[day] || day;
};

export const getBackgroundColor = (rowIndex: number) => {
  return rowIndex % 2 === 0 ? "white" : "#f5f5f5";
};
