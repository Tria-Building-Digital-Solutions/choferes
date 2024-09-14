import { Model, DataTypes } from "sequelize";
import { Employee } from "./Employee";
import sequelize from "../config/database";

export class WeeklySummary extends Model {
  public id!: number;
  public employeeId!: number;
  public weekNumber!: number;
  public totalHours!: number;
}

WeeklySummary.init(
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
    weekNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalHours: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "WeeklySummary",
    tableName: 'weekly_summary',
  }
);

WeeklySummary.belongsTo(Employee, { foreignKey: 'employeeId' });
