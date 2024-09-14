import { Request, Response } from 'express';
import * as weeklySummaryService from '../services/weeklySummaryService';

export const createWeeklySummary = async (req: Request, res: Response) => {
  try {
    const newWeeklySummary = await weeklySummaryService.createWeeklySummary(req.body);
    res.status(201).json(newWeeklySummary);
  } catch (error) {
    res.status(500).json({ message: 'Error creating WeeklySummary', error });
  }
};

export const getAllWeeklySummaries = async (req: Request, res: Response) => {
  try {
    const summaries = await weeklySummaryService.getAllWeeklySummaries();
    res.status(200).json(summaries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching WeeklySummaries', error });
  }
};

export const getWeeklySummaryById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const summary = await weeklySummaryService.getWeeklySummaryById(id);
    if (summary) {
      res.status(200).json(summary);
    } else {
      res.status(404).json({ message: 'WeeklySummary not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching WeeklySummary', error });
  }
};

export const updateWeeklySummary = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const updatedSummary = await weeklySummaryService.updateWeeklySummary(id, req.body);
    if (updatedSummary) {
      res.status(200).json(updatedSummary);
    } else {
      res.status(404).json({ message: 'WeeklySummary not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating WeeklySummary', error });
  }
};

export const deleteWeeklySummary = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await weeklySummaryService.deleteWeeklySummary(id);
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'WeeklySummary not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting WeeklySummary', error });
  }
};
