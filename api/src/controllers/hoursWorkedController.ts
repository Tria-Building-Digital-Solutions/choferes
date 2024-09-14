import { Request, Response } from 'express';
import { HoursWorked } from '../models/HoursWorked';

export const createHoursWorked = async (req: Request, res: Response) => {
  try {
    const { employeeId, date, hours } = req.body;
    if (employeeId === undefined || date === undefined || hours === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const newHoursWorked = await HoursWorked.create({ employeeId, date, hours });
    res.status(201).json(newHoursWorked);
  } catch (error) {
    console.error('Error creating HoursWorked:', error);
    res.status(500).json({ message: 'Error creating HoursWorked', error });
  }
};

export const getAllHoursWorked = async (req: Request, res: Response) => {
  try {
    const hoursWorked = await HoursWorked.findAll();
    res.status(200).json(hoursWorked);
  } catch (error) {
    console.error('Error fetching HoursWorked:', error);
    res.status(500).json({ message: 'Error fetching HoursWorked', error });
  }
};

export const getHoursWorkedById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const hoursWorked = await HoursWorked.findByPk(id);
    if (hoursWorked) {
      res.status(200).json(hoursWorked);
    } else {
      res.status(404).json({ message: 'HoursWorked entry not found' });
    }
  } catch (error) {
    console.error('Error fetching HoursWorked by ID:', error);
    res.status(500).json({ message: 'Error fetching HoursWorked by ID', error });
  }
};

export const updateHoursWorked = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { employeeId, date, hours } = req.body;
    const [updated] = await HoursWorked.update({ employeeId, date, hours }, {
      where: { id },
    });
    if (updated) {
      const updatedHoursWorked = await HoursWorked.findByPk(id);
      res.status(200).json(updatedHoursWorked);
    } else {
      res.status(404).json({ message: 'HoursWorked entry not found' });
    }
  } catch (error) {
    console.error('Error updating HoursWorked:', error);
    res.status(500).json({ message: 'Error updating HoursWorked', error });
  }
};

export const deleteHoursWorked = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await HoursWorked.destroy({
      where: { id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'HoursWorked entry not found' });
    }
  } catch (error) {
    console.error('Error deleting HoursWorked:', error);
    res.status(500).json({ message: 'Error deleting HoursWorked', error });
  }
};
