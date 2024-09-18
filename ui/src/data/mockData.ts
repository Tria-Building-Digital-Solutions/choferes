import { BiweeklySummary } from "../models/BiweeklySummary";
import { Employee } from "../models/Employee";
import { HoursWorked } from "../models/HoursWorked";
import { MonthlySummary } from "../models/MonthlySummary";
import { WeeklySummary } from "../models/WeeklySummary";

export const options = {
  weekdays: [
    { label: "Avenida Escazú", hours: 11 },
    { label: "Hospital CIMA", hours: 11 },
    { label: "BAC Latam", hours: 11 },
    { label: "Microsoft", hours: 10 },
    { label: "Clínica Bíblica", hours: 10 },
    { label: "Horario Especial", hours: 9 },
    { label: "Cubre Almuerzo", hours: 3 },
    { label: "Libre", hours: 0 },
    { label: "Ausencia", hours: 0 },
  ],
  friday: [
    { label: "Avenida Escazú", hours: 11 },
    { label: "Plaza Tempo", hours: 7 },
    { label: "Hospital CIMA", hours: 11 },
    { label: "BAC Latam", hours: 11 },
    { label: "Microsoft", hours: 10 },
    { label: "Clínica Bíblica", hours: 10 },
    { label: "Horario Especial", hours: 9 },
    { label: "Cubre Almuerzo", hours: 3 },
    { label: "Libre", hours: 0 },
    { label: "Ausencia", hours: 0 },
  ],
  weekend: [
    { label: "Avenida Escazú", hours: 10 },
    { label: "Plaza Tempo", hours: 12 },
    { label: "Terrazas Lindora", hours: 10 },
    { label: "Plaza Lincoln", hours: 10 },
    { label: "Horario Especial", hours: 9 },
    { label: "Cubre Almuerzo", hours: 3 },
    { label: "Libre", hours: 0 },
    { label: "Ausencia", hours: 0 },
  ],
};

export const mockEmployees: Employee[] = [
  { id: 1, firstName: "Emily", lastName: "Davis" },
  { id: 2, firstName: "Sarah", lastName: "Johnson" },
  { id: 3, firstName: "David", lastName: "Wilson" },
  { id: 4, firstName: "Sophia", lastName: "Lee" },
  { id: 5, firstName: "Ava", lastName: "Robinson" },
];

export const mockHoursWorked: HoursWorked[] = [
  { id: 1, employeeId: 1, date: new Date('2024-09-01'), hours: 8 },
  { id: 2, employeeId: 1, date: new Date('2024-09-02'), hours: 9 },
  { id: 3, employeeId: 1, date: new Date('2024-09-03'), hours: 8 },

  { id: 4, employeeId: 2, date: new Date('2024-09-01'), hours: 7 },
  { id: 5, employeeId: 2, date: new Date('2024-09-02'), hours: 8 },
  { id: 6, employeeId: 2, date: new Date('2024-09-03'), hours: 7 },

  { id: 7, employeeId: 3, date: new Date('2024-09-01'), hours: 6 },
  { id: 8, employeeId: 3, date: new Date('2024-09-02'), hours: 8 },
  { id: 9, employeeId: 3, date: new Date('2024-09-03'), hours: 9 },

  { id: 10, employeeId: 4, date: new Date('2024-09-01'), hours: 9 },
  { id: 11, employeeId: 4, date: new Date('2024-09-02'), hours: 8 },
  { id: 12, employeeId: 4, date: new Date('2024-09-03'), hours: 10 },

  { id: 13, employeeId: 5, date: new Date('2024-09-01'), hours: 5 },
  { id: 14, employeeId: 5, date: new Date('2024-09-02'), hours: 8 },
  { id: 15, employeeId: 5, date: new Date('2024-09-03'), hours: 6 },
];

export const mockWeeklySummaries: WeeklySummary[] = [
  { weekNumber: 35, totalHours: 25 },  
  { weekNumber: 36, totalHours: 28 },  
];

export const mockBiweeklySummaries: BiweeklySummary[] = [
  { firstHalfHours: 50, secondHalfHours: 45 },  
];

export const mockMonthlyWorkSummaries: MonthlySummary[] = [
  {
    employee: { id: 1, firstName: "Emily", lastName: "Davis" },
    month: "September",
    weeklySummaries: [
      { weekNumber: 35, totalHours: 25 },
      { weekNumber: 36, totalHours: 28 },
    ],
    biweeklySummary: { firstHalfHours: 50, secondHalfHours: 45 },
    monthlyTotal: 95,
  },
  {
    employee: { id: 2, firstName: "Sarah", lastName: "Johnson" },
    month: "September",
    weeklySummaries: [
      { weekNumber: 35, totalHours: 20 },
      { weekNumber: 36, totalHours: 30 },
    ],
    biweeklySummary: { firstHalfHours: 45, secondHalfHours: 50 },
    monthlyTotal: 95,
  },
];
