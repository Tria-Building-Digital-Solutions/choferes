import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import DropdownTable from "../components/DropdownTable/DropdownTable";
import SearchBar from "../components/SearchBar/SearchBar";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";

const Dashboard: React.FC = () => {
  const employees = useSelector((state: RootState) => state.employee.employees);
  const [weekOffset, setWeekOffset] = useState(0);
  const [filter, setFilter] = useState("");
  const [showResults, setShowResults] = useState(true);

  const handleNextWeek = () => setWeekOffset(weekOffset + 1);
  const handlePreviousWeek = () => setWeekOffset(weekOffset - 1);
  const handleCurrentWeek = () => setWeekOffset(0);

  const filteredEmployees = employees.filter((employee) =>
    employee.toLowerCase().includes(filter.toLowerCase())
  );

  useEffect(() => {
    setShowResults(filteredEmployees.length > 0);
  }, [filter, employees, filteredEmployees.length]);

  return (
    <div>
      <Typography
        variant="h2"
        sx={{ flexGrow: 1, margin: '25px 0' }}
      >
        Roles
      </Typography>
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
        <Grid item>
          <Box display="flex" alignItems="center">
            <IconButton color="primary" onClick={handlePreviousWeek}>
              <ArrowBackIosNewRoundedIcon />
            </IconButton>
            <IconButton
              color="primary"
              disabled={weekOffset === 0}
              onClick={handleNextWeek}
            >
              <ArrowForwardIosRoundedIcon />
            </IconButton>
            <Box ml={2}>
              <Button
                variant="contained"
                endIcon={<CalendarTodayRoundedIcon />}
                disabled={weekOffset === 0}
                onClick={handleCurrentWeek}
              >
                Semana Actual
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <br />
      {showResults ? (
        <DropdownTable employees={filteredEmployees} weekOffset={weekOffset} />
      ) : (
        <p>No se encontraron empleados con el filtro '{filter}'.</p>
      )}
    </div>
  );
};

export default Dashboard;
