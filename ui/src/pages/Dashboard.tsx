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
import { useEmployees } from "../hooks/useEmployee";
import { useSchedules } from "../hooks/useSchedule";
import { useHours } from "../hooks/useHours";
import { useWeeklySummaries } from "../hooks/useWeeklySummary";
import { useMonthlySummaries } from "../hooks/useMonthlySummary";
import { useBiweeklySummaries } from "../hooks/useBiweeklySummary";
import {
  createExportOptions,
  exportToExcel,
  exportToPDF,
  handleExportTableData,
} from "../utils/exportUtils";
import { setDayOptionsEnglish } from "../utils/stringUtils";
import {
  getBiweekNumber,
  getCurrentWeekDates,
  getMonthNumber,
  getWeekNumber,
  isValidDateForSelect,
} from "../utils/dateUtils";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { updateHoursAndSummaries } from "../utils/calculationsUtils";
import { useSummaries } from "../hooks/useSummaries";

const Dashboard: React.FC = () => {
  const { employees, fetchEmployees } = useEmployees();
  const { schedules, fetchSchedules } = useSchedules();
  const { hoursWorked, fetchHours, handleAddHours, handleUpdateHours } =
    useHours();
  const { handleSummaryChange, handleSummaryUpdate } = useSummaries();
  const { weeklySummaries, fetchWeeklySummaries } = useWeeklySummaries();
  const { biweeklySummaries, fetchBiweeklySummaries } = useBiweeklySummaries();
  const { monthlySummaries, fetchMonthlySummaries } = useMonthlySummaries();
  const [weekOffset, setWeekOffset] = useState(0);
  const [weekNumber, setWeekNumber] = useState<number>(0);
  const [biweekNumber, setBiweekNumber] = useState<number>(0);
  const [month, setMonth] = useState<number>(0);
  const [year, setYear] = useState<number>(0);
  const [period, setPeriod] = useState<"weekly" | "biweekly" | "monthly">(
    "weekly"
  );
  const [filter, setFilter] = useState("");
  const [showResults, setShowResults] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await fetchEmployees();
      await fetchSchedules();
      await fetchHours();
      await fetchWeeklySummaries();
      await fetchBiweeklySummaries();
      await fetchMonthlySummaries();
    };
    fetchData();
  }, [
    hoursWorked,
    weeklySummaries,
    biweeklySummaries,
    monthlySummaries,
    fetchEmployees,
    fetchSchedules,
    fetchHours,
    fetchWeeklySummaries,
    fetchBiweeklySummaries,
    fetchMonthlySummaries,
  ]);

  useEffect(() => {
    const currentWeek = getCurrentWeekDates(weekOffset);
    if (currentWeek.length > 0) {
      const firstDayOfWeek = new Date(currentWeek[0].date);
      setWeekNumber(getWeekNumber(firstDayOfWeek));
      setBiweekNumber(getBiweekNumber(firstDayOfWeek));
      setMonth(getMonthNumber(firstDayOfWeek));
      setYear(firstDayOfWeek.getFullYear());
    }
  }, [weekOffset]);

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

    await updateHoursAndSummaries(
      employee,
      schedules,
      hoursWorked,
      weeklySummaries,
      biweeklySummaries,
      monthlySummaries,
      date,
      weekNumber,
      biweekNumber,
      month,
      year,
      selectedSchedule,
      handleAddHours,
      handleUpdateHours,
      handleSummaryChange,
      handleSummaryUpdate,
      fetchHours
    );

    await fetchWeeklySummaries();
    await fetchBiweeklySummaries();
    await fetchMonthlySummaries();
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
          weekNumber={weekNumber}
          biweekNumber={biweekNumber}
          month={month}
          year={year}
          setPeriod={setPeriod}
          handleChange={handleChange}
          weeklySummaries={weeklySummaries}
          biweeklySummaries={biweeklySummaries}
          monthlySummaries={monthlySummaries}
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
