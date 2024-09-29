import { BiweeklySummary } from "../models/BiweeklySummary";
import { Employee } from "../models/Employee";
import { HoursWorked } from "../models/HoursWorked";
import { MonthlySummary } from "../models/MonthlySummary";
import { Schedule } from "../models/Schedule";
import { WeeklySummary } from "../models/WeeklySummary";
import { format, parseISO } from "date-fns";
import { getBiweekNumber, getWeekNumber } from "./dateUtils";

export const updateHoursAndSummaries = async (
  employee: Employee,
  schedules: Schedule[],
  hoursWorked: HoursWorked[],
  weeklySummaries: WeeklySummary[],
  biweeklySummaries: BiweeklySummary[],
  monthlySummaries: MonthlySummary[],
  date: Date,
  weekNumber: number,
  biweekNumber: number,
  month: number,
  year: number,
  selectedSchedule: Schedule,
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
  ) => Promise<void>,
  fetchHours: () => Promise<HoursWorked[]>
) => {
  const newHours: HoursWorked = {
    employeeId: employee.id,
    date,
    scheduleId: selectedSchedule.id,
  };

  const existingHoursWorkedRecord = hoursWorked.find((record) => {
    return (
      record.employeeId === employee.id &&
      format(parseISO(record.date.toString()), "yyyy-MM-dd") ===
        format(date, "yyyy-MM-dd")
    );
  });

  if (existingHoursWorkedRecord) {
    await handleUpdateHours(existingHoursWorkedRecord.id!, {
      scheduleId: selectedSchedule.id,
    });
  } else {
    await handleAddHours(newHours);
  }

  const updatedHoursWorked = await fetchHours();

  console.log("Updated Hours Worked:", updatedHoursWorked);

  const totalWeeklyHours = updatedHoursWorked
    .filter((record) => {
      const recordWeekNumber = getWeekNumber(new Date(record.date));
      return (
        record.employeeId === employee.id &&
        recordWeekNumber === weekNumber &&
        new Date(record.date).getFullYear() === year
      );
    })
    .reduce((sum, record) => {
      const schedule = schedules.find(
        (schedule: Schedule) => schedule.id === record.scheduleId
      );
      return sum + (schedule ? schedule.hours : 0);
    }, 0);

  const totalBiweeklyHours = updatedHoursWorked
    .filter((record) => {
      const recordBiweekNumber = getBiweekNumber(new Date(record.date));
      return (
        record.employeeId === employee.id &&
        recordBiweekNumber === biweekNumber &&
        new Date(record.date).getFullYear() === year
      );
    })
    .reduce((sum, record) => {
      const schedule = schedules.find(
        (schedule: Schedule) => schedule.id === record.scheduleId
      );
      return sum + (schedule ? schedule.hours : 0);
    }, 0);

  const totalMonthlyHours = updatedHoursWorked
    .filter((record) => {
      const recordMonth = new Date(record.date).getMonth() + 1;
      return (
        record.employeeId === employee.id &&
        recordMonth === month &&
        new Date(record.date).getFullYear() === year
      );
    })
    .reduce((sum, record) => {
      const schedule = schedules.find(
        (schedule: Schedule) => schedule.id === record.scheduleId
      );
      return sum + (schedule ? schedule.hours : 0);
    }, 0);

  console.log("totalWeeklyHours: ", totalWeeklyHours);
  console.log("totalBiweeklyHours: ", totalBiweeklyHours);
  console.log("totalMonthlyHours: ", totalMonthlyHours);

  await createOrUpdateSummary(
    "weekly",
    employee,
    weeklySummaries,
    weekNumber,
    month,
    year,
    totalWeeklyHours,
    handleSummaryUpdate,
    handleSummaryChange
  );

  await createOrUpdateSummary(
    "biweekly",
    employee,
    biweeklySummaries,
    biweekNumber,
    month,
    year,
    totalBiweeklyHours,
    handleSummaryUpdate,
    handleSummaryChange
  );

  await createOrUpdateSummary(
    "monthly",
    employee,
    monthlySummaries,
    month,
    month,
    year,
    totalMonthlyHours,
    handleSummaryUpdate,
    handleSummaryChange
  );
};

async function createOrUpdateSummary(
  type: "weekly" | "biweekly" | "monthly",
  employee: Employee,
  summaries: WeeklySummary[] | BiweeklySummary[] | MonthlySummary[],
  periodNumber: number,
  month: number,
  year: number,
  totalHours: number,
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
  const existingSummary = summaries.find(
    (record) =>
      record.employeeId === employee.id &&
      (type === "weekly"
        ? (record as WeeklySummary).weekNumber === periodNumber
        : type === "biweekly"
        ? (record as BiweeklySummary).biweekNumber === periodNumber
        : (record as MonthlySummary).month === periodNumber) &&
      record.year === year
  );

  if (existingSummary) {
    await handleSummaryUpdate(type, existingSummary.id!, {
      totalHours,
    });
  } else {
    let newSummary: WeeklySummary | BiweeklySummary | MonthlySummary | null =
      null;

    if (type === "weekly") {
      newSummary = {
        employeeId: employee.id,
        weekNumber: periodNumber,
        month,
        year,
        totalHours,
      } as WeeklySummary;
    } else if (type === "biweekly") {
      newSummary = {
        employeeId: employee.id,
        biweekNumber: periodNumber,
        month,
        year,
        totalHours,
      } as BiweeklySummary;
    } else if (type === "monthly") {
      newSummary = {
        employeeId: employee.id,
        month: periodNumber,
        year,
        totalHours,
      } as MonthlySummary;
    }

    if (newSummary) {
      await handleSummaryChange(type, newSummary);
    }
  }
}
