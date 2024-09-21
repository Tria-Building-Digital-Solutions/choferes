import React, { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  TablePagination,
  InputLabel,
  TableSortLabel,
  Divider,
  Typography,
} from "@mui/material";
import {
  formatHeaderDate,
  getCurrentWeekDates,
} from "../../../utils/dateUtils";
import {
  calculateTotalHours,
  getBackgroundColor,
  getOptionsForDay,
} from "../../../utils/tableUtils";
import { Employee } from "../../../models/Employee";
import { STATE, TABLE } from "../../../constants/constants";
import { HoursWorked } from "../../../models/HoursWorked";
import { Schedule } from "../../../models/Schedule"; // Mantén esto si lo usas en otro lugar
import { translateDayToSpanish } from "../../../utils/calculationUtils";
import { DayOfWeek } from "../../../utils/dayOfWeek";

interface DropdownTableProps {
  filteredEmployees: Employee[];
  weekOffset: number;
  schedules: Schedule[];
  hoursWorked: HoursWorked[];
  onHandleChange: (
    employee: Employee,
    day: string,
    date: Date,
    selectedLabel: string
  ) => void;
}

const DropdownTable: React.FC<DropdownTableProps> = ({
  filteredEmployees,
  weekOffset,
  schedules,
  hoursWorked,
  onHandleChange,
}) => {
  const currentWeek = useMemo(
    () => getCurrentWeekDates(weekOffset),
    [weekOffset]
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedColumn, setSelectedColumn] = useState<
    "weekly" | "biweekly" | "monthly"
  >("weekly");
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");

  const sortedEmployees = useMemo(() => {
    return [...filteredEmployees].sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`;
      const nameB = `${b.firstName} ${b.lastName}`;
      return orderDirection === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
  }, [filteredEmployees, orderDirection]);

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedEmployees = sortedEmployees.slice(startIndex, endIndex);

  const today = new Date();
  const todayString = today
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(",", "");

  if (!filteredEmployees || filteredEmployees.length === 0) {
    return (
      <Typography variant="h6" color="textSecondary">
        No se encontraron empleados disponibles.
      </Typography>
    );
  }

  return (
    <Paper sx={{ width: "100%" }}>
      <TableContainer className="table-container">
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell
                className="employee-column"
                sx={{
                  position: "sticky",
                  left: 0,
                  zIndex: 3,
                }}
              >
                <TableSortLabel
                  direction={orderDirection}
                  onClick={() => {
                    setOrderDirection((prev) =>
                      prev === "asc" ? "desc" : "asc"
                    );
                  }}
                >
                  Empleados
                </TableSortLabel>
              </TableCell>
              {currentWeek.map(({ day, date }) => (
                <TableCell key={day} align="center">
                  {`${translateDayToSpanish(
                    day as DayOfWeek
                  )} ${formatHeaderDate(date)}`}
                </TableCell>
              ))}
              <TableCell
                align="center"
                sx={{ position: "sticky", right: 0, zIndex: 2 }}
              >
                <FormControl>
                  <InputLabel>Total</InputLabel>
                  <Select
                    value={selectedColumn}
                    onChange={(e) =>
                      setSelectedColumn(
                        e.target.value as "weekly" | "biweekly" | "monthly"
                      )
                    }
                    autoWidth
                    label="Total"
                  >
                    <MenuItem value="weekly">Semanal</MenuItem>
                    <MenuItem value="biweekly">Quincenal</MenuItem>
                    <MenuItem value="monthly">Mensual</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedEmployees.map((employee, rowIndex) => (
              <TableRow
                key={`${employee.firstName}-${employee.lastName}-${rowIndex}`}
                sx={{ backgroundColor: getBackgroundColor(rowIndex) }}
              >
                <TableCell
                  sx={{
                    position: "sticky",
                    left: 0,
                    zIndex: 2,
                    backgroundColor: getBackgroundColor(rowIndex),
                  }}
                >
                  {employee.firstName} {employee.lastName}
                </TableCell>
                {currentWeek.map(({ day, date }) => {
                  const formattedDate = new Date(date)
                    .toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    .replace(",", "");
                  const isFutureDate = new Date(date) > today;

                  const selectedLabel =
                    (employee.id !== undefined &&
                      hoursWorked.find(
                        (record) =>
                          record.employeeId === employee.id &&
                          new Date(record.date).toISOString().split("T")[0] ===
                            new Date(date).toISOString().split("T")[0]
                      )?.scheduleId) ||
                    STATE.FREE;

                  const options = getOptionsForDay(day, schedules);

                  const priorityOptions = [
                    "Ausencia",
                    "Cubre Almuerzo",
                    "Libre",
                    "Salida Programada",
                  ];

                  const sortedOptions = [...options].sort((a, b) => {
                    const indexA = priorityOptions.indexOf(a.label);
                    const indexB = priorityOptions.indexOf(b.label);

                    if (indexA !== -1 && indexB !== -1) {
                      return indexA - indexB;
                    }

                    if (indexA !== -1) return 1;
                    if (indexB !== -1) return -1;

                    return a.label.localeCompare(b.label);
                  });

                  const validLabel = sortedOptions.some(
                    (option) => option.label === selectedLabel
                  )
                    ? selectedLabel
                    : sortedOptions[0]?.label || "";

                  const menuItems = sortedOptions.map((option, index) => {
                    const items = [
                      <MenuItem key={option.id} value={option.label}>
                        {option.label}
                      </MenuItem>,
                    ];

                    if (option.label === "Ausencia" && index > 0) {
                      items.unshift(<Divider key="divider" />);
                    }

                    return items;
                  });

                  return (
                    <TableCell
                      key={day}
                      sx={{
                        backgroundColor:
                          todayString === formattedDate ? "#F0F2F5" : "inherit",
                      }}
                    >
                      <FormControl fullWidth>
                        <Select
                          value={validLabel}
                          onChange={(e) =>
                            onHandleChange(
                              employee,
                              day,
                              new Date(date),
                              String(e.target.value)
                            )
                          }
                          disabled={isFutureDate}
                        >
                          {menuItems}
                        </Select>
                      </FormControl>
                    </TableCell>
                  );
                })}

                <TableCell
                  align="center"
                  sx={{
                    position: "sticky",
                    right: 0,
                    zIndex: 2,
                    backgroundColor: getBackgroundColor(rowIndex),
                  }}
                >
                  {calculateTotalHours(
                    currentWeek,
                    hoursWorked,
                    schedules,
                    employee.id,
                    selectedColumn
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Divider />
      <TablePagination
        className="pagination"
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={sortedEmployees.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        labelRowsPerPage={TABLE.ROWS_PER_PAGE}
      />
    </Paper>
  );
};

export default DropdownTable;
