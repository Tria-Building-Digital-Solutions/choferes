import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

export class Vehicle extends Model {
  public licensePlate!: string;
  public model!: string;
  public color!: string;
  public parkingLot!: string;
  public notes!: string;
}

Vehicle.init(
  {
    licensePlate: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parkingLot: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Vehicle",
    tableName: "vehicles",
  }
);
