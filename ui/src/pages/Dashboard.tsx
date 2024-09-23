import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DropdownTable from "../components/Table/DropdownTable/DropdownTable";
import SearchBar from "../components/SearchBar/SearchBar";
import SplitButton from "../components/SplitButton/SplitButton";
import { Employee } from "../models/Employee";
import { HoursWorked } from "../models/HoursWorked";
import { useEmployees } from "../hooks/useEmployee";
import { useSchedules } from "../hooks/useSchedule";
import { useHours } from "../hooks/useHours";
import {
  createExportOptions,
  exportToExcel,
  exportToPDF,
  handleExportTableData,
} from "../utils/exportUtils";
import { setDayOptionsEnglish } from "../utils/stringUtils";
import { getCurrentWeekDates, isValidDateForSelect } from "../utils/dateUtils";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFilePdf } from "@fortawesome/free-solid-svg-icons";

const Dashboard: React.FC = () => {
  const { employees, fetchEmployees } = useEmployees();
  const { schedules, fetchSchedules } = useSchedules();
  const { hoursWorked, fetchHours, handleAddHours, handleUpdateHours } =
    useHours();
  const [weekOffset, setWeekOffset] = useState(0);
  const [filter, setFilter] = useState("");
  const [showResults, setShowResults] = useState(true);
  const [period, setPeriod] = useState<"weekly" | "biweekly" | "monthly">(
    "weekly"
  );

  useEffect(() => {
    const fetchData = async () => {
      await fetchEmployees();
      await fetchSchedules();
      await fetchHours();
    };
    fetchData();
  }, [fetchEmployees, fetchSchedules, fetchHours]);

  const handleNextWeek = () => setWeekOffset(weekOffset + 1);
  const handlePreviousWeek = () => setWeekOffset(weekOffset - 1);
  const handleCurrentWeek = () => setWeekOffset(0);

  const filteredEmployees = employees.filter((employee) =>
    `${employee.firstName} ${employee.lastName}`
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  useEffect(() => {
    setShowResults(filteredEmployees.length > 0);
  }, [filter, employees, filteredEmployees.length]);

  const handleChange = async (
    employee: Employee,
    day: string,
    date: Date,
    selectedLabel: string
  ) => {
    const selectedSchedule = schedules.find(
      (schedule) =>
        schedule.label === selectedLabel &&
        schedule.day === setDayOptionsEnglish(day)
    );

    if (!selectedSchedule) {
      console.error("No se encontró un horario para el label seleccionado");
      return;
    }

    const newHours: HoursWorked = {
      employeeId: employee.id,
      date,
      scheduleId: selectedSchedule.id,
    };

    const existingRecord = hoursWorked.find((record) => {
      const recordDate = new Date(record.date);
      return (
        record.employeeId === employee.id &&
        recordDate.getTime() === date.getTime()
      );
    });

    // const scheduleHours = selectedSchedule.hours;
    // const totalHours = existingRecord ? scheduleHours : scheduleHours;

    if (existingRecord) {
      await handleUpdateHours(existingRecord.id!, {
        scheduleId: selectedSchedule.id,
      });
    } else {
      await handleAddHours(newHours);
    }

    // const weekNumber = getWeekNumber(date);
    // const month = date.getMonth() + 1;
    // const year = date.getFullYear();

    // const existingSummary = weeklySummaries.find(
    //   (summary) =>
    //     summary.employeeId === employee.id &&
    //     summary.weekNumber === weekNumber &&
    //     summary.month === month &&
    //     summary.year === year
    // );

    // if (existingSummary) {
    //   await handleUpdateWeeklySummary(existingSummary.id!, {
    //     totalHours: existingSummary.totalHours + totalHours,
    //   });
    // } else {
    //   const newWeeklySummary = {
    //     employeeId: employee.id,
    //     weekNumber,
    //     month,
    //     year,
    //     totalHours,
    //   };
    //   await handleAddWeeklySummary(newWeeklySummary);
    // }

    await fetchHours();
  };

  const { dataForExport, headers, fileName } = handleExportTableData(
    filteredEmployees,
    hoursWorked,
    schedules,
    getCurrentWeekDates(weekOffset),
    period
  );

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant={isSmallScreen ? "h4" : "h2"} sx={{ flexGrow: 1 }}>
          Administrar Roles
        </Typography>
        {showResults && (
          <SplitButton
            options={createExportOptions(
              <FontAwesomeIcon icon={faFileExcel} size="lg" />,
              <FontAwesomeIcon icon={faFilePdf} size="lg" />,
              exportToExcel,
              exportToPDF, 
              dataForExport, 
              fileName,
              headers
            )}
            defaultIndex={0}
            buttonIcon={<DownloadRoundedIcon />}
          />
        )}
      </Box>

      <Grid
        container
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item>
          <SearchBar
            placeholder="Buscar Empleado"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </Grid>
        {showResults && (
          <Grid item>
            <Box display="flex" alignItems="center">
              <Tooltip title="Semana Anterior" arrow>
                <Button
                  variant="contained"
                  sx={{ mr: 2, height: "56px" }}
                  onClick={handlePreviousWeek}
                >
                  <ArrowBackIosNewRoundedIcon />
                </Button>
              </Tooltip>
              <Tooltip title="Semana Siguiente" arrow>
                <span>
                  <Button
                    variant="contained"
                    sx={{ mr: 2, height: "56px" }}
                    disabled={
                      !isValidDateForSelect(
                        new Date(getCurrentWeekDates(weekOffset + 1)[0].isoDate)
                      )
                    }
                    onClick={handleNextWeek}
                  >
                    <ArrowForwardIosRoundedIcon />
                  </Button>
                </span>
              </Tooltip>
              <Tooltip title="Semana Actual" arrow>
                <span>
                  <Button
                    variant="contained"
                    sx={{ height: "56px" }}
                    disabled={weekOffset === 0}
                    onClick={handleCurrentWeek}
                  >
                    <CalendarTodayRoundedIcon />
                  </Button>
                </span>
              </Tooltip>
            </Box>
          </Grid>
        )}
      </Grid>
      <br />

      {showResults ? (
        <DropdownTable
          filteredEmployees={filteredEmployees}
          schedules={schedules}
          hoursWorked={hoursWorked}
          weekOffset={weekOffset}
          setPeriod={setPeriod}
          handleChange={handleChange}
        />
      ) : (
        <Typography variant="h6" color="textSecondary">
          No se encontraron empleados que coincidan con la búsqueda.
        </Typography>
      )}
    </Box>
  );
};

export default Dashboard;
