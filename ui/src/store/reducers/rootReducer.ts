import { combineReducers } from 'redux';
import employeeReducer from '../slices/employeeSlice'; 

const rootReducer = combineReducers({
  employee: employeeReducer,
});

export default rootReducer;
