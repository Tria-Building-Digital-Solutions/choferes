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
} from "@mui/material";
import { getCurrentWeekDates } from "../../utils/dateUtils";
import { STATE, TABLE } from "../../constants/constants";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { updateEmployeeSelection } from "../../store/slices/employeeSlice";
import {
  calculateTotalHours,
  getBackgroundColor,
  getOptionsForDay,
  convertWeekDataToHoursWorked, 
} from "../../utils/tableUtils";
import { Employee } from "../../models/Employee";
import { WeekData } from "../../types/WeekData";

interface DropdownTableProps {
  employees: Employee[];
  weekOffset: number;
}

const DropdownTable: React.FC<DropdownTableProps> = ({
  employees,
  weekOffset,
}) => {
  const dispatch = useDispatch();
  const currentWeek = useMemo(
    () => getCurrentWeekDates(weekOffset),
    [weekOffset]
  );

  const weekData = useSelector(
    (state: RootState) => state.employee.weekData[weekOffset] || {}
  ) as WeekData;

  const hoursWorked = convertWeekDataToHoursWorked(weekData); 

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [selectedColumn, setSelectedColumn] = useState<
    "weekly" | "biweekly" | "monthly"
  >("weekly");

  const handleChange = (
    employee: Employee,
    day: string,
    selectedLabel: string
  ) => {
    const selectedOption = getOptionsForDay(day).find(
      (option) => option.label === selectedLabel
    );
    const selectedHours = selectedOption ? selectedOption.hours : 0;

    if (employee.id !== undefined) {
      dispatch(
        updateEmployeeSelection({
          weekOffset,
          employeeId: employee.id,
          day,
          selection: { label: selectedLabel, hours: selectedHours },
        })
      );
    }
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedEmployees = employees.slice(startIndex, endIndex);

  if (!employees || employees.length === 0) {
    return <div>No hay empleados disponibles</div>;
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
              />
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
                key={`${employee.firstName}-${employee.lastName}-${rowIndex}`} // Ensure a unique key
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
                          displayEmpty
                        >
                          {getOptionsForDay(day).map((option) => (
                            <MenuItem key={option.label} value={option.label}>
                              {option.label}
                            </MenuItem>
                          ))}
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
