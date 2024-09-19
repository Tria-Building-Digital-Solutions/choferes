import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import EditableTable from "../components/Table/EditableTable/EditableTable";
import { Schedule } from "../models/Schedule";
import api from "../services/api";
import SearchBar from "../components/SearchBar/SearchBar";
import { getDayOptions } from "../utils/tableUtils";

const ManageSchedules: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [editRowId, setEditRowId] = useState<number | null>(null);
  const [editFields, setEditFields] = useState({
    label: "",
    day: "",
    hours: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<number | null>(null);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await api.get("/schedules");
        setSchedules(response.data);
        setTotalCount(response.data.length);
      } catch (error) {
        console.error("Error fetching schedules", error);
      }
    };

    fetchSchedules();
  }, []);

  useEffect(() => {
    const filtered = schedules.filter((schedule) =>
      `${schedule.label} ${schedule.day} ${schedule.hours}`
        .toLowerCase()
        .includes(filter.toLowerCase())
    );

    setFilteredSchedules(filtered);
    setTotalCount(filtered.length);
  }, [schedules, filter]);

  const handleAddSchedule = () => {
    const newSchedule: Schedule = {
      id: Math.max(...schedules.map((schedule) => schedule.id)) + 1,
      label: editFields.label,
      day: editFields.day,
      hours: parseInt(editFields.hours, 10),
    };
    api
      .post("/schedules", newSchedule)
      .then(() => {
        setSchedules([...schedules, newSchedule]);
        setTotalCount(totalCount + 1);
        setEditFields({ label: "", day: "", hours: "" });
      })
      .catch((error) => console.error("Error adding schedule", error));
  };

  const handleEditClick = (schedule: Schedule) => {
    setEditRowId(schedule.id);
    setEditFields({
      label: schedule.label,
      day: schedule.day,
      hours: schedule.hours.toString(),
    });
  };

  const handleSaveClick = (id: number) => {
    const updatedSchedule = {
      ...editFields,
      hours: parseInt(editFields.hours, 10),
    };
    api
      .put(`/schedules/${id}`, updatedSchedule)
      .then(() => {
        setSchedules(
          schedules.map((schedule) =>
            schedule.id === id ? { ...schedule, ...updatedSchedule } : schedule
          )
        );
        setEditRowId(null);
        setEditFields({ label: "", day: "", hours: "" });
      })
      .catch((error) => console.error("Error updating schedule", error));
  };

  const handleOpenDialog = (id: number) => {
    setDialogOpen(true);
    setScheduleToDelete(id);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setScheduleToDelete(null);
  };

  const handleDelete = () => {
    if (scheduleToDelete !== null) {
      api
        .delete(`/schedules/${scheduleToDelete}`)
        .then(() => {
          setSchedules(
            schedules.filter((schedule) => schedule.id !== scheduleToDelete)
          );
          setTotalCount(totalCount - 1);
          handleCloseDialog();
        })
        .catch((error) => console.error("Error deleting schedule", error));
    }
  };

  return (
    <Box>
      <Typography variant="h2" sx={{ flexGrow: 1, margin: "25px 0" }}>
        Gestionar Horarios
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
              label="Label"
              variant="outlined"
              sx={{ mr: 2 }}
              value={editFields.label}
              onChange={(e) =>
                setEditFields({ ...editFields, label: e.target.value })
              }
            />
            <FormControl variant="outlined" sx={{ mr: 2, width: 200 }}>
              <InputLabel>Día</InputLabel>
              <Select
                label="Día"
                value={editFields.day}
                onChange={(e) =>
                  setEditFields({ ...editFields, day: e.target.value })
                }
              >
                {getDayOptions().map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Horas"
              variant="outlined"
              type="number"
              sx={{ mr: 2 }}
              value={editFields.hours}
              onChange={(e) =>
                setEditFields({ ...editFields, hours: e.target.value })
              }
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ height: "56px" }}
              onClick={handleAddSchedule}
            >
              Agregar Horario
            </Button>
          </Box>
        </Grid>
      </Grid>
      <br />
      {filteredSchedules.length > 0 ? (
        <EditableTable<Schedule>
          data={filteredSchedules}
          columns={["label", "day", "hours"]}
          editRowId={editRowId}
          editFields={editFields}
          setEditField={(field, value) =>
            setEditFields({ ...editFields, [field]: value })
          }
          handleEditClick={handleEditClick}
          handleSaveClick={handleSaveClick}
          handleOpenDialog={handleOpenDialog}
          getRowId={(row) => row.id}
          totalCount={totalCount}
          page={page}
          rowsPerPage={rowsPerPage}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
        />
      ) : (
        <Typography variant="h6" color="textSecondary">
          No se encontraron horarios que coincidan con la búsqueda.
        </Typography>
      )}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar este horario?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageSchedules;
