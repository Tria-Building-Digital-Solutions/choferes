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
  Tooltip,
} from "@mui/material";
import EditableTable from "../components/Table/EditableTable/EditableTable";
import { Employee } from "../models/Employee";
import api from "../services/api";
import SearchBar from "../components/SearchBar/SearchBar";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";

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
  const [isValid, setIsValid] = useState(false);

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
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const isFirstNameValid =
      nameRegex.test(addFields.firstName) && addFields.firstName !== "";
    const isLastNameValid =
      nameRegex.test(addFields.lastName) && addFields.lastName !== "";
    setIsValid(isFirstNameValid && isLastNameValid);
  }, [addFields]);

  useEffect(() => {
    validateFields();
  }, [validateFields]);

  const handleAddEmployee = () => {
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
      })
      .catch((error) => console.error("Error adding employee", error));
  };

  const handleEditClick = (employee: Employee) => {
    setEditRowId(employee.id);
    setEditFields({
      firstName: employee.firstName,
      lastName: employee.lastName,
    });
  };

  const handleSaveClick = (id: number) => {
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
            />
            <TextField
              label="Apellido"
              variant="outlined"
              sx={{ mr: 2 }}
              value={addFields.lastName}
              onChange={(e) =>
                setAddFields({ ...addFields, lastName: e.target.value })
              }
            />
            <Tooltip title="Agregar Empleado" arrow>
              <Button
                variant="contained"
                color="primary"
                sx={{ height: "56px" }}
                onClick={handleAddEmployee}
                disabled={!isValid}
              >
                <PersonAddAlt1RoundedIcon />
              </Button>
            </Tooltip>
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
