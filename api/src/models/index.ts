import { Employee } from './Employee';
import { HoursWorked } from './HoursWorked';
import { WeeklySummary } from './WeeklySummary';
import { BiweeklySummary } from './BiweeklySummary';
import { MonthlyWorkSummary } from './MonthlyWorkSummary';

// One-to-Many relationship: Employee to HoursWorked
Employee.hasMany(HoursWorked, { foreignKey: 'employeeId' });
HoursWorked.belongsTo(Employee, { foreignKey: 'employeeId' });

// One-to-Many relationship: Employee to WeeklySummary
Employee.hasMany(WeeklySummary, { foreignKey: 'employeeId' });
WeeklySummary.belongsTo(Employee, { foreignKey: 'employeeId' });

// One-to-One relationship: Employee to BiweeklySummary
Employee.hasOne(BiweeklySummary, { foreignKey: 'employeeId' });
BiweeklySummary.belongsTo(Employee, { foreignKey: 'employeeId' });

// One-to-One relationship: Employee to MonthlyWorkSummary
Employee.hasOne(MonthlyWorkSummary, { foreignKey: 'employeeId' });
MonthlyWorkSummary.belongsTo(Employee, { foreignKey: 'employeeId' });
