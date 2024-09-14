import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database";
import { Employee } from "./Employee";

export class BiweeklySummary extends Model {
  public id!: number;
  public employeeId!: number;
  public firstHalfHours!: number;
  public secondHalfHours!: number;
}

BiweeklySummary.init(
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
    firstHalfHours: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    secondHalfHours: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "BiweeklySummary",
  }
);
