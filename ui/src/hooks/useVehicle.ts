import { useState, useEffect, useCallback } from "react";
import * as VehicleService from "../services/vehicleService";
import { Vehicle } from "../models/Vehicle";

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const fetchVehicles = useCallback(async () => {
    const data = await VehicleService.fetchVehicles();
    setVehicles(data);
    setTotalCount(data.length);
  }, []);

  const handleAddVehicle = async (newVehicle: Vehicle) => {
    await VehicleService.addVehicle(newVehicle);
    setVehicles((prev) => [...prev, newVehicle]);
    setTotalCount((prev) => prev + 1);
  };

  const handleUpdateVehicle = async (
    licensePlate: string,
    updatedVehicle: Partial<Vehicle>
  ) => {
    await VehicleService.updateVehicle(licensePlate, updatedVehicle);
    setVehicles((prev) =>
      prev.map((vehicle) =>
        vehicle.licensePlate === licensePlate ? { ...vehicle, ...updatedVehicle } : vehicle
      )
    );
  };

  const handleDeleteVehicle = async (licensePlate: string) => {
    await VehicleService.deleteVehicle(licensePlate);
    setVehicles((prev) => prev.filter((vehicle) => vehicle.licensePlate !== licensePlate));
    setTotalCount((prev) => prev - 1);
  };

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return {
    vehicles,
    totalCount,
    fetchVehicles,
    handleAddVehicle,
    handleUpdateVehicle,
    handleDeleteVehicle,
  };
};
