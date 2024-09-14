import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';
import { Employee } from '../../models/Employee';
import { DaySelection } from '../../types/DaySelection';
import { WeekData } from '../../types/WeekData';

interface EmployeeState {
  employees: Employee[];
  weekData: Record<number, WeekData>;
}

const initialState: EmployeeState = {
  employees: [],
  weekData: {}
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    addEmployee(state, action: PayloadAction<Employee>) {
      state.employees.push(action.payload);
    },
    removeEmployee(state, action: PayloadAction<number>) {
      state.employees = state.employees.filter(employee => employee.id !== action.payload);
    },
    updateEmployeeSelection: (
      state,
      action: PayloadAction<{
        weekOffset: number;
        employeeId: number;
        day: string;
        selection: DaySelection;
      }>
    ) => {
      const { weekOffset, employeeId, day, selection } = action.payload;

      if (!state.weekData[weekOffset]) {
        state.weekData[weekOffset] = {};
      }

      if (!state.weekData[weekOffset][employeeId]) {
        state.weekData[weekOffset][employeeId] = {};
      }

      state.weekData[weekOffset][employeeId][day] = selection;
    },
  },
});

export const { addEmployee, removeEmployee, updateEmployeeSelection } = employeeSlice.actions;

export const selectEmployees = (state: RootState) => state.employee.employees;
export const selectWeekData = (state: RootState) => state.employee.weekData;

export default employeeSlice.reducer;
