import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { mockEmployees } from "../../data/mockData"

interface DaySelection {
  label: string;
  hours: number;
}

interface EmployeeState {
  employees: string[];
  weekData: {
    [weekOffset: number]: {
      [employee: string]: {
        [day: string]: DaySelection;
      };
    };
  };
}

const initialState: EmployeeState = {
  employees: mockEmployees,
  weekData: {},
};

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    addEmployee: (state, action: PayloadAction<string>) => {
      state.employees.push(action.payload);
    },
    removeEmployee: (state, action: PayloadAction<string>) => {
      state.employees = state.employees.filter(
        (employee) => employee !== action.payload
      );
    },
    updateEmployeeSelection: (
      state,
      action: PayloadAction<{
        weekOffset: number;
        employee: string;
        day: string;
        selection: DaySelection;
      }>
    ) => {
      const { weekOffset, employee, day, selection } = action.payload;
      if (!state.weekData[weekOffset]) {
        state.weekData[weekOffset] = {};
      }
      if (!state.weekData[weekOffset][employee]) {
        state.weekData[weekOffset][employee] = {};
      }
      state.weekData[weekOffset][employee][day] = selection;
    },
  },
});

export const { addEmployee, removeEmployee, updateEmployeeSelection } =
  employeeSlice.actions;
export default employeeSlice.reducer;
