import { DAYS } from "../constants/constants";
import { options } from "../data/mockData";

interface WeekData {
  [employee: string]: {
    [day: string]: { label: string; hours: number };
  };
}

export const getOptionsForDay = (day: string) => {
  if (day.includes(DAYS.FRIDAY)) return options.friday;
  if (day.includes(DAYS.SATURDAY) || day.includes(DAYS.SUNDAY))
    return options.weekend;
  return options.weekdays;
};

export const calculateTotalHours = (
  currentWeek: { day: string }[],
  weekData: WeekData,
  employee: string
): number => {
  return currentWeek.reduce((total, { day }) => {
    const selectedHours = weekData[employee]?.[day]?.hours || 0;
    return total + selectedHours;
  }, 0);
};
export const getBackgroundColor = (rowIndex: number) => {
  return rowIndex % 2 === 0 ? "white" : "#f5f5f5";
};
