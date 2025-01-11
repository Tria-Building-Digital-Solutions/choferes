import { Vehicle } from "../models/Vehicle";

export const createVehicle = async (data: {
  licensePlate: string;
  model: string;
  color: string;
  parkingLot: string;
  notes: string;
  date: Date;
}) => {
  return Vehicle.create(data);
};

export const getAllVehicles = async () => {
  return Vehicle.findAll();
};

export const getVehicleByLicensePlate = async (licensePlate: string) => {
  return Vehicle.findByPk(licensePlate);
};

export const updateVehicle = async (
  licensePlate: string,
  data: { licensePlate?: string; model?: string; color?: string; parkingLot?: string; notes?: string; date?: Date }
) => {
  await Vehicle.update(data, { where: { licensePlate } });
  return Vehicle.findByPk(licensePlate);
};

export const deleteVehicle = async (licensePlate: string) => {
  return Vehicle.destroy({ where: { licensePlate } });
};
