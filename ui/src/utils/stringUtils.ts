import { DAYS } from "../constants/constants";
import { Schedule } from "../models/Schedule";
import { ColumnsTranslation } from "./columnsTranslation";
import { EnglishDayOfWeek } from "./englishDayOfWeek";
import { EnglishAbrevMonthOfYear } from "./englishAbrevMonthOfYear";

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

export const translateMonthToAbrevSpanish = (
  monthInEnglish: EnglishAbrevMonthOfYear
): string => {
  const translationMap: Record<EnglishAbrevMonthOfYear, string> = {
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

export const translateColumnHeaderToSpanish = (
  column: string | number | symbol
): string => {
  const translations: ColumnsTranslation = {
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
    return translations[column as keyof ColumnsTranslation];
  }

  return String(column);
};

export const translateDayToAbrevSpanish = (dayInEnglish: EnglishDayOfWeek): string => {
  const translationMap: Record<EnglishDayOfWeek, string> = {
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

export const translateDayOptionsToSpanish = (day: string): string => {
  const translations: { [key: string]: string } = {
    weekday: "Lunes a Jueves",
    friday: "Viernes",
    saturday: "Sábado",
    sunday: "Domingo",
  };
  return translations[day] || day;
};

export const getDayOptionsSpanish = () => [
  { value: "weekday", label: "Lunes a Jueves" },
  { value: "friday", label: "Viernes" },
  { value: "saturday", label: "Sábado" },
  { value: "sunday", label: "Domingo" },
];

export const setDayOptionsEnglish = (day: string): string => {
  const lowerCaseDay = day.toLowerCase();

  if (["monday", "tuesday", "wednesday", "thursday"].includes(lowerCaseDay)) {
    return "weekday";
  }

  return lowerCaseDay;
};
