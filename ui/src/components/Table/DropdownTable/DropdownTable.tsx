import React, { useMemo, useState, useEffect } from "react";
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
import { formatHeaderDate, getCurrentWeekDates } from "../../../utils/dateUtils";
import {
  calculateTotalHours,
  convertWeekDataToHoursWorked,
  getBackgroundColor,
  getOptionsForDay,
} from "../../../utils/tableUtils";
import api from "../../../services/api";
import { Employee } from "../../../models/Employee";
import { STATE, TABLE } from "../../../constants/constants";
import { HoursWorked } from "../../../models/HoursWorked";
import { Schedule } from "../../../models/Schedule";
import { translateDayToSpanish } from "../../../utils/calculationUtils";
import { DayOfWeek } from "../../../types/DayOfWeek";

interface DropdownTableProps {
  weekOffset: number;
}

const DropdownTable: React.FC<DropdownTableProps> = ({ weekOffset }) => {
  const currentWeek = useMemo(
    () => getCurrentWeekDates(weekOffset),
    [weekOffset]
  );

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [weekData, setWeekData] = useState<
    Record<number, Record<string, { label: string; hours: number }>>
  >({});
  const [hoursWorked, setHoursWorked] = useState<HoursWorked[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedColumn, setSelectedColumn] = useState<
    "weekly" | "biweekly" | "monthly"
  >("weekly");
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await api.get("/employees");
      setEmployees(response.data);
    };

    const fetchSchedules = async () => {
      const response = await api.get("/schedules");
      setSchedules(response.data);
    };

    const fetchWeekData = async () => {
      const response = await api.get(`/hours?weekOffset=${weekOffset}`);
      setWeekData(response.data);
      setHoursWorked(convertWeekDataToHoursWorked(response.data));
    };

    fetchEmployees();
    fetchSchedules();
    fetchWeekData();
  }, [weekOffset]);

  const handleChange = async (
    employee: Employee,
    day: string,
    date: Date,
    selectedLabel: string
  ) => {
    const options = getOptionsForDay(day, schedules);
    const selectedOption = options.find(
      (option) => option.label === selectedLabel
    );
    const selectedHours = selectedOption ? selectedOption.hours : 0;

    if (employee.id !== undefined) {
      const date = new Date().toISOString();

      await api.put(`/hours/${employee.id}`, {
        employeeId: employee.id,
        date: new Date(date).toISOString(),
        hours: selectedHours,
      });

      const updatedWeekData = { ...weekData };

      if (!updatedWeekData[employee.id]) {
        updatedWeekData[employee.id] = {};
      }

      updatedWeekData[employee.id][day] = {
        label: selectedLabel,
        hours: selectedHours,
      };

      setWeekData(updatedWeekData);
    }
  };

  const sortedEmployees = useMemo(() => {
    return [...employees].sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`;
      const nameB = `${b.firstName} ${b.lastName}`;
      return orderDirection === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
  }, [employees, orderDirection]);

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

  if (!employees || employees.length === 0) {
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
              {currentWeek.map(({ day, date }) => {
                return (
                  <TableCell key={day} align="center">
                    {`${translateDayToSpanish(day as DayOfWeek)} ${formatHeaderDate(date)}`}
                  </TableCell>
                );
              })}
              <TableCell
                align="right"
                sx={{
                  position: "sticky",
                  right: 0,
                  zIndex: 2,
                }}
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
                    employee.id !== undefined &&
                    weekData[employee.id]?.[day]?.label
                      ? weekData[employee.id][day].label
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

                  const validLabel = sortedOptions.some(
                    (option) => option.label === selectedLabel
                  )
                    ? selectedLabel
                    : sortedOptions[0]?.label || "";

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
                            handleChange(
                              employee,
                              day,
                              new Date(date),
                              e.target.value
                            )
                          }
                          disabled={isFutureDate}
                        >
                          {sortedOptions.reduce<React.ReactNode[]>(
                            (acc, option, index) => {
                              acc.push(
                                <MenuItem key={option.id} value={option.label}>
                                  {option.label}
                                </MenuItem>
                              );
                              if (option.label === "Ausencia" && index > 0) {
                                acc.splice(
                                  acc.length - 1,
                                  0,
                                  <Divider key={`divider-${option.id}`} />
                                );
                              }
                              return acc;
                            },
                            []
                          )}
                        </Select>
                      </FormControl>
                    </TableCell>
                  );
                })}
                {selectedColumn === "weekly" && (
                  <TableCell
                    align="center"
                    sx={{
                      position: "sticky",
                      right: 0,
                      zIndex: 2,
                      backgroundColor: getBackgroundColor(rowIndex),
                    }}
                  >
                    {employee.id !== undefined &&
                      calculateTotalHours(
                        currentWeek,
                        hoursWorked,
                        employee.id,
                        "weekly"
                      )}
                  </TableCell>
                )}
                {selectedColumn === "biweekly" && (
                  <TableCell
                    align="center"
                    sx={{
                      position: "sticky",
                      right: 0,
                      zIndex: 2,
                      backgroundColor: getBackgroundColor(rowIndex),
                    }}
                  >
                    {employee.id !== undefined &&
                      calculateTotalHours(
                        currentWeek,
                        hoursWorked,
                        employee.id,
                        "biweekly"
                      )}
                  </TableCell>
                )}
                {selectedColumn === "monthly" && (
                  <TableCell
                    align="center"
                    sx={{
                      position: "sticky",
                      right: 0,
                      zIndex: 2,
                      backgroundColor: getBackgroundColor(rowIndex),
                    }}
                  >
                    {employee.id !== undefined &&
                      calculateTotalHours(
                        currentWeek,
                        hoursWorked,
                        employee.id,
                        "monthly"
                      )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={employees.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(+event.target.value);
          setPage(0);
        }}
        labelRowsPerPage={TABLE.ROWS_PER_PAGE}
      />
    </Paper>
  );
};

export default DropdownTable;
