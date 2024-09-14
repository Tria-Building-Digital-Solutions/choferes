import { Request, Response } from 'express';
import * as monthlyWorkSummaryService from '../services/monthlyWorkSummaryService';

export const createMonthlyWorkSummary = async (req: Request, res: Response) => {
  try {
    const newMonthlyWorkSummary = await monthlyWorkSummaryService.createMonthlyWorkSummary(req.body);
    res.status(201).json(newMonthlyWorkSummary);
  } catch (error) {
    res.status(500).json({ message: 'Error creating MonthlyWorkSummary', error });
  }
};

export const getAllMonthlyWorkSummaries = async (req: Request, res: Response) => {
  try {
    const summaries = await monthlyWorkSummaryService.getAllMonthlyWorkSummaries();
    res.status(200).json(summaries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching MonthlyWorkSummaries', error });
  }
};

export const getMonthlyWorkSummaryById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const summary = await monthlyWorkSummaryService.getMonthlyWorkSummaryById(id);
    if (summary) {
      res.status(200).json(summary);
    } else {
      res.status(404).json({ message: 'MonthlyWorkSummary not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching MonthlyWorkSummary', error });
  }
};

export const updateMonthlyWorkSummary = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const updatedSummary = await monthlyWorkSummaryService.updateMonthlyWorkSummary(id, req.body);
    if (updatedSummary) {
      res.status(200).json(updatedSummary);
    } else {
      res.status(404).json({ message: 'MonthlyWorkSummary not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating MonthlyWorkSummary', error });
  }
};

export const deleteMonthlyWorkSummary = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await monthlyWorkSummaryService.deleteMonthlyWorkSummary(id);
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'MonthlyWorkSummary not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting MonthlyWorkSummary', error });
  }
};
