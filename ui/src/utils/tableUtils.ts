import { HoursWorked } from "../models/HoursWorked";
import { Schedule } from "../models/Schedule";
import { getBiweeklyDates, getMonthlyDates, isValidDate } from "./dateUtils";
import { Employee } from "../models/Employee";
import { Dashboard } from "../models/Dashboard";
import { DayOfWeek } from "./dayOfWeek";
import { translateDayToSpanish } from "./calculationUtils";
import { format } from "date-fns";

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

export const getBackgroundColor = (rowIndex: number) => {
  return rowIndex % 2 === 0 ? "white" : "#f5f5f5";
};
