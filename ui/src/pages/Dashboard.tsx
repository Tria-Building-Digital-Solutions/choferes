import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Tooltip, Typography } from "@mui/material";
import DropdownTable from "../components/Table/DropdownTable/DropdownTable";
import SearchBar from "../components/SearchBar/SearchBar";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import {
  exportToExcel,
  exportToPDF,
  handleExportTableData,
} from "../utils/exportUtils";
import { Employee } from "../models/Employee";
import { useEmployees } from "../hooks/useEmployee";
import { useSchedules } from "../hooks/useSchedule";
import { useHours } from "../hooks/useHours";
import { AxiosError } from "axios";
import { HoursWorked } from "../models/HoursWorked";
import { setDayOptionsEnglish } from "../utils/stringUtils";
import { getCurrentWeekDates, isValidDateForSelect } from "../utils/dateUtils";

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
      date: date,
      scheduleId: selectedSchedule.id,
    };

    try {
      const existingRecord = hoursWorked.find(
        (record) =>
          record.employeeId === employee.id &&
          record.date.getTime() === date.getTime()
      );

      if (existingRecord) {
        await handleUpdateHours(existingRecord.id!, {
          scheduleId: selectedSchedule.id,
        });
      } else {
        await handleAddHours(newHours);
      }

      await fetchHours();
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.log(
          "Error en la respuesta del servidor:",
          axiosError.response.data
        );
      } else {
        console.log("Error desconocido:", error);
      }
    }
  };

  const { dataForExport, headers, fileName } = handleExportTableData(
    filteredEmployees,
    hoursWorked,
    schedules,
    getCurrentWeekDates(weekOffset),
    period
  );

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h2" sx={{ flexGrow: 1 }}>
          Administrar Roles
        </Typography>
        {showResults && (
          <Box display="flex" alignItems="center">
            <Tooltip title="Descargar Excel" arrow>
              <Button
                variant="contained"
                color="primary"
                sx={{ height: "56px", mr: 1 }}
                onClick={() => exportToExcel(dataForExport, fileName, headers)}
              >
                <FontAwesomeIcon icon={faFileExcel} size="lg" />
              </Button>
            </Tooltip>
            <Tooltip title="Descargar PDF" arrow>
              <Button
                variant="contained"
                color="secondary"
                sx={{ height: "56px" }}
                onClick={() => exportToPDF(dataForExport, fileName, headers)}
              >
                <FontAwesomeIcon icon={faFilePdf} size="lg" />
              </Button>
            </Tooltip>
          </Box>
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
