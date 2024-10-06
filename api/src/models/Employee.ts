import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import { HoursWorked } from "./HoursWorked";
import { WeeklySummary } from "./WeeklySummary";
import { BiweeklySummary } from "./BiweeklySummary";
import { MonthlySummary } from "./MonthlySummary";

export class Employee extends Model {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
}

Employee.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Employee",
    tableName: "employees",
  }
);

Employee.hasMany(HoursWorked, { foreignKey: 'employeeId', onDelete: 'CASCADE' });
Employee.hasMany(WeeklySummary, { foreignKey: 'employeeId', onDelete: 'CASCADE' });
Employee.hasMany(BiweeklySummary, { foreignKey: 'employeeId', onDelete: 'CASCADE' });
Employee.hasMany(MonthlySummary, { foreignKey: 'employeeId', onDelete: 'CASCADE' });