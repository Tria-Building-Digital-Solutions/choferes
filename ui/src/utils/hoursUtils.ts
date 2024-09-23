import { BiweeklySummary } from "../models/BiweeklySummary";
import { HoursWorked } from "../models/HoursWorked";
import { MonthlySummary } from "../models/MonthlySummary";
import { Schedule } from "../models/Schedule";
import { WeeklySummary } from "../models/WeeklySummary";
import { useWeeklySummaries } from "../hooks/useWeeklySummary";
import { useBiweeklySummaries } from "../hooks/useBiweeklySummary";
import { useMonthlySummaries } from "../hooks/useMonthlySummary";

export const getHoursWorkedForEmployee = async (
  employeeId: number,
  date: Date
): Promise<HoursWorked[]> => {
  const response = await fetch(
    `/api/hours-worked?employeeId=${employeeId}&date=${date.toISOString()}`
  );
  const data = await response.json();
  return data;
};

export const calculateTotalHoursWeekly = (
  hoursWorked: HoursWorked[],
  schedules: Schedule[]
): number => {
  return hoursWorked.reduce((total, record) => {
    const schedule = schedules.find((s) => s.id === record.scheduleId);
    return total + (schedule?.hours || 0);
  }, 0);
};

export const calculateTotalHoursBiweekly = (
  hoursWorked: HoursWorked[],
  schedules: Schedule[]
): number => {
  const biweeklyHours: { [key: number]: number } = {};

  hoursWorked.forEach((record) => {
    const schedule = schedules.find((s) => s.id === record.scheduleId);
    const weekNumber = getWeekNumber(new Date(record.date));
    const biweekNumber = Math.ceil(weekNumber / 2);

    if (!biweeklyHours[biweekNumber]) {
      biweeklyHours[biweekNumber] = 0;
    }
    biweeklyHours[biweekNumber] += schedule?.hours || 0;
  });

  return Object.values(biweeklyHours).reduce(
    (total, hours) => total + hours,
    0
  );
};

export const calculateTotalHoursMonthly = (
  hoursWorked: HoursWorked[],
  schedules: Schedule[]
): number => {
  const monthlyHours: Record<string, number> = {};

  hoursWorked.forEach((record) => {
    const schedule = schedules.find((s) => s.id === record.scheduleId);
    const month = new Date(record.date).getMonth();
    const year = new Date(record.date).getFullYear();
    const monthKey = `${year}-${month}`;

    if (!monthlyHours[monthKey]) {
      monthlyHours[monthKey] = 0;
    }
    monthlyHours[monthKey] += schedule?.hours || 0;
  });

  return Object.values(monthlyHours).reduce((total, hours) => total + hours, 0);
};

export const getWeekNumber = (date: Date): number => {
  const startDate = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor(
    (date.valueOf() - startDate.valueOf()) / (24 * 60 * 60 * 1000)
  );
  return Math.ceil((days + startDate.getDay() + 1) / 7);
};

export const getBiweekNumber = (date: Date): number => {
  const dayOfMonth = date.getDate();
  return Math.ceil(dayOfMonth / 15);
};

export const usePrepareSummaries = () => {
  const { handleAddWeeklySummary } = useWeeklySummaries();
  const { handleAddBiweeklySummary } = useBiweeklySummaries();
  const { handleAddMonthlySummary } = useMonthlySummaries();

  const prepareSummaries = async (
    employeeId: number,
    hoursWorked: HoursWorked[],
    schedules: Schedule[]
  ) => {
    const filteredHours = hoursWorked.filter(
      (record) => record.employeeId === employeeId
    );

    const weeklySummaries: WeeklySummary[] = createWeeklySummaries(
      employeeId,
      filteredHours,
      schedules
    );
    await Promise.all(
      weeklySummaries.map((summary) => handleAddWeeklySummary(summary))
    );

    const biweeklySummaries: BiweeklySummary[] = createBiweeklySummaries(
      employeeId,
      filteredHours,
      schedules
    );
    await Promise.all(
      biweeklySummaries.map((summary) => handleAddBiweeklySummary(summary))
    );

    const monthlySummaries: MonthlySummary[] = createMonthlySummaries(
      employeeId,
      filteredHours,
      schedules
    );
    await Promise.all(
      monthlySummaries.map((summary) => handleAddMonthlySummary(summary))
    );
  };

  return { prepareSummaries };
};

const createWeeklySummaries = (
  employeeId: number,
  hoursWorked: HoursWorked[],
  schedules: Schedule[]
): WeeklySummary[] => {
  const weeklyHours: { [key: string]: number } = {};

  hoursWorked.forEach((record) => {
    const weekNumber = getWeekNumber(new Date(record.date));
    const year = new Date(record.date).getFullYear();
    const key = `${year}-${weekNumber}`;

    const schedule = schedules.find((s) => s.id === record.scheduleId);
    const hours = schedule?.hours || 0;

    if (!weeklyHours[key]) {
      weeklyHours[key] = 0;
    }
    weeklyHours[key] += hours;
  });

  return Object.entries(weeklyHours).map(([key, totalHours]) => {
    const [year, weekNumber] = key.split("-").map(Number);
    return {
      employeeId,
      weekNumber,
      month: new Date().getMonth() + 1,
      year,
      totalHours,
    };
  });
};

const createBiweeklySummaries = (
  employeeId: number,
  hoursWorked: HoursWorked[],
  schedules: Schedule[]
): BiweeklySummary[] => {
  const biweeklyHours: { [key: number]: number } = {};

  hoursWorked.forEach((record) => {
    const weekNumber = getWeekNumber(new Date(record.date));
    const biweekNumber = Math.ceil(weekNumber / 2);
    const schedule = schedules.find((s) => s.id === record.scheduleId);
    const hours = schedule?.hours || 0;

    if (!biweeklyHours[biweekNumber]) {
      biweeklyHours[biweekNumber] = 0;
    }
    biweeklyHours[biweekNumber] += hours;
  });

  return Object.entries(biweeklyHours).map(([biweekNumber, totalHours]) => ({
    employeeId,
    biweekNumber: Number(biweekNumber),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    totalHours,
  }));
};

const createMonthlySummaries = (
  employeeId: number,
  hoursWorked: HoursWorked[],
  schedules: Schedule[]
): MonthlySummary[] => {
  const monthlyHours: Record<string, number> = {};

  hoursWorked.forEach((record) => {
    const month = new Date(record.date).getMonth() + 1;
    const year = new Date(record.date).getFullYear();
    const monthKey = `${year}-${month}`;

    const schedule = schedules.find((s) => s.id === record.scheduleId);
    const hours = schedule?.hours || 0;

    if (!monthlyHours[monthKey]) {
      monthlyHours[monthKey] = 0;
    }
    monthlyHours[monthKey] += hours;
  });

  return Object.entries(monthlyHours).map(([key, totalHours]) => {
    const [year, month] = key.split("-").map(Number);
    return { employeeId, month, year, totalHours };
  });
};

const hoursUtils = {
  getWeekNumber,
  getBiweekNumber,
  getHoursWorkedForEmployee,
  calculateTotalHoursWeekly,
  calculateTotalHoursBiweekly,
  calculateTotalHoursMonthly,
  usePrepareSummaries,
};

export default hoursUtils;
