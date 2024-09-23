import { Request, Response } from "express";
import * as hoursWorkedService from "../services/hoursWorkedService";

export const createHoursWorked = async (req: Request, res: Response) => {
  try {
    const { employeeId, date, scheduleId } = req.body;

    if (!employeeId || !date || !scheduleId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const hoursWorked = await hoursWorkedService.createOrUpdateHoursWorked(
      employeeId,
      date,
      scheduleId
    );
    return res.status(201).json(hoursWorked);
  } catch (error) {
    console.error("Error creating HoursWorked:", error);
    res.status(500).json({ message: "Error creating HoursWorked", error });
  }
};

export const getAllHoursWorked = async (req: Request, res: Response) => {
  try {
    const hoursWorked = await hoursWorkedService.getAllHoursWorked();
    res.status(200).json(hoursWorked);
  } catch (error) {
    console.error("Error fetching HoursWorked:", error);
    res.status(500).json({ message: "Error fetching HoursWorked", error });
  }
};

export const getHoursWorkedById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const hoursWorked = await hoursWorkedService.getHoursWorkedById(Number(id));

    if (hoursWorked) {
      res.status(200).json(hoursWorked);
    } else {
      res.status(404).json({ message: "HoursWorked entry not found" });
    }
  } catch (error) {
    console.error("Error fetching HoursWorked by ID:", error);
    res.status(500).json({ message: "Error fetching HoursWorked by ID", error });
  }
};

export const updateHoursWorked = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedHoursWorked = await hoursWorkedService.updateHoursWorked(Number(id), req.body);

    if (updatedHoursWorked) {
      res.status(200).json(updatedHoursWorked);
    } else {
      res.status(404).json({ message: "HoursWorked entry not found" });
    }
  } catch (error) {
    console.error("Error updating HoursWorked:", error);
    res.status(500).json({ message: "Error updating HoursWorked", error });
  }
};

export const deleteHoursWorked = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await hoursWorkedService.deleteHoursWorked(Number(id));

    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "HoursWorked entry not found" });
    }
  } catch (error) {
    console.error("Error deleting HoursWorked:", error);
    res.status(500).json({ message: "Error deleting HoursWorked", error });
  }
};
