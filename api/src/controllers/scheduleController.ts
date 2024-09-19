import { Request, Response } from 'express';
import * as scheduleService from '../services/scheduleService';

export const createSchedule = async (req: Request, res: Response) => {
  try {
    const newSchedule = await scheduleService.createSchedule(req.body);
    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(500).json({ message: 'Error creating Schedule', error });
  }
};

export const getAllSchedules = async (req: Request, res: Response) => {
  try {
    const schedules = await scheduleService.getAllSchedules();
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Schedules', error });
  }
};

export const getScheduleById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const schedule = await scheduleService.getScheduleById(id);
    if (schedule) {
      res.status(200).json(schedule);
    } else {
      res.status(404).json({ message: 'Schedule not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Schedule', error });
  }
};

export const updateSchedule = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const updatedSchedule = await scheduleService.updateSchedule(id, req.body);
    if (updatedSchedule) {
      res.status(200).json(updatedSchedule);
    } else {
      res.status(404).json({ message: 'Schedule not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating Schedule', error });
  }
};

export const deleteSchedule = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await scheduleService.deleteSchedule(id);
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Schedule not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Schedule', error });
  }
};
