export interface DailyHour {
  day: string;
  hours: string;
}

export interface Dashboard {
  employeeName: string;
  dailyHours: DailyHour[];
  totalHours: number;
}
