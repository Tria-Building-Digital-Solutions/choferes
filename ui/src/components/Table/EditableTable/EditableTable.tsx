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
  Divider,
} from "@mui/material";
import {
  translateColumnHeaderToSpanish,
  mapDayValues,
} from "../../../utils/stringUtils";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { TABLE } from "../../../constants/constants";

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
  renderColumnValue?: (column: keyof T, value: any) => React.ReactNode;
  getOptionsForColumn?: (column: keyof T) => { value: string; label: string }[];
  validateField?: (field: string, value: string) => boolean;
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
  renderColumnValue = (_, value) => value,
  getOptionsForColumn = () => [],
  validateField = () => true,
}: EditableTableProps<T>) => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<keyof T>(columns[0]);

  const checkFormValidity = useCallback(() => {
    const isValid = Object.keys(editFields).every((field) =>
      validateField(field, editFields[field])
    );
    setIsFormValid(isValid);
  }, [editFields, validateField]);

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
                    {translateColumnHeaderToSpanish(column)}
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
                    <TableCell key={String(column)}>
                    {editRowId === getRowId(row) ? (
                      getOptionsForColumn(column).length > 0 ? (
                        <FormControl variant="outlined" fullWidth>
                          <InputLabel>{String(column)}</InputLabel>
                          <Select
                            label={String(column)}
                            value={editFields[String(column)] || ""}
                            onChange={(e) =>
                              setEditField(String(column), e.target.value)
                            }
                          >
                            {getOptionsForColumn(column).map((option) => (
                              <MenuItem key={option.value} value={option.value}>
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
                            !validateField(String(column), editFields[String(column)])
                          }
                        />
                      )
                    ) : (
                      column === "day"
                        ? mapDayValues(row[column] as string)
                        : renderColumnValue(column, row[column])
                    )}
                  </TableCell>
                  ))}
                  <TableCell>
                    {editRowId === getRowId(row) ? (
                      <Tooltip title="Guardar" arrow>
                        <IconButton
                          color="primary"
                          onClick={() => handleSaveClick(getRowId(row))}
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
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Eliminar" arrow>
                      <IconButton
                        color="secondary"
                        onClick={() => handleOpenDialog(getRowId(row))}
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
      <Divider />
      <TablePagination
        className="pagination"
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
