import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Schedule } from "../models/Schedule";
import api from "../services/api";
import SearchBar from "../components/SearchBar/SearchBar";
import { getDayOptions, getMappedDay } from "../utils/tableUtils";
import ConfirmationDialog from "../components/Dialog/ConfirmationDialog";
import EditableTable from "../components/Table/EditableTable/EditableTable";

const ManageSchedules: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [newScheduleDay, setNewScheduleDay] = useState("");
  const [newScheduleLabel, setNewScheduleLabel] = useState("");
  const [newScheduleHours, setNewScheduleHours] = useState(0);
  const [editScheduleId, setEditScheduleId] = useState<number | null>(null);
  const [editScheduleDay, setEditScheduleDay] = useState("");
  const [editScheduleLabel, setEditScheduleLabel] = useState("");
  const [editScheduleHours, setEditScheduleHours] = useState(0);
  const [totalSchedules, setTotalSchedules] = useState(0);
  const [filter, setFilter] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
    null
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [labelError, setLabelError] = useState("");
  const [dayError, setDayError] = useState("");
  const [hoursError, setHoursError] = useState("");

  useEffect(() => {
    const fetchSchedules = async () => {
      const response = await api.get("/schedules");
      setSchedules(response.data);
      setTotalSchedules(response.data.length);
    };

    fetchSchedules();
  }, []);

  const validateFields = (): boolean => {
    let isValid = true;
    if (newScheduleLabel.trim() === "") {
      setLabelError("El lugar es obligatorio.");
      isValid = false;
    } else {
      setLabelError("");
    }

    if (newScheduleDay === "") {
      setDayError("Selecciona un día.");
      isValid = false;
    } else {
      setDayError("");
    }

    if (newScheduleHours < 0) {
      setHoursError("Las horas deben ser mayores o igual a 0.");
      isValid = false;
    } else {
      setHoursError("");
    }

    return isValid;
  };

  const handleAddSchedule = async () => {
    if (!validateFields()) {
      return;
    }

    const newSchedule = await api.post("/schedules", {
      day: newScheduleDay,
      label: newScheduleLabel,
      hours: newScheduleHours,
    });

    setSchedules([...schedules, newSchedule.data]);
    setNewScheduleDay("");
    setNewScheduleLabel("");
    setNewScheduleHours(0);
  };

  const handleDeleteSchedule = async (id: number) => {
    await api.delete(`/schedules/${id}`);
    setSchedules(schedules.filter((schedule) => schedule.id !== id));
    setOpenDialog(false);
  };

  const handleOpenDialog = (id: number) => {
    setSelectedScheduleId(id);
    setOpenDialog(true);
  };

  const handleUpdateSchedule = async (
    id: number,
    day: string,
    label: string,
    hours: number
  ) => {
    try {
      await api.put(`/schedules/${id}`, {
        day,
        label,
        hours,
      });
      setSchedules((prevSchedules) =>
        prevSchedules.map((schedule) =>
          schedule.id === id ? { ...schedule, day, label, hours } : schedule
        )
      );
    } catch (error) {
      console.error("Error actualizando el horario:", error);
    }
  };

  const handleEditClick = (schedule: Schedule) => {
    setEditScheduleId(schedule.id);
    setEditScheduleDay(schedule.day);
    setEditScheduleLabel(schedule.label);
    setEditScheduleHours(schedule.hours);
  };

  const handleSaveClick = (id: number) => {
    handleUpdateSchedule(
      id,
      editScheduleDay,
      editScheduleLabel,
      editScheduleHours
    );
    setEditScheduleId(null);
  };

  const filteredSchedules = schedules.filter((schedule) => {
    const mappedDay = getMappedDay(filter);
    return (
      `${schedule.label} ${schedule.day} ${schedule.hours}`
        .toLowerCase()
        .includes(filter.toLowerCase()) || schedule.day.includes(mappedDay)
    );
  });

  const startIndex = page * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredSchedules.length);
  const paginatedSchedules = filteredSchedules.slice(startIndex, endIndex);

  return (
    <Box>
      <Typography variant="h2" sx={{ flexGrow: 1, margin: "25px 0" }}>
        Administrar Horarios
      </Typography>
      <Grid
        container
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item>
          <SearchBar
            placeholder="Buscar Horario"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </Grid>
        <Grid item>
          <Box display="flex" alignItems="center">
            <TextField
              label="Lugar"
              variant="outlined"
              value={newScheduleLabel}
              onChange={(e) => setNewScheduleLabel(e.target.value)}
              sx={{ mr: 2 }}
              error={!!labelError}
              helperText={labelError}
            />
            <FormControl
              variant="outlined"
              sx={{ mr: 2, width: 200 }}
              error={!!dayError}
            >
              <InputLabel>Día</InputLabel>
              <Select
                label="Día"
                value={newScheduleDay}
                onChange={(e) => setNewScheduleDay(e.target.value as string)}
              >
                {getDayOptions().map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {dayError && (
                <Typography color="error" variant="caption">
                  {dayError}
                </Typography>
              )}
            </FormControl>
            <TextField
              label="Horas"
              variant="outlined"
              value={newScheduleHours}
              onChange={(e) => setNewScheduleHours(Number(e.target.value))}
              sx={{ mr: 2 }}
              error={!!hoursError}
              helperText={hoursError}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddSchedule}
              sx={{ height: "56px" }}
            >
              Agregar Horario
            </Button>
          </Box>
        </Grid>
      </Grid>
      <br />
      <EditableTable<Schedule>
        data={paginatedSchedules}
        columns={["label", "day", "hours"]}
        editRowId={editScheduleId}
        editFields={{
          label: editScheduleLabel,
          day: editScheduleDay,
          hours: editScheduleHours.toString(),
        }}
        page={page}
        rowsPerPage={rowsPerPage}
        setPage={setPage}
        setRowsPerPage={setRowsPerPage}
        setEditField={(field, value) => {
          if (field === "label") {
            setEditScheduleLabel(value);
          } else if (field === "day") {
            setEditScheduleDay(value);
          } else if (field === "hours") {
            setEditScheduleHours(Number(value));
          }
        }}
        handleEditClick={handleEditClick}
        handleSaveClick={handleSaveClick}
        handleOpenDialog={handleOpenDialog}
        getRowId={(schedule) => schedule.id}
        totalCount={totalSchedules}
      />
      {openDialog && selectedScheduleId !== null && (
        <ConfirmationDialog
          open={openDialog}
          title="Eliminar Horario"
          message="¿Estás seguro de que quieres eliminar este horario?"
          onConfirm={() => handleDeleteSchedule(selectedScheduleId)}
          onClose={() => setOpenDialog(false)}
        />
      )}
    </Box>
  );
};

export default ManageSchedules;
