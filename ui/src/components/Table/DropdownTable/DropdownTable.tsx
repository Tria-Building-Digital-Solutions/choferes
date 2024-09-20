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
import { getCurrentWeekDates } from "../../../utils/dateUtils";
import {
  calculateTotalHours,
  convertWeekDataToHoursWorked,
  getBackgroundColor,
  getOptionsForDay,
} from "../../../utils/tableUtils";
import api from "../../../services/api";
import { Employee } from "../../../models/Employee";
import { WeekData } from "../../../types/WeekData";
import { STATE, TABLE } from "../../../constants/constants";
import { HoursWorked } from "../../../models/HoursWorked";
import { Schedule } from "../../../models/Schedule";

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
  const [weekData, setWeekData] = useState<WeekData>({});
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
    selectedLabel: string
  ) => {
    const options = getOptionsForDay(day, schedules);
    const selectedOption = options.find(
      (option) => option.label === selectedLabel
    );
    const selectedHours = selectedOption ? selectedOption.hours : 0;

    if (employee.id !== undefined) {
      await api.put(`/hours/${employee.id}`, {
        weekOffset,
        day,
        label: selectedLabel,
        hours: selectedHours,
      });

      const updatedWeekData = { ...weekData };
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
                  zIndex: 2,
                }}
              >
                <TableSortLabel
                  active={true}
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
                  {`${day} ${date}`}
                </TableCell>
              ))}
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
                {currentWeek.map(({ day }) => {
                  const employeeIdStr = employee.id?.toString() || "";
                  const selectedLabel =
                    (employee.id !== undefined &&
                      weekData[employeeIdStr]?.[day]?.label) ||
                    STATE.FREE;

                  return (
                    <TableCell key={day}>
                      <FormControl fullWidth>
                        <Select
                          value={selectedLabel}
                          onChange={(e) =>
                            handleChange(employee, day, e.target.value)
                          }
                        >
                          {getOptionsForDay(day, schedules).reduce<
                            React.ReactNode[]
                          >((acc, option, index) => {
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
                          }, [])}
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
      />
    </Paper>
  );
};

export default DropdownTable;
