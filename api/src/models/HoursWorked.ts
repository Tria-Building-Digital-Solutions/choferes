import { Model, DataTypes } from "sequelize";
import { Employee } from "./Employee";
import sequelize from "../config/database";

export class HoursWorked extends Model {
  public id!: number;
  public employeeId!: number;
  public date!: Date;
  public hours!: number;
}

HoursWorked.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    hours: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "HoursWorked",
    tableName: 'hours_worked',
  }
);

HoursWorked.belongsTo(Employee, { foreignKey: 'employeeId' });
