import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  IconButton,
} from "@mui/material";
import { TABLE } from "../../../constants/constants";
import { ColumnTranslations } from "../../../types/ColumnTransaltion";
import { getDayOptions } from "../../../utils/tableUtils";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

type EditableTableProps<T> = {
  data: T[];
  columns: (keyof T)[];
  editRowId: number | null;
  editFields: Record<string, string>;
  setEditField: (field: string, value: string) => void;
  handleEditClick: (row: T) => void;
  handleSaveClick: (id: number) => void;
  handleOpenDialog: (id: number) => void;
  getRowId: (row: T) => number;
  totalCount: number;
  page: number;
  rowsPerPage: number;
  setPage: (page: number) => void;
  setRowsPerPage: (rowsPerPage: number) => void;
};

const EditableTable = <T,>({
  data,
  columns,
  editRowId,
  editFields,
  setEditField,
  handleEditClick,
  handleSaveClick,
  handleOpenDialog,
  getRowId,
  totalCount,
  page,
  rowsPerPage,
  setPage,
  setRowsPerPage,
}: EditableTableProps<T>) => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof T>(columns[0]);

  const validateField = (field: string, value: string): boolean => {
    if (field === "firstName" || field === "lastName" || field === "label" || field === "day") {
      return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value);
    } else if (field === "hours") {
      return /^[0-9]+$/.test(value);
    }
    return true;
  };

  const checkFormValidity = useCallback(() => {
    const isValid = Object.keys(editFields).every((field) =>
      validateField(field, editFields[field])
    );
    setIsFormValid(isValid);
  }, [editFields]);

  useEffect(() => {
    checkFormValidity();
  }, [checkFormValidity]);

  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleSortRequest = (column: keyof T) => {
    const isAsc = orderBy === column && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(column);
  };

  const sortedData = [...data].sort((a, b) => {
    if (a[orderBy] < b[orderBy]) {
      return order === "asc" ? -1 : 1;
    }
    if (a[orderBy] > b[orderBy]) {
      return order === "asc" ? 1 : -1;
    }
    return 0;
  });

  const getColumnTranslation = (column: keyof T): string => {
    const translations: ColumnTranslations<T> = {
      firstName: "Nombre",
      lastName: "Apellido",
      label: "Lugar",
      day: "Día",
      hours: "Horas",
    } as any;

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
                <TableCell key={String(column)} className="tableCell">
                  <TableSortLabel
                    direction={orderBy === column ? order : "asc"}
                    onClick={() => handleSortRequest(column)}
                  >
                    {getColumnTranslation(column)}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell style={{ width: "100px" }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={getRowId(row)}>
                  {columns.map((column) => (
                    <TableCell key={String(column)} className="tableCell">
                      {editRowId === getRowId(row) ? (
                        column === "day" ? (
                          <FormControl variant="outlined" fullWidth>
                            <InputLabel>Día</InputLabel>
                            <Select
                              label="Día"
                              value={editFields[String(column)] || ""}
                              onChange={(e) =>
                                setEditField(String(column), e.target.value)
                              }
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
                            value={editFields[String(column)] || ""}
                            onChange={(e) =>
                              setEditField(String(column), e.target.value)
                            }
                            error={
                              !validateField(
                                String(column),
                                editFields[String(column)]
                              )
                            }
                          />
                        )
                      ) : column === "day" ? (
                        getDayTranslation(row[column as keyof T] as string) ||
                        null
                      ) : (
                        (row[column] as React.ReactNode)
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="actionCell">
                    {editRowId === getRowId(row) ? (
                      <Tooltip title="Guardar" arrow>
                        <IconButton
                          color="primary"
                          onClick={() => handleSaveClick(getRowId(row))}
                          className="saveIconButton"
                          disabled={!isFormValid}
                        >
                          <SaveIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Editar" arrow>
                        <IconButton
                          color="primary"
                          onClick={() => handleEditClick(row)}
                          className="saveIconButton"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Eliminar" arrow>
                      <IconButton
                        color="secondary"
                        onClick={() => handleOpenDialog(getRowId(row))}
                        className="saveIconButton"
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
        onPageChange={handlePageChange}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(+event.target.value);
          setPage(0);
        }}
        labelRowsPerPage={TABLE.ROWS_PER_PAGE}
        className="pagination"
      />
    </Paper>
  );
};

export default EditableTable;
