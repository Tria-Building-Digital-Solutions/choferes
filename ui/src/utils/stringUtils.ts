import { DAYS } from "../constants/constants";
import { Schedule } from "../models/Schedule";

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

export const getDayType = (day: string): string => {
  const lowerCaseDay = day.toLowerCase();

  if (["monday", "tuesday", "wednesday", "thursday"].includes(lowerCaseDay)) {
    return "weekday";
  }

  return lowerCaseDay;
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