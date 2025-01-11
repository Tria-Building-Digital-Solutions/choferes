import { Vehicle } from "../models/Vehicle";
import api from "./api";

export const fetchVehicles = async () => {
  const response = await api.get("/vehicles");
  return response.data;
};

export const addVehicle = async (newVehicle: Vehicle) => {
  await api.post("/vehicles", newVehicle);
};

export const updateVehicle = async (
  licensePlate: string,
  updatedVehicle: Partial<Vehicle>
) => {
  await api.put(`/vehicles/${licensePlate}`, updatedVehicle);
};

export const deleteVehicle = async (licensePlate: string) => {
  await api.delete(`/vehicles/${licensePlate}`);
};