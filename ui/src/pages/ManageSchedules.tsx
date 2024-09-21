import React, { useState, useEffect, useCallback } from "react";
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
  Tooltip,
} from "@mui/material";
import EditableTable from "../components/Table/EditableTable/EditableTable";
import { Schedule } from "../models/Schedule";
import api from "../services/api";
import SearchBar from "../components/SearchBar/SearchBar";
import { getDayOptions } from "../utils/tableUtils";
import PostAddRoundedIcon from "@mui/icons-material/PostAddRounded";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { exportFileFormattedDate, exportToExcel, exportToPDF } from "../utils/exportUtils";

const ManageSchedules: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [editRowId, setEditRowId] = useState<number | null>(null);
  const [addFields, setAddFields] = useState({
    label: "",
    day: "",
    hours: "",
  });
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
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const fetchSchedules = async () => {
      const response = await api.get("/schedules");
      setSchedules(response.data);
      setTotalCount(response.data.length);
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

  const validateFields = useCallback(() => {
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const isLabelValid =
      nameRegex.test(addFields.label) && addFields.label !== "";
    const isDayValid = addFields.day !== "";
    const isHoursValid = /^[0-9]+$/.test(addFields.hours);
    setIsValid(isLabelValid && isDayValid && isHoursValid);
  }, [addFields]);

  useEffect(() => {
    validateFields();
  }, [validateFields]);

  const handleAddSchedule = () => {
    const newSchedule: Schedule = {
      id: Math.max(...schedules.map((schedule) => schedule.id)) + 1,
      label: addFields.label,
      day: addFields.day,
      hours: parseInt(addFields.hours, 10),
    };
    api.post("/schedules", newSchedule).then(() => {
      setSchedules([...schedules, newSchedule]);
      setTotalCount(totalCount + 1);
      setAddFields({ label: "", day: "", hours: "" });
    });
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
    api.put(`/schedules/${id}`, updatedSchedule).then(() => {
      setSchedules(
        schedules.map((schedule) =>
          schedule.id === id ? { ...schedule, ...updatedSchedule } : schedule
        )
      );
      setEditRowId(null);
      setEditFields({ label: "", day: "", hours: "" });
    });
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
      api.delete(`/schedules/${scheduleToDelete}`).then(() => {
        setSchedules(
          schedules.filter((schedule) => schedule.id !== scheduleToDelete)
        );
        setTotalCount(totalCount - 1);
        handleCloseDialog();
      });
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h2" sx={{ flexGrow: 1 }}>
          Gestionar Horarios
        </Typography>
        <Box display="flex" alignItems="center">
          <Tooltip title="Descargar Excel" arrow>
            <Button
              variant="contained"
              color="primary"
              sx={{ height: "56px", mr: 1 }}
              onClick={() => exportToExcel(filteredSchedules, `horarios-${exportFileFormattedDate(new Date())}`)}
            >
              <FontAwesomeIcon icon={faFileExcel} size="lg" />
            </Button>
          </Tooltip>
          <Tooltip title="Descargar PDF" arrow>
            <Button
              variant="contained"
              color="secondary"
              sx={{ height: "56px" }}
              onClick={() => exportToPDF(filteredSchedules, `horarios-${exportFileFormattedDate(new Date())}`)}
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
              sx={{ mr: 2 }}
              value={addFields.label}
              onChange={(e) =>
                setAddFields({ ...addFields, label: e.target.value })
              }
            />
            <FormControl variant="outlined" sx={{ mr: 2, width: 200 }}>
              <InputLabel>Día</InputLabel>
              <Select
                label="Día"
                value={addFields.day}
                onChange={(e) =>
                  setAddFields({ ...addFields, day: e.target.value })
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
              value={addFields.hours}
              onChange={(e) =>
                setAddFields({ ...addFields, hours: e.target.value })
              }
            />
            <Tooltip title="Agregar Horario" arrow>
              <Button
                variant="contained"
                color="primary"
                sx={{ height: "56px" }}
                onClick={handleAddSchedule}
                disabled={!isValid}
              >
                <PostAddRoundedIcon />
              </Button>
            </Tooltip>
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
