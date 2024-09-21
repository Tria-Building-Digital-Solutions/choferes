import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { getColumnTranslation } from "./tableUtils";
import { SvgIconProps } from "@mui/material";

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
