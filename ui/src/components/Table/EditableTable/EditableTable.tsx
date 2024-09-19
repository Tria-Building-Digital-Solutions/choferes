import React from "react";
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
  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

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
                <TableCell key={String(column)} style={{ width: "150px" }}>
                  <TableSortLabel>
                    {getColumnTranslation(column)}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell style={{ width: "100px" }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={getRowId(row)}>
                  {columns.map((column, index) => (
                    <TableCell key={String(column)} style={{ width: "150px" }}>
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
                  <TableCell
                    style={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    {editRowId === getRowId(row) ? (
                      <Tooltip title="Guardar" arrow>
                        <IconButton
                          color="primary"
                          onClick={() => handleSaveClick(getRowId(row))}
                          sx={{ ml: 1 }} 
                        >
                          <SaveIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Editar" arrow>
                        <IconButton
                          color="primary"
                          onClick={() => handleEditClick(row)}
                          sx={{ ml: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Eliminar" arrow>
                      <IconButton
                        color="secondary"
                        onClick={() => handleOpenDialog(getRowId(row))}
                        sx={{ ml: 1 }} 
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
      />
    </Paper>
  );
};

export default EditableTable;
