import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { capitalize, SvgIconProps } from "@mui/material";
import { getColumnTranslation } from "./stringUtils";
import { translateDayToSpanish } from "./calculationUtils";
import { calculateTotalHours } from "./tableUtils";
import { Employee } from "../models/Employee";
import { HoursWorked } from "../models/HoursWorked";
import { Schedule } from "../models/Schedule";
import { DayOfWeek } from "./dayOfWeek";

export const exportToExcel = (data: any[], fileName: string) => {
  const headers = Object.keys(data[0]).map(getColumnTranslation);

  const translatedData = data.map((row) => {
    const translatedRow: any = {};
    Object.keys(row).forEach((key, index) => {
      translatedRow[headers[index]] = row[key];
    });
    return translatedRow;
  });

  const worksheet = XLSX.utils.json_to_sheet(translatedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportToPDF = (data: any[], fileName: string) => {
  const doc = new jsPDF();

  const headers = [Object.keys(data[0]).map(getColumnTranslation)];

  const tableData = data.map((row) => Object.values(row));

  doc.autoTable({
    head: headers,
    body: tableData,
  });

  doc.save(`${fileName}.pdf`);
};

export const exportMenuItems = (
  data: any[],
  fileName: string,
  excelIcon: React.ReactElement<SvgIconProps>,
  pdfIcon: React.ReactElement<SvgIconProps>
) => {
  return [
    {
      text: "Descargar Excel",
      onClick: () => exportToExcel(data, fileName),
      icon: excelIcon,
    },
    {
      text: "Descargar PDF",
      onClick: () => exportToPDF(data, fileName),
      icon: pdfIcon,
    },
  ];
};

export const exportFileFormattedDate = (date: Date) => {
  return `${String(date.getDate()).padStart(2, "0")}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${date.getFullYear()}-${String(date.getHours()).padStart(
    2,
    "0"
  )}-${String(date.getMinutes()).padStart(2, "0")}-${String(
    date.getSeconds()
  ).padStart(2, "0")}`;
};

export const handleExportTableData = (
  filteredEmployees: Employee[],
  hoursWorked: HoursWorked[],
  schedules: Schedule[],
  currentWeek: { day: string; date: string }[],
  period: "weekly" | "biweekly" | "monthly"
) => {
  const dataForExport = filteredEmployees.map((employee) => {
    const employeeData: any = {
      nombre: `${employee.firstName} ${employee.lastName}`,
    };

    currentWeek.forEach(({ day, date }) => {
      const dateObject = new Date(date);
      const selectedRecord = hoursWorked.find(
        (record) =>
          record.employeeId === employee.id &&
          new Date(record.date).toISOString().split("T")[0] ===
            dateObject.toISOString().split("T")[0]
      );

      const scheduleLabel =
        selectedRecord?.scheduleId &&
        schedules.find((schedule) => schedule.id === selectedRecord.scheduleId)
          ?.label;

      employeeData[translateDayToSpanish(day as DayOfWeek)] = scheduleLabel || "Libre";
    });

    employeeData[`total${capitalize(period)}`] = calculateTotalHours(
      currentWeek,
      hoursWorked,
      schedules,
      employee.id,
      period
    );

    return employeeData;
  });

  return dataForExport;
}