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
} from "@mui/material";
import EditableTable from "../components/Table/EditableTable/EditableTable";
import { Employee } from "../models/Employee";
import api from "../services/api";
import SearchBar from "../components/SearchBar/SearchBar";

const ManageEmployees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [editRowId, setEditRowId] = useState<number | null>(null);
  const [addFields, setAddFields] = useState({ firstName: "", lastName: "" });
  const [editFields, setEditFields] = useState({ firstName: "", lastName: "" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(null);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [errors, setErrors] = useState({ firstName: "", lastName: "" });
  const [isValid, setIsValid] = useState(false);
  const [isAttempted, setIsAttempted] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get("/employees");
        setEmployees(response.data);
        setTotalCount(response.data.length);
      } catch (error) {
        console.error("Error fetching employees", error);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    const filtered = employees.filter((employee) =>
      `${employee.firstName} ${employee.lastName}`
        .toLowerCase()
        .includes(filter.toLowerCase())
    );

    setFilteredEmployees(filtered);
    setTotalCount(filtered.length);
  }, [employees, filter]);

  const validateFields = useCallback(() => {
    const newErrors = { firstName: "", lastName: "" };
    const nameRegex = /^[a-zA-Z\s]+$/;

    if (!editFields.firstName) {
      newErrors.firstName = "El campo es requerido.";
    } else if (!nameRegex.test(editFields.firstName)) {
      newErrors.firstName = "El campo solo puede contener letras y espacios.";
    }

    if (!editFields.lastName) {
      newErrors.lastName = "El campo es requerido.";
    } else if (!nameRegex.test(editFields.lastName)) {
      newErrors.lastName = "El campo solo puede contener letras y espacios.";
    }

    setErrors(newErrors);
    setIsValid(!newErrors.firstName && !newErrors.lastName);
  }, [editFields]);

  useEffect(() => {
    validateFields();
  }, [validateFields]);

  const handleAddEmployee = () => {
    setIsAttempted(true);
    validateFields();

    if (!isValid) return;

    const newEmployee: Employee = {
      id: Math.max(...employees.map((employee) => employee.id)) + 1,
      firstName: addFields.firstName,
      lastName: addFields.lastName,
    };
    api
      .post("/employees", newEmployee)
      .then(() => {
        setEmployees([...employees, newEmployee]);
        setTotalCount(totalCount + 1);
        setAddFields({ firstName: "", lastName: "" });
        setErrors({ firstName: "", lastName: "" });
        setIsAttempted(false);
      })
      .catch((error) => console.error("Error adding employee", error));
  };

  const handleEditClick = (employee: Employee) => {
    setEditRowId(employee.id);
    setEditFields({
      firstName: employee.firstName,
      lastName: employee.lastName,
    });
    setErrors({ firstName: "", lastName: "" });
  };

  const handleSaveClick = (id: number) => {
    if (!isValid) return;

    const updatedEmployee = {
      ...editFields,
    };
    api
      .put(`/employees/${id}`, updatedEmployee)
      .then(() => {
        setEmployees(
          employees.map((employee) =>
            employee.id === id ? { ...employee, ...updatedEmployee } : employee
          )
        );
        setEditRowId(null);
        setEditFields({ firstName: "", lastName: "" });
        setErrors({ firstName: "", lastName: "" });
      })
      .catch((error) => console.error("Error updating employee", error));
  };

  const handleOpenDialog = (id: number) => {
    setDialogOpen(true);
    setEmployeeToDelete(id);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEmployeeToDelete(null);
  };

  const handleDelete = () => {
    if (employeeToDelete !== null) {
      api
        .delete(`/employees/${employeeToDelete}`)
        .then(() => {
          setEmployees(
            employees.filter((employee) => employee.id !== employeeToDelete)
          );
          setTotalCount(totalCount - 1);
          handleCloseDialog();
        })
        .catch((error) => console.error("Error deleting employee", error));
    }
  };

  return (
    <Box>
      <Typography variant="h2" sx={{ flexGrow: 1, margin: "25px 0" }}>
        Gestionar Empleados
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
            <TextField
              label="Nombre"
              variant="outlined"
              sx={{ mr: 2 }}
              value={addFields.firstName}
              onChange={(e) =>
                setAddFields({ ...addFields, firstName: e.target.value })
              }
              error={isAttempted && !!errors.firstName}
              helperText={isAttempted && errors.firstName}
            />
            <TextField
              label="Apellido"
              variant="outlined"
              sx={{ mr: 2 }}
              value={addFields.lastName}
              onChange={(e) =>
                setAddFields({ ...addFields, lastName: e.target.value })
              }
              error={isAttempted && !!errors.lastName}
              helperText={isAttempted && errors.lastName}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ height: "56px" }}
              onClick={handleAddEmployee}
              disabled={!isValid}
            >
              Agregar Empleado
            </Button>
          </Box>
        </Grid>
      </Grid>
      <br />
      {filteredEmployees.length > 0 ? (
        <EditableTable<Employee>
          data={filteredEmployees}
          columns={["firstName", "lastName"]}
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
          No se encontraron empleados que coincidan con la búsqueda.
        </Typography>
      )}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar este empleado?
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

export default ManageEmployees;
