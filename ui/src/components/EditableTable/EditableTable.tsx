// EmployeeTable.tsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { Employee } from "../../models/Employee";

interface EditableTableProps {
  employees: Employee[];
  editEmployeeId: number | null;
  editFirstName: string;
  editLastName: string;
  page: number;
  rowsPerPage: number;
  setPage: (page: number) => void;
  setRowsPerPage: (rowsPerPage: number) => void;
  setEditFirstName: (firstName: string) => void;
  setEditLastName: (lastName: string) => void; 
  handleEditClick: (employee: Employee) => void;
  handleSaveClick: (id: number) => void;
  handleOpenDialog: (id: number) => void;
}

const EditableTable: React.FC<EditableTableProps> = ({
  employees,
  editEmployeeId,
  editFirstName,
  editLastName,
  page,
  rowsPerPage,
  setPage,
  setRowsPerPage,
  setEditFirstName,
  setEditLastName,
  handleEditClick,
  handleSaveClick,
  handleOpenDialog,
}) => {
  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  {editEmployeeId === employee.id ? (
                    <TextField
                      fullWidth
                      value={editFirstName}
                      onChange={(e) => setEditFirstName(e.target.value)}
                    />
                  ) : (
                    employee.firstName
                  )}
                </TableCell>
                <TableCell>
                  {editEmployeeId === employee.id ? (
                    <TextField
                      fullWidth
                      value={editLastName}
                      onChange={(e) => setEditLastName(e.target.value)}
                    />
                  ) : (
                    employee.lastName
                  )}
                </TableCell>
                <TableCell align="right">
                  {editEmployeeId === employee.id ? (
                    <IconButton
                      color="primary"
                      onClick={() => handleSaveClick(employee.id)}
                      sx={{ ml: 2 }}
                    >
                      <SaveIcon />
                    </IconButton>
                  ) : (
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(employee)}
                      sx={{ ml: 2 }}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  <IconButton
                    color="secondary"
                    onClick={() => handleOpenDialog(employee.id)}
                    sx={{ ml: 2 }}
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
        count={employees.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(+event.target.value);
          setPage(0);
        }}
      />
    </>
  );
};

export default EditableTable;
