import { Model, DataTypes } from "sequelize";
import { Employee } from "./Employee";
import { BiweeklySummary } from "./BiweeklySummary";
import { WeeklySummary } from "./WeeklySummary";
import sequelize from "../config/database";

export class MonthlySummary extends Model {
  public id!: number;
  public employeeId!: number;
  public month!: string;
  public weeklySummaries!: WeeklySummary[];
  public biweeklySummary!: BiweeklySummary; 
  public monthlyTotal!: number;
}

MonthlySummary.init(
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
    modelName: "MonthlySummary",
    tableName: 'monthly_summary',
  }
);

MonthlySummary.belongsTo(Employee, { foreignKey: 'employeeId' });