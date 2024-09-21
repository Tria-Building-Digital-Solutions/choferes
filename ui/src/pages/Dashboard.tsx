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
  exportFileFormattedDate,
  exportToExcel,
  exportToPDF,
} from "../utils/exportUtils";
import api from "../services/api";
import { Employee } from "../models/Employee";

const Dashboard: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [filter, setFilter] = useState("");
  const [showResults, setShowResults] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await api.get("/employees");
      setEmployees(response.data);
    };

    fetchEmployees();
  }, []);

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

  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h2" sx={{ flexGrow: 1 }}>
          Administrar Roles
        </Typography>
        <Box display="flex" alignItems="center">
          <Tooltip title="Descargar Excel" arrow>
            <Button
              variant="contained"
              color="primary"
              sx={{ height: "56px", mr: 1 }}
              onClick={() =>
                exportToExcel(
                  filteredEmployees,
                  `roles-${exportFileFormattedDate(new Date())}`
                )
              }
            >
              <FontAwesomeIcon icon={faFileExcel} size="lg" />
            </Button>
          </Tooltip>
          <Tooltip title="Descargar PDF" arrow>
            <Button
              variant="contained"
              color="secondary"
              sx={{ height: "56px" }}
              onClick={() =>
                exportToPDF(
                  filteredEmployees,
                  `roles-${exportFileFormattedDate(new Date())}`
                )
              }
            >
              <FontAwesomeIcon icon={faFilePdf} size="lg" />
            </Button>
          </Tooltip>
        </Box>
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
                    disabled={weekOffset === 0}
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
          weekOffset={weekOffset}
        />
      ) : (
        <Typography variant="h6" color="textSecondary">
          No se encontraron empleados que coincidan con la búsqueda.
        </Typography>
      )}
    </div>
  );
};

export default Dashboard;
