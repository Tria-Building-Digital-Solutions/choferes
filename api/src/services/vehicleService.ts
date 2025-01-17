import { Sequelize } from "sequelize";
import { Vehicle } from "../models/Vehicle";

export const createVehicle = async (data: {
  licensePlate: string;
  brand: string;
  color: string;
  parkingLot: string;
  notes: string;
}) => {
  return Vehicle.create(data);
};

export const getAllVehicles = async () => {
  return Vehicle.findAll({
    order: [["createdAt", "DESC"]],
  });
};

export const getVehicleByLicensePlate = async (licensePlate: string) => {
  return Vehicle.findByPk(licensePlate);
};

export const updateVehicle = async (
  licensePlate: string,
  data: {
    licensePlate?: string;
    brand?: string;
    color?: string;
    parkingLot?: string;
    notes?: string;
  }
) => {
  await Vehicle.update(data, { where: { licensePlate } });
  return Vehicle.findByPk(licensePlate);
};

export const deleteVehicle = async (licensePlate: string) => {
  return Vehicle.destroy({ where: { licensePlate } });
};

export const getVehiclesByDate = async (
  date: string,
  page = 1,
  pageSize = 10
) => {
  const offset = (page - 1) * pageSize;

  return Vehicle.findAll({
    where: Sequelize.where(
      Sequelize.fn("DATE", Sequelize.col("createdAt")),
      date
    ),
    order: [["createdAt", "ASC"]],
    limit: pageSize,
    offset,
  });
};

export const getUniqueDates = async () => {
  const dates = await Vehicle.findAll({
    attributes: [
      [Sequelize.fn("DATE", Sequelize.col("createdAt")), "createdDate"],
    ],
    group: ["createdDate"],
    order: [[Sequelize.fn("DATE", Sequelize.col("createdAt")), "ASC"]],
  });

  return dates.map((date) => date.get("createdDate"));
};
