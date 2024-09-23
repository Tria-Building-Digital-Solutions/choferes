import React, { useEffect, useMemo, useState } from "react";
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
  isValidDateForSelect,
} from "../../../utils/dateUtils";
import {
  calculateTotalHours,
  getBackgroundColor,
} from "../../../utils/tableUtils";
import { Employee } from "../../../models/Employee";
import { STATE, TABLE } from "../../../constants/constants";
import { HoursWorked } from "../../../models/HoursWorked";
import { Schedule } from "../../../models/Schedule";
import { EnglishDayOfWeek } from "../../../utils/englishDayOfWeek";
import {
  getOptionsForDay,
  translateDayToAbrevSpanish,
} from "../../../utils/stringUtils";
import { getWeekNumber } from "../../../utils/hoursUtils";

interface DropdownTableProps {
  filteredEmployees: Employee[];
  weekOffset: number;
  schedules: Schedule[];
  hoursWorked: HoursWorked[];
  setPeriod: React.Dispatch<
    React.SetStateAction<"weekly" | "biweekly" | "monthly">
  >;
  handleChange: (
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
  setPeriod,
  handleChange,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedPeriod, setSelectedPeriod] = useState<
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

  const currentWeek = useMemo(
    () => getCurrentWeekDates(weekOffset),
    [weekOffset]
  );

  useEffect(() => {
    setPeriod(selectedPeriod);
  }, [selectedPeriod, setPeriod]);

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
              <TableCell align="center" colSpan={currentWeek.length + 2}>
                Semana {getWeekNumber(today)}
              </TableCell>
            </TableRow>
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
                  {`${translateDayToAbrevSpanish(
                    day as EnglishDayOfWeek
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
                    value={selectedPeriod}
                    onChange={(e) =>
                      setSelectedPeriod(
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
                key={employee.id}
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
                  const dateObject = new Date(date);
                  const existingRecord = hoursWorked.find(
                    (record) =>
                      record.employeeId === employee.id &&
                      new Date(record.date).toISOString().split("T")[0] ===
                        dateObject.toISOString().split("T")[0]
                  );

                  const selectedLabel = existingRecord
                    ? schedules.find(
                        (schedule) => schedule.id === existingRecord.scheduleId
                      )?.label || STATE.FREE
                    : STATE.FREE;

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

                  return (
                    <TableCell
                      key={day}
                      sx={{
                        backgroundColor:
                          todayString === formattedDate ? "#e4f5ed" : "inherit",
                      }}
                    >
                      <FormControl fullWidth>
                        <Select
                          value={selectedLabel}
                          onChange={(e) =>
                            handleChange(
                              employee,
                              day,
                              dateObject,
                              String(e.target.value)
                            )
                          }
                          disabled={!isValidDateForSelect(dateObject)}
                        >
                          {sortedOptions.map((option, index) => {
                            const items = [
                              <MenuItem key={option.id} value={option.label}>
                                {option.label}
                              </MenuItem>,
                            ];

                            if (option.label === "Ausencia" && index > 0) {
                              items.unshift(<Divider key="divider" />);
                            }

                            return items;
                          })}
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
                    selectedPeriod
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
        onPageChange={(_event, newPage) => setPage(newPage)}
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
