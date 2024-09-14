import React, { useMemo } from "react";
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
} from "@mui/material";
import { getCurrentWeekDates } from "../../utils/dateUtils";
import { STATE, TABLE } from "../../constants/constants";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { updateEmployeeSelection } from "../../store/slices/employeeSlice";
import { calculateTotalHours, getBackgroundColor, getOptionsForDay } from "../../utils/tableUtils";
import "./styles.css";

interface DropdownTableProps {
  employees: string[];
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
  );

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChange = (
    employee: string,
    day: string,
    selectedLabel: string
  ) => {
    const selectedOption = getOptionsForDay(day).find(
      (option) => option.label === selectedLabel
    );
    const selectedHours = selectedOption ? selectedOption.hours : 0;

    dispatch(
      updateEmployeeSelection({
        weekOffset,
        employee,
        day,
        selection: { label: selectedLabel, hours: selectedHours },
      })
    );
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedEmployees = employees.slice(startIndex, endIndex);

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
                align="center"
                sx={{
                  position: "sticky",
                  right: 0,
                  zIndex: 2,
                }}
              >
                Total Horas
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedEmployees.map((employee, rowIndex) => (
              <TableRow key={employee} sx={{ backgroundColor: getBackgroundColor(rowIndex) }}>
                <TableCell
                  sx={{
                    position: "sticky",
                    left: 0,
                    zIndex: 2,
                    backgroundColor: getBackgroundColor(rowIndex),
                  }}
                >
                  {employee}
                </TableCell>
                {currentWeek.map(({ day }) => {
                  const selectedLabel =
                    weekData[employee]?.[day]?.label || STATE.FREE;
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
                <TableCell
                  align="center"
                  sx={{
                    position: "sticky",
                    right: 0,
                    zIndex: 2,
                    backgroundColor: getBackgroundColor(rowIndex),
                  }}
                >
                  {calculateTotalHours(currentWeek, weekData, employee)}
                </TableCell>
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
