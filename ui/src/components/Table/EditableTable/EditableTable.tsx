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
  Box,
} from "@mui/material";
import {
  translateColumnHeaderToSpanish,
  mapDayValues,
  getDayOptionsSpanish,
} from "../../../utils/stringUtils";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
// import InputMask from "react-input-mask";
import { BRANDS, COLORS, TABLE } from "../../../constants/constants";
import { formatDateWithDay } from "../../../utils/dateUtils";
import { maskLicensePlate, maskParkingLot } from "../../../utils/maskUtils";

type EditableTableProps<T> = {
  data: T[];
  columns: (keyof T)[];
  groupByDate?: Date | null;
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
  customPagination?: (data: T[], page: number, rowsPerPage: number) => T[];
};

const EditableTable = <T,>({
  data,
  columns,
  groupByDate,
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

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleEditLicensePlateChange = (
    column: keyof T,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = event.target.value;
    const maskedValue = maskLicensePlate(rawValue);
    setEditField(String(column), String(maskedValue));
  };

  const handleEditParkingLotChange = (
    column: keyof T,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = event.target.value;
    const maskedValue = maskParkingLot(rawValue);
    setEditField(String(column), String(maskedValue));
  };

  const renderEditField = (column: keyof T, value: string) => {
    const options = getOptionsForColumn(column);

    if (options.length > 0) {
      return (
        <FormControl variant="outlined" fullWidth>
          <InputLabel>{String(column)}</InputLabel>
          <Select
            label={String(column)}
            value={editFields[String(column)] || ""}
            onChange={(e) =>
              setEditField(String(column), String(e.target.value))
            }
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    if (column === "licensePlate") {
      return (
        <TextField
          label="Placa"
          variant="outlined"
          fullWidth
          value={editFields[String(column)] || ""}
          onChange={(e) => handleEditLicensePlateChange}
        />
      );
    }

    if (column === "brand") {
      return (
        <FormControl variant="outlined" fullWidth>
          <Select
            value={editFields[String(column)] || ""}
            onChange={(e) =>
              setEditField(String(column), String(e.target.value))
            }
          >
            {BRANDS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    if (column === "color") {
      return (
        <FormControl variant="outlined" fullWidth>
          <Select
            value={editFields[String(column)] || ""}
            onChange={(e) =>
              setEditField(String(column), String(e.target.value))
            }
          >
            {COLORS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    if (column === "parkingLot") {
      return (
        <TextField
          label="Espacio"
          variant="outlined"
          fullWidth
          value={editFields[String(column)] || ""}
          onChange={(e) => handleEditParkingLotChange}
        />
      );
    }

    if (column === "day") {
      return (
        <FormControl variant="outlined" fullWidth>
          <Select
            value={editFields[String(column)] || ""}
            onChange={(e) =>
              setEditField(String(column), String(e.target.value))
            }
          >
            {getDayOptionsSpanish().map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    return (
      <TextField
        fullWidth
        value={value || ""}
        onChange={(e) => setEditField(String(column), e.target.value)}
        error={!validateField(String(column), value)}
      />
    );
  };

  return (
    <Paper sx={{ width: "100%" }}>
      <TableContainer className="table-container">
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            {groupByDate && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  align="center"
                  style={{ fontWeight: "bold" }}
                >
                  {formatDateWithDay(groupByDate, false)}
                </TableCell>
              </TableRow>
            )}
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
            {paginatedData.map((row) => (
              <TableRow key={getRowId(row)}>
                {columns.map((column) => (
                  <TableCell key={String(column)}>
                    {editRowId === getRowId(row)
                      ? renderEditField(
                          column,
                          editFields[String(column)] || ""
                        )
                      : column === "day"
                      ? mapDayValues(row[column] as string)
                      : renderColumnValue(column, row[column])}
                  </TableCell>
                ))}
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {editRowId === getRowId(row) ? (
                      <Tooltip title="Guardar" arrow>
                        <Box>
                          <IconButton
                            color="primary"
                            onClick={() => handleSaveClick(getRowId(row))}
                            disabled={!isFormValid}
                          >
                            <SaveIcon />
                          </IconButton>
                        </Box>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Editar" arrow>
                        <Box>
                          <IconButton
                            color="primary"
                            onClick={() => handleEditClick(row)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Box>
                      </Tooltip>
                    )}
                    <Tooltip title="Eliminar" arrow>
                      <Box>
                        <IconButton
                          color="secondary"
                          onClick={() => handleOpenDialog(getRowId(row))}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Tooltip>
                  </Box>
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
