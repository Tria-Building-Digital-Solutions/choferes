import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database";

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
  }
);
