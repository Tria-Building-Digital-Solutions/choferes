import { Request, Response } from 'express';
import * as vehicleService from '../services/vehicleService';

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const newVehicle = await vehicleService.createVehicle(req.body);
    res.status(201).json(newVehicle);
  } catch (error) {
    res.status(500).json({ message: 'Error creating Vehicle', error });
  }
};

export const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Vehicles', error });
  }
};

export const getVehicleByLicensePlate = async (req: Request, res: Response) => {
  try {
    const licensePlate = req.params.licensePlate;
    const vehicle = await vehicleService.getVehicleByLicensePlate(licensePlate);
    if (vehicle) {
      res.status(200).json(vehicle);
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Vehicle', error });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const licensePlate = req.params.licensePlate;
    const updatedVehicle = await vehicleService.updateVehicle(licensePlate, req.body);
    if (updatedVehicle) {
      res.status(200).json(updatedVehicle);
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating Vehicle', error });
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const licensePlate = req.params.licensePlate;
    const deleted = await vehicleService.deleteVehicle(licensePlate);
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Vehicle', error });
  }
};
