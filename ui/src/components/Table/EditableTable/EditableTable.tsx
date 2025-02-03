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
  getDayOptionsSpanish,
} from "../../../utils/stringUtils";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import InputMask from "react-input-mask";
import { BRANDS, COLORS, TABLE } from "../../../constants/constants";
import { formatDateWithDay } from "../../../utils/dateUtils";

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

  // const groupedData = groupByField
  //   ? data.reduce((acc, item) => {
  //       const key = item[groupByField] as string;
  //       if (!acc[key]) acc[key] = [];
  //       acc[key].push(item);
  //       return acc;
  //     }, {} as Record<string, T[]>)
  //   : { default: data };

  // const groupKeys = groupByField
  //   ? Object.keys(groupedData).sort((a, b) =>
  //       order === "asc" ? a.localeCompare(b) : b.localeCompare(a)
  //     )
  //   : ["default"];
  
  // const sortedData = groupByField
  //   ? groupKeys.flatMap((key) => groupedData[key])
  //   : [...data].sort((a, b) => {
  //       if (a[orderBy] < b[orderBy]) {
  //         return order === "asc" ? -1 : 1;
  //       }
  //       if (a[orderBy] > b[orderBy]) {
  //         return order === "asc" ? 1 : -1;
  //       }
  //       return 0;
  //     });

  // const paginatedData = customPagination
  //   ? customPagination(data, page, rowsPerPage)
  //   : sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const sortedData = [...data].sort((a, b) => {
        if (a[orderBy] < b[orderBy]) {
          return order === "asc" ? -1 : 1;
        }
        if (a[orderBy] > b[orderBy]) {
          return order === "asc" ? 1 : -1;
        }
        return 0;
      });

    const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
        <InputMask
          mask="***-****"
          value={value}
          onChange={(e) =>
            setEditField(String(column), e.target.value.toUpperCase().trim())
          }
          maskChar=" "
        >
          {(inputProps) => <TextField {...inputProps} variant="outlined" />}
        </InputMask>
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
        <InputMask
          mask="ATP*-****"
          value={value.replace(/^ATP/, "")}
          onChange={(e) => {
            const formattedValue = `ATP${e.target.value}`;
            setEditField(String(column), formattedValue);
          }}
          maskChar={null}
        >
          {(inputProps) => <TextField {...inputProps} variant="outlined" />}
        </InputMask>
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
