import { AxiosError } from "axios";
import { BiweeklySummary } from "../models/BiweeklySummary";
import { Employee } from "../models/Employee";
import { HoursWorked } from "../models/HoursWorked";
import { MonthlySummary } from "../models/MonthlySummary";
import { Schedule } from "../models/Schedule";
import { WeeklySummary } from "../models/WeeklySummary";
import { getWeekNumber, getBiweekNumber } from "./dateUtils";

export const updateHoursAndSummaries = async (
  employee: Employee,
  date: Date,
  selectedSchedule: Schedule,
  hoursWorked: HoursWorked[],
  weeklySummaries: WeeklySummary[],
  biweeklySummaries: BiweeklySummary[],
  monthlySummaries: MonthlySummary[],
  schedules: Schedule[],
  fetchHours: () => Promise<void>,
  fetchWeeklySummaries: () => Promise<void>,
  fetchBiweeklySummaries: () => Promise<void>,
  fetchMonthlySummaries: () => Promise<void>,
  handleAddHours: (newHours: HoursWorked) => Promise<void>,
  handleUpdateHours: (
    id: number,
    updatedHours: Partial<HoursWorked>
  ) => Promise<void>,
  handleSummaryChange: (
    type: "weekly" | "biweekly" | "monthly",
    newSummary: WeeklySummary | BiweeklySummary | MonthlySummary
  ) => Promise<void>,
  handleSummaryUpdate: (
    type: "weekly" | "biweekly" | "monthly",
    id: number,
    updatedSummary: Partial<WeeklySummary | BiweeklySummary | MonthlySummary>
  ) => Promise<void>
) => {
  try {
    const newHours: HoursWorked = {
      employeeId: employee.id,
      date,
      scheduleId: selectedSchedule.id,
    };

    const existingHoursWorkedRecord = hoursWorked.find((record) => {
      const recordDate = new Date(record.date);
      return (
        record.employeeId === employee.id &&
        recordDate.getTime() === date.getTime()
      );
    });

    if (existingHoursWorkedRecord) {
      await handleUpdateHours(existingHoursWorkedRecord.id!, {
        scheduleId: selectedSchedule.id,
      });
    } else {
      await handleAddHours(newHours);
    }

    const weekNumber = getWeekNumber(date);
    const biweekNumber = getBiweekNumber(date);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const newWeeklySummary: WeeklySummary = {
      employeeId: employee.id,
      weekNumber,
      month,
      year,
      totalHours: selectedSchedule.hours,
    };

    const newBiweeklySummary: BiweeklySummary = {
      employeeId: employee.id,
      biweekNumber,
      month,
      year,
      totalHours: selectedSchedule.hours,
    };

    const newMonthlySummary: MonthlySummary = {
      employeeId: employee.id,
      month,
      year,
      totalHours: selectedSchedule.hours,
    };

    const existingWeeklySummaryRecord = weeklySummaries.find(
      (record) =>
        record.employeeId === employee.id &&
        record.weekNumber === weekNumber &&
        record.year === year
    );

    const existingBiweeklySummaryRecord = biweeklySummaries.find(
      (record) =>
        record.employeeId === employee.id &&
        record.biweekNumber === biweekNumber &&
        record.year === year
    );

    const existingMonthlySummaryRecord = monthlySummaries.find(
      (record) =>
        record.employeeId === employee.id &&
        record.month === month &&
        record.year === year
    );

    await updateSummary(
      existingWeeklySummaryRecord,
      newWeeklySummary,
      "weekly",
      schedules,
      hoursWorked,
      employee,
      date,
      handleSummaryUpdate,
      handleSummaryChange
    );
    await updateSummary(
      existingBiweeklySummaryRecord,
      newBiweeklySummary,
      "biweekly",
      schedules,
      hoursWorked,
      employee,
      date,
      handleSummaryUpdate,
      handleSummaryChange
    );
    await updateSummary(
      existingMonthlySummaryRecord,
      newMonthlySummary,
      "monthly",
      schedules,
      hoursWorked,
      employee,
      date,
      handleSummaryUpdate,
      handleSummaryChange
    );

    await fetchHours();
    await fetchWeeklySummaries();
    await fetchBiweeklySummaries();
    await fetchMonthlySummaries();
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      console.log(
        "Error en la respuesta del servidor:",
        axiosError.response.data
      );
    } else {
      console.log("Error desconocido:", error);
    }
  }
};

async function updateSummary(
  existingSummary: WeeklySummary | BiweeklySummary | MonthlySummary | undefined,
  newSummary: WeeklySummary | BiweeklySummary | MonthlySummary,
  type: "weekly" | "biweekly" | "monthly",
  schedules: Schedule[],
  hoursWorked: HoursWorked[],
  employee: Employee,
  date: Date,
  handleSummaryUpdate: (
    type: "weekly" | "biweekly" | "monthly",
    id: number,
    updatedSummary: Partial<WeeklySummary | BiweeklySummary | MonthlySummary>
  ) => Promise<void>,
  handleSummaryChange: (
    type: "weekly" | "biweekly" | "monthly",
    newSummary: WeeklySummary | BiweeklySummary | MonthlySummary
  ) => Promise<void>
) {
  const previousHoursWorked = hoursWorked.find((record) => {
    const recordDate = new Date(record.date);
    return (
      record.employeeId === employee.id &&
      recordDate.getTime() === date.getTime()
    );
  });

  if (existingSummary) {
    if (previousHoursWorked) {
      const previousSchedule = schedules.find(
        (schedule) => schedule.id === previousHoursWorked.scheduleId
      );
      if (previousSchedule) {
        await handleSummaryUpdate(type, existingSummary.id!, {
          totalHours:
            existingSummary.totalHours -
            previousSchedule.hours +
            newSummary.totalHours,
        });
      }
    }
  } else {
    await handleSummaryChange(type, newSummary);
  }
}

