import React, { useState, useEffect } from "react";
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
import SearchBar from "../components/SearchBar/SearchBar";
import ConfirmationDialog from "../components/Dialog/ConfirmationDialog";
import { Employee } from "../models/Employee";
import api from "../services/api";

const ManageEmployees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployeeFirstName, setNewEmployeeFirstName] = useState("");
  const [newEmployeeLastName, setNewEmployeeLastName] = useState("");
  const [filter, setFilter] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await api.get("/employees");
      setEmployees(response.data);
    };

    fetchEmployees();
  }, []);

  const handleAddEmployee = async () => {
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

  const filteredEmployees = employees.filter((employee) =>
    `${employee.firstName} ${employee.lastName}`
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

  return (
    <Box>
      <Typography variant="h2" sx={{ flexGrow: 1, margin: "25px 0" }}>
        Administrar Empleados
      </Typography>
      <Grid container spacing={2} justifyContent="space-between" alignItems="center">
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
            />
            <TextField
              label="Apellido"
              variant="outlined"
              value={newEmployeeLastName}
              onChange={(e) => setNewEmployeeLastName(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleAddEmployee}>
              Agregar Empleado
            </Button>
          </Box>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {paginatedEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.firstName}</TableCell>
                <TableCell>{employee.lastName}</TableCell>
                <TableCell>
                  <IconButton
                    color="secondary"
                    onClick={() => handleOpenDialog(employee.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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

