import { useState, useEffect, useCallback } from "react";
import * as VehicleService from "../services/vehicleService";
import { Vehicle } from "../models/Vehicle";

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Record<string, Vehicle[]>>({});
  const [totalCount, setTotalCount] = useState(0);

  const fetchVehicles = useCallback(async () => {
    const data = await VehicleService.fetchVehicles();
    const grouped: Record<string, Vehicle[]> = {};
    data.forEach((vehicle: Vehicle) => {
      const date = new Date(vehicle.createdAt).toISOString().split("T")[0]; // Agrupar por fecha
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(vehicle);
    });
    setVehicles(grouped); 
    setTotalCount(data.length);
  }, []);

  const handleAddVehicle = async (newVehicle: Vehicle) => {
    await VehicleService.addVehicle(newVehicle);
    setVehicles((prev) => {
      const date = new Date(newVehicle.createdAt).toISOString().split("T")[0];
      const updatedGroup = { ...prev };
      if (!updatedGroup[date]) updatedGroup[date] = [];
      updatedGroup[date].push(newVehicle);
      return updatedGroup;
    });
    setTotalCount((prev) => prev + 1);
  };

  const handleUpdateVehicle = async (
    licensePlate: string,
    updatedVehicle: Partial<Vehicle>
  ) => {
    await VehicleService.updateVehicle(licensePlate, updatedVehicle);
    fetchVehicles(); // Refrescar agrupación tras la actualización
  };

  const handleDeleteVehicle = async (licensePlate: string) => {
    await VehicleService.deleteVehicle(licensePlate);
    fetchVehicles(); // Refrescar agrupación tras el borrado
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
