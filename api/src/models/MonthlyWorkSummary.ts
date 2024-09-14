import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database";
import { Employee } from "./Employee";
import { BiweeklySummary } from "./BiweeklySummary";
import { WeeklySummary } from "./WeeklySummary";

export class MonthlyWorkSummary extends Model {
  public id!: number;
  public employeeId!: number;
  public month!: string;
  public weeklySummaries!: WeeklySummary[];
  public biweeklySummary!: BiweeklySummary; 
  public monthlyTotal!: number;
}

MonthlyWorkSummary.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.INTEGER,
      references: {
        model: Employee,
        key: "id",
      },
      allowNull: false,
    },
    month: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    monthlyTotal: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "MonthlyWorkSummary",
  }
);
