import React, { useEffect, useState } from "react";
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
  TableHead,
  TableSortLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { getDayOptions } from "../../../utils/tableUtils";

interface EditableTableProps<T> {
  data: T[];
  editRowId: number | null;
  editFields: { [key: string]: string };
  columns: (keyof T)[];
  page: number;
  rowsPerPage: number;
  setPage: (page: number) => void;
  setRowsPerPage: (rowsPerPage: number) => void;
  setEditField: (field: string, value: string) => void;
  handleEditClick: (row: T) => void;
  handleSaveClick: (id: number) => void;
  handleOpenDialog: (id: number) => void;
  getRowId: (row: T) => number;
  totalCount: number;
}

type ColumnTranslations<T> = {
  [key in keyof T]?: string;
};

const EditableTable = <T extends Record<string, any>>({
  data,
  editRowId,
  editFields,
  columns,
  page,
  rowsPerPage,
  setPage,
  setRowsPerPage,
  setEditField,
  handleEditClick,
  handleSaveClick,
  handleOpenDialog,
  getRowId,
  totalCount,
}: EditableTableProps<T>) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [orderBy, setOrderBy] = useState<keyof T | null>(null);
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    if (columns.length > 0) {
      setOrderBy(columns[0]);
      setOrderDirection("asc");
    }
  }, [columns]);

  const validateField = (field: string, value: string) => {
    if (!value) {
      return "Este campo es obligatorio";
    }
    if (/\d/.test(value)) {
      return "No puede contener números";
    }
    return "";
  };

  const handleFieldChange = (field: string, value: string) => {
    const errorMessage = validateField(field, value);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: errorMessage }));
    setEditField(field, value);
  };

  const isFormValid = () => {
    return Object.values(errors).every((error) => error === "");
  };

  const handleSortRequest = (column: keyof T) => {
    const isAsc = orderBy === column && orderDirection === "asc";
    setOrderDirection(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  const sortedData = () => {
    if (!orderBy) return data;
    return [...data].sort((a, b) => {
      if (a[orderBy] < b[orderBy]) {
        return orderDirection === "asc" ? -1 : 1;
      }
      if (a[orderBy] > b[orderBy]) {
        return orderDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const getColumnTranslation = (column: keyof T): string => {
    const translations: ColumnTranslations<T> = {
      firstName: "Nombre",
      lastName: "Apellido",
      label: "Lugar",
      day: "Día",
      hours: "Horas",
    };
    return translations[column] || String(column);
  };

  const getDayTranslation = (day: string): string => {
    const translations: { [key: string]: string } = {
      weekday: "Lunes a Jueves",
      friday: "Viernes",
      saturday: "Sábado",
      sunday: "Domingo",
    };
    return translations[day] || day;
  };

  return (
    <Paper sx={{ width: "100%" }}>
      <TableContainer className="table-container">
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={String(column)}>
                  <TableSortLabel
                    active={orderBy === column}
                    direction={orderBy === column ? orderDirection : "asc"}
                    onClick={() => handleSortRequest(column)}
                  >
                    {getColumnTranslation(column)}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData()
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={getRowId(row)}>
                  {columns.map((column) => (
                    <TableCell key={String(column)}>
                      {editRowId === getRowId(row) ? (
                        column === "day" ? (
                          <FormControl variant="outlined" fullWidth>
                            <InputLabel>Día</InputLabel>
                            <Select
                              label="Día"
                              value={editFields[column as string] || ""}
                              onChange={(e) =>
                                handleFieldChange(
                                  column as string,
                                  e.target.value
                                )
                              }
                              error={!!errors[column as string]}
                            >
                              {getDayOptions().map((option) => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        ) : (
                          <TextField
                            fullWidth
                            value={editFields[column as string] || ""}
                            onChange={(e) =>
                              handleFieldChange(
                                column as string,
                                e.target.value
                              )
                            }
                            error={!!errors[column as string]}
                            helperText={errors[column as string]}
                          />
                        )
                      ) : column === "day" ? (
                        getDayTranslation(row[column as keyof T] as string)
                      ) : (
                        row[column]
                      )}
                    </TableCell>
                  ))}
                  <TableCell align="right">
                    {editRowId === getRowId(row) ? (
                      <Tooltip title="Guardar" arrow>
                        <IconButton
                          color="primary"
                          onClick={() =>
                            isFormValid() && handleSaveClick(getRowId(row))
                          }
                          sx={{ ml: 2 }}
                          disabled={!isFormValid()}
                        >
                          <SaveIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Editar" arrow>
                        <IconButton
                          color="primary"
                          onClick={() => handleEditClick(row)}
                          sx={{ ml: 2 }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Eliminar" arrow>
                      <IconButton
                        color="secondary"
                        onClick={() => handleOpenDialog(getRowId(row))}
                        sx={{ ml: 2 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(+event.target.value);
          setPage(0);
        }}
      />
    </Paper>
  );
};

export default EditableTable;
