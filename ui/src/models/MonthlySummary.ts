
import { BiweeklySummary } from "./BiweeklySummary";
import { Employee } from "./Employee";
import { WeeklySummary } from "./WeeklySummary";

export interface MonthlySummary {
    employee: Employee;                
    month: string;                     
    weeklySummaries: WeeklySummary[];  
    biweeklySummary: BiweeklySummary;  
    monthlyTotal: number;              
  }