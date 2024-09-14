import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Grid,
  Box,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { addEmployee, removeEmployee } from "../store/slices/employeeSlice";
import SearchBar from "../components/SearchBar/SearchBar";
import ConfirmationDialog from "../components/Dialog/ConfirmationDialog";

const ManageEmployees: React.FC = () => {
  const dispatch = useDispatch();
  const employees = useSelector((state: RootState) => state.employee.employees);
  const [newEmployeeFirstName, setNewEmployeeFirstName] = useState("");
  const [newEmployeeLastName, setNewEmployeeLastName] = useState("");
  const [newEmployeeFirstNameError, setNewEmployeeFirstNameError] =
    useState("");
  const [newEmployeeLastNameError, setNewEmployeeLastNameError] = useState("");
  const [filter, setFilter] = useState("");
  const [showResults, setShowResults] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const handleAddEmployee = () => {
    let valid = true;

    if (!newEmployeeFirstName.trim()) {
      setNewEmployeeFirstNameError("El nombre es requerido.");
      valid = false;
    } else if (!/^[A-Za-z]+$/.test(newEmployeeFirstName.trim())) {
      setNewEmployeeFirstNameError("El nombre debe contener solo letras.");
      valid = false;
    } else {
      setNewEmployeeFirstNameError("");
    }

    if (!newEmployeeLastName.trim()) {
      setNewEmployeeLastNameError("El apellido es requerido.");
      valid = false;
    } else if (!/^[A-Za-z]+$/.test(newEmployeeLastName.trim())) {
      setNewEmployeeLastNameError("El apellido debe contener solo letras.");
      valid = false;
    } else {
      setNewEmployeeLastNameError("");
    }

    if (valid) {
      const fullName = `${newEmployeeFirstName.trim()} ${newEmployeeLastName.trim()}`;
      if (!employees.includes(fullName)) {
        dispatch(addEmployee(fullName));
        setNewEmployeeFirstName("");
        setNewEmployeeLastName("");
      }
    }
  };

  const handleRemoveEmployee = (name: string) => {
    setSelectedEmployee(name);
    setOpenDialog(true);
  };

  const handleConfirmRemove = () => {
    if (selectedEmployee) {
      dispatch(removeEmployee(selectedEmployee));
      setSelectedEmployee("");
      setOpenDialog(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEmployee("");
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.toLowerCase().includes(filter.toLowerCase())
  );

  useEffect(() => {
    setShowResults(filteredEmployees.length > 0);
  }, [filter, employees, filteredEmployees.length]);

  const paginatedEmployees = filteredEmployees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <Box sx={{ padding: 2 }}>
          <Typography variant="h2" sx={{ flexGrow: 1, margin: "25px 0" }}>
            Lista de Empleados
          </Typography>
          <SearchBar
            placeholder="Buscar Empleado"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <br />
          {showResults ? (
            <TableContainer component={Paper}>
              <Table stickyHeader>
                <TableBody>
                  {paginatedEmployees.map((employee) => (
                    <TableRow key={employee}>
                      <TableCell>{employee}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveEmployee(employee)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredEmployees.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(+event.target.value);
                  setPage(0);
                }}
              />
            </TableContainer>
          ) : (
            <p>No se encontraron empleados con el filtro '{filter}'.</p>
          )}
        </Box>
      </Grid>
      <Grid item xs={12} md={4}>
        <Box sx={{ padding: 2 }}>
          <Typography variant="h2" sx={{ flexGrow: 1, margin: "25px 0" }}>
            Nuevo Empleado
          </Typography>
          <TextField
            label="Nombre"
            value={newEmployeeFirstName}
            onChange={(e) => setNewEmployeeFirstName(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ marginBottom: 2 }}
            error={!!newEmployeeFirstNameError}
            helperText={newEmployeeFirstNameError}
          />
          <TextField
            label="Apellido"
            value={newEmployeeLastName}
            onChange={(e) => setNewEmployeeLastName(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{ marginBottom: 2 }}
            error={!!newEmployeeLastNameError}
            helperText={newEmployeeLastNameError}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddEmployee}
            sx={{ marginTop: 2 }}
          >
            Agregar
          </Button>
        </Box>
      </Grid>
      <ConfirmationDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmRemove}
        title="Eliminar"
        message="¿Está seguro que desea eliminar al empleado seleccionado?"
      />
    </Grid>
  );
};

export default ManageEmployees;
