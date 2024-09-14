import { DaySelection } from "./DaySelection";

export interface WeekData {
    [employeeId: string]: {
      [day: string]: DaySelection;
    };
  }