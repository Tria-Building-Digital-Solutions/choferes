import { DayOfWeek } from "./dayOfWeek";
import { MonthOfYear } from "./monthOfYear";

export const translateDayToSpanish = (dayInEnglish: DayOfWeek): string => {
  const translationMap: Record<DayOfWeek, string> = {
    Sunday: "Dom",
    Monday: "Lun",
    Tuesday: "Mar",
    Wednesday: "Mié",
    Thursday: "Jue",
    Friday: "Vie",
    Saturday: "Sáb",
  };

  return translationMap[dayInEnglish];
};

export const translateMonthToSpanish = (monthInEnglish: MonthOfYear): string => {
  const translationMap: Record<MonthOfYear, string> = {
    Jan: "Ene",
    Feb: "Feb",
    Mar: "Mar",
    Apr: "Abr",
    May: "May",
    Jun: "Jun",
    Jul: "Jul",
    Aug: "Ago",
    Sep: "Set",
    Oct: "Oct",
    Nov: "Nov",
    Dec: "Dic",
  
  };

  return translationMap[monthInEnglish];
};