import React, { useState, useEffect } from "react";
import { Button, TextField, Grid, Box, Typography } from "@mui/material";
import SearchBar from "../components/SearchBar/SearchBar";
import ConfirmationDialog from "../components/Dialog/ConfirmationDialog";
import { Employee } from "../models/Employee";
import api from "../services/api";
import EditableTable from "../components/Table/EditableTable/EditableTable";

const ManageEmployees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployeeFirstName, setNewEmployeeFirstName] = useState("");
  const [newEmployeeLastName, setNewEmployeeLastName] = useState("");
  const [editEmployeeId, setEditEmployeeId] = useState<number | null>(null);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [filter, setFilter] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await api.get("/employees");
      setEmployees(response.data);
      setTotalEmployees(response.data.length);
    };

    fetchEmployees();
  }, []);

  const validateFields = (): boolean => {
    let isValid = true;
    if (newEmployeeFirstName.trim() === "") {
      setFirstNameError("El nombre es obligatorio.");
      isValid = false;
    } else {
      setFirstNameError("");
    }

    if (newEmployeeLastName.trim() === "") {
      setLastNameError("El apellido es obligatorio.");
      isValid = false;
    } else {
      setLastNameError("");
    }

    return isValid;
  };

  const handleAddEmployee = async () => {
    if (!validateFields()) {
      return; 
    }

    const newEmployee = await api.post("/employees", {
      firstName: newEmployeeFirstName,
      lastName: newEmployeeLastName,
    });

    setEmployees([...employees, newEmployee.data]);
    setNewEmployeeFirstName("");
    setNewEmployeeLastName("");
  };

  const handleDeleteEmployee = async (id: number) => {
    await api.delete(`/employees/${id}`);
    setEmployees(employees.filter((employee) => employee.id !== id));
    setOpenDialog(false);
  };

  const handleOpenDialog = (id: number) => {
    setSelectedEmployeeId(id);
    setOpenDialog(true);
  };

  const handleUpdateEmployee = async (
    id: number,
    firstName: string,
    lastName: string
  ) => {
    try {
      await api.put(`/employees/${id}`, {
        firstName,
        lastName,
      });
      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee.id === id ? { ...employee, firstName, lastName } : employee
        )
      );
    } catch (error) {
      console.error("Error actualizando el empleado:", error);
    }
  };

  const handleEditClick = (employee: Employee) => {
    setEditEmployeeId(employee.id);
    setEditFirstName(employee.firstName);
    setEditLastName(employee.lastName);
  };

  const handleSaveClick = (id: number) => {
    handleUpdateEmployee(id, editFirstName, editLastName);
    setEditEmployeeId(null);
  };

  const filteredEmployees = employees.filter((employee) =>
    `${employee.firstName} ${employee.lastName}`
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  const startIndex = page * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredEmployees.length);
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

  return (
    <Box>
      <Typography variant="h2" sx={{ flexGrow: 1, margin: "25px 0" }}>
        Administrar Empleados
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
              value={newEmployeeFirstName}
              onChange={(e) => setNewEmployeeFirstName(e.target.value)}
              sx={{ mr: 2 }}
              error={!!firstNameError}
              helperText={firstNameError}
            />
            <TextField
              label="Apellido"
              variant="outlined"
              value={newEmployeeLastName}
              onChange={(e) => setNewEmployeeLastName(e.target.value)}
              sx={{ mr: 2 }}
              error={!!lastNameError}
              helperText={lastNameError}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddEmployee}
              sx={{ height: "56px" }}
            >
              Agregar Empleado
            </Button>
          </Box>
        </Grid>
      </Grid>
      <br/>
      <EditableTable<Employee>
        data={paginatedEmployees}
        columns={["firstName", "lastName"]}
        editRowId={editEmployeeId}
        editFields={{
          firstName: editFirstName,
          lastName: editLastName,
        }}
        page={page}
        rowsPerPage={rowsPerPage}
        setPage={setPage}
        setRowsPerPage={setRowsPerPage}
        setEditField={(field, value) => {
          if (field === "firstName") {
            setEditFirstName(value);
          } else if (field === "lastName") {
            setEditLastName(value);
          }
        }}
        handleEditClick={handleEditClick}
        handleSaveClick={handleSaveClick}
        handleOpenDialog={handleOpenDialog}
        getRowId={(employee) => employee.id}
        totalCount={totalEmployees}
      />
      {openDialog && selectedEmployeeId !== null && (
        <ConfirmationDialog
          open={openDialog}
          title="Eliminar Empleado"
          message="¿Estás seguro de que quieres eliminar este empleado?"
          onConfirm={() => handleDeleteEmployee(selectedEmployeeId)}
          onClose={() => setOpenDialog(false)}
        />
      )}
    </Box>
  );
};

export default ManageEmployees;
