import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Grid,
  TextField,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useVehicles } from "../hooks/useVehicle";
import { Vehicle } from "../models/Vehicle";
import SplitButton from "../components/SplitButton/SplitButton";
import {
  createExportOptions,
  exportFileFormattedDate,
  exportToExcel,
  exportToPDF,
} from "../utils/exportUtils";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import SearchBar from "../components/SearchBar/SearchBar";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import EditableTable from "../components/Table/EditableTable/EditableTable";
import { BRANDS, COLORS, PAGE_TITLE } from "../constants/constants";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import { isTodayOrFuture } from "../utils/dateUtils";
import { maskLicensePlate, maskParkingLot } from "../utils/maskUtils";

const ManageVehicles: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const {
    vehicles,
    handleAddVehicle,
    handleUpdateVehicle,
    handleDeleteVehicle,
  } = useVehicles(selectedDate, page, rowsPerPage);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [editRowId, setEditRowId] = useState<number | null>(null);
  const [addFields, setAddFields] = useState({
    licensePlate: "",
    brand: "",
    color: "",
    parkingLot: "",
    notes: "",
  });
  const [editFields, setEditFields] = useState({
    licensePlate: "",
    brand: "",
    color: "",
    parkingLot: "",
    notes: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<number | null>(null);
  const [filter, setFilter] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [customBrand, setCustomBrand] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [customColor, setCustomColor] = useState("");

  useEffect(() => {
    const allVehicles = Object.values(vehicles).flat();
    const cleanedFilter = filter.replace(/[\s-]/g, "").toLowerCase();
    const filtered = allVehicles.filter((vehicle) => {
      const cleanedLicensePlate = vehicle.licensePlate
        .replace(/[\s-]/g, "")
        .toLowerCase();
      const cleanedParkingLot = vehicle.parkingLot
        .replace(/[\s-]/g, "")
        .toLowerCase();
      const isLicensePlateMatch = cleanedLicensePlate.includes(cleanedFilter);
      const isOtherFieldsMatch =
        `${vehicle.brand} ${vehicle.color} ${cleanedParkingLot} ${vehicle.notes}`
          .toLowerCase()
          .includes(cleanedFilter);

      return isLicensePlateMatch || isOtherFieldsMatch;
    });
    setFilteredVehicles(filtered);
    setTotalCount(filtered.length);
  }, [vehicles, filter]);

  const validateFields = useCallback(() => {
    const plateRegex = /^[A-ZÑ0-9]{3}-[A-ZÑ0-9]{3,4}$/;
    const textRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const parkingLotRegex = /^ATP[1-9]-\d{3,4}$/;
    const isLicensePlateValid =
      plateRegex.test(addFields.licensePlate.trim()) &&
      addFields.licensePlate !== "";
    const isModelValid =
      textRegex.test(addFields.brand) && addFields.brand !== "";
    const isColorValid =
      textRegex.test(addFields.color) && addFields.color !== "";
    const isParkingLotValid =
      parkingLotRegex.test(addFields.parkingLot.trim()) &&
      addFields.parkingLot !== "";
    setIsValid(
      isLicensePlateValid && isModelValid && isColorValid && isParkingLotValid
    );
  }, [addFields]);

  useEffect(() => {
    validateFields();
  }, [validateFields]);

  const handleAdd = () => {
    const newVehicle: Vehicle = {
      id: Math.max(...vehicles.map((vehicle) => vehicle.id)) + 1,
      licensePlate: addFields.licensePlate,
      brand: addFields.brand,
      color: addFields.color,
      parkingLot: addFields.parkingLot,
      notes: addFields.notes,
      createdAt: selectedDate,
    };
    handleAddVehicle(newVehicle);
    setAddFields({
      licensePlate: "",
      brand: "",
      color: "",
      parkingLot: "",
      notes: "",
    });
    setSelectedBrand("");
    setSelectedColor("");
  };

  const handleEditClick = (vehicle: Vehicle) => {
    setEditRowId(vehicle.id);
    setEditFields({
      licensePlate: vehicle.licensePlate,
      brand: vehicle.brand,
      color: vehicle.color,
      parkingLot: vehicle.parkingLot,
      notes: vehicle.notes,
    });
  };

  const handleSaveClick = (id: number) => {
    const updatedVehicle = {
      ...editFields,
    };
    handleUpdateVehicle(id, updatedVehicle);
    setEditRowId(null);
    setEditFields({
      licensePlate: "",
      brand: "",
      color: "",
      parkingLot: "",
      notes: "",
    });
  };

  const handleOpenDialog = (id: number) => {
    setDialogOpen(true);
    setVehicleToDelete(id);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setVehicleToDelete(null);
  };

  const handleDelete = () => {
    if (vehicleToDelete !== null) {
      handleDeleteVehicle(vehicleToDelete);
      handleCloseDialog();
    }
  };

  const handleDateChange = (newDate: Date | null) => {
    setSelectedDate(newDate);
  };

  const handleBrandChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectedBrand(value);
    if (value !== "Otro") {
      setCustomBrand("");
    }
    setAddFields({ ...addFields, brand: event.target.value });
  };

  const handleCustomBrandChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomBrand(event.target.value);
    setAddFields({ ...addFields, brand: event.target.value });
  };

  const handleColorChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    setSelectedColor(value);
    if (value !== "Otro") {
      setCustomColor("");
    }
    setAddFields({ ...addFields, color: event.target.value });
  };

  const handleCustomColorChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomColor(event.target.value);
    setAddFields({ ...addFields, color: event.target.value });
  };

  const handleLicensePlateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = event.target.value;
    const maskedValue = maskLicensePlate(rawValue);
    setAddFields((prevState) => ({ ...prevState, licensePlate: maskedValue }));
  };

  const handleParkingLotChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = event.target.value;
    const maskedValue = maskParkingLot(rawValue);
    setAddFields((prevState) => ({ ...prevState, parkingLot: maskedValue }));
  };

  const handleNextDate = () => {
    const nextDay = selectedDate
      ? new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000)
      : null;
    setSelectedDate(nextDay);
  };

  const handlePreviousDate = () => {
    const previousDay = selectedDate
      ? new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000)
      : null;
    setSelectedDate(previousDay);
  };

  const handleCurrentDate = () => {
    setSelectedDate(new Date());
  };

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
          {PAGE_TITLE.MANAGE_VEHICLES}
        </Typography>
        {filteredVehicles.length > 0 && (
          <SplitButton
            options={createExportOptions(
              <FontAwesomeIcon icon={faFileExcel} size="lg" />,
              <FontAwesomeIcon icon={faFilePdf} size="lg" />,
              exportToExcel,
              exportToPDF,
              filteredVehicles,
              `reporte-de-vehiculos-${exportFileFormattedDate(new Date())}`
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
        <Grid item xs={12}>
          <SearchBar
            placeholder="Buscar Vehículo"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{
              maxWidth: "100%",
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "column", md: "row" }}
            alignItems="flex-start"
            justifyContent="flex-end"
            gap={2}
          >
            <Box
              display="flex"
              flexDirection={{ xs: "row", sm: "row", md: "row" }}
              alignItems="center"
              justifyContent="flex-end"
              gap={2}
              width="100%"
            >
              <Tooltip title="Día Anterior" arrow>
                <Box>
                  <Button
                    variant="contained"
                    sx={{
                      height: "56px",
                      width: { xs: "auto", sm: "auto", md: "auto" },
                    }}
                    onClick={handlePreviousDate}
                  >
                    <ArrowBackIosNewRoundedIcon />
                  </Button>
                </Box>
              </Tooltip>
              <Tooltip title="Día Siguiente" arrow>
                <Box>
                  <Button
                    variant="contained"
                    sx={{
                      height: "56px",
                      width: { xs: "auto", sm: "auto", md: "auto" },
                    }}
                    disabled={isTodayOrFuture(selectedDate)}
                    onClick={handleNextDate}
                  >
                    <ArrowForwardIosRoundedIcon />
                  </Button>
                </Box>
              </Tooltip>
              <Tooltip title="Día Actual" arrow>
                <Box>
                  <Button
                    variant="contained"
                    sx={{
                      height: "56px",
                      width: { xs: "auto", sm: "auto", md: "auto" },
                    }}
                    disabled={isTodayOrFuture(selectedDate)}
                    onClick={handleCurrentDate}
                  >
                    <CalendarTodayRoundedIcon />
                  </Button>
                </Box>
              </Tooltip>
            </Box>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={es}
              localeText={{
                okButtonLabel: "Aceptar",
                cancelButtonLabel: "Cancelar",
                todayButtonLabel: "Hoy",
                year: "Año #{year}",
                previousMonth: "Mes anterior",
                nextMonth: "Mes siguiente",
              }}
            >
              <DatePicker
                label="Seleccionar fecha"
                value={selectedDate}
                sx={{
                  width: { xs: "100%", sm: "100%", md: "auto" },
                  mt: { xs: 2, sm: 2, md: 0 },
                }}
                maxDate={new Date()}
                onChange={handleDateChange}
              />
            </LocalizationProvider>
          </Box>
        </Grid>
        <Grid item sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={2}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label="Placa"
                variant="outlined"
                fullWidth
                value={addFields.licensePlate}
                onChange={handleLicensePlateChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              {selectedColor === "Otro" ? (
                <TextField
                  label="Marca"
                  variant="outlined"
                  fullWidth
                  value={customBrand}
                  onChange={handleCustomBrandChange}
                />
              ) : (
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Marca</InputLabel>
                  <Select
                    label="Marca"
                    value={selectedBrand}
                    onChange={handleBrandChange}
                  >
                    {BRANDS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              {selectedColor === "Otro" ? (
                <TextField
                  label="Color"
                  variant="outlined"
                  fullWidth
                  value={customColor}
                  onChange={handleCustomColorChange}
                />
              ) : (
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Color</InputLabel>
                  <Select
                    label="Color"
                    value={selectedColor}
                    onChange={handleColorChange}
                  >
                    {COLORS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Grid>
            <Grid item xs={12} sm={6} md={1}>
              <TextField
                label="Espacio"
                variant="outlined"
                fullWidth
                value={addFields.parkingLot}
                onChange={handleParkingLotChange}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <TextField
                label="Observaciones"
                variant="outlined"
                fullWidth
                value={addFields.notes}
                onChange={(e) =>
                  setAddFields({ ...addFields, notes: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} md={1}>
              <Tooltip title="Agregar Vehículo" arrow>
                <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ width: "100%", height: 56 }}
                    onClick={handleAdd}
                    disabled={!isValid}
                  >
                    <DirectionsCarIcon />
                  </Button>
                </Box>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <br />
      {filteredVehicles.length > 0 ? (
        <EditableTable<Vehicle>
          data={filteredVehicles}
          columns={["licensePlate", "brand", "color", "parkingLot", "notes"]}
          groupByDate={selectedDate}
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
          No se encontraron vehículos para mostrar.
        </Typography>
      )}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar este vehículo?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleCloseDialog}>
            Cancelar
          </Button>
          <Button color="secondary" onClick={handleDelete}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageVehicles;
