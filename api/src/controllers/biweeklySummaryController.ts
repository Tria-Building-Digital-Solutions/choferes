import { Request, Response } from 'express';
import * as biweeklySummaryService from '../services/biweeklySummaryService';

export const createBiweeklySummary = async (req: Request, res: Response) => {
  try {
    const newBiweeklySummary = await biweeklySummaryService.createBiweeklySummary(req.body);
    res.status(201).json(newBiweeklySummary);
  } catch (error) {
    res.status(500).json({ message: 'Error creating BiweeklySummary', error });
  }
};

export const getAllBiweeklySummaries = async (req: Request, res: Response) => {
  try {
    const summaries = await biweeklySummaryService.getAllBiweeklySummaries();
    res.status(200).json(summaries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching BiweeklySummaries', error });
  }
};

export const getBiweeklySummaryById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const summary = await biweeklySummaryService.getBiweeklySummaryById(id);
    if (summary) {
      res.status(200).json(summary);
    } else {
      res.status(404).json({ message: 'BiweeklySummary not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching BiweeklySummary', error });
  }
};

export const updateBiweeklySummary = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const updatedSummary = await biweeklySummaryService.updateBiweeklySummary(id, req.body);
    if (updatedSummary) {
      res.status(200).json(updatedSummary);
    } else {
      res.status(404).json({ message: 'BiweeklySummary not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating BiweeklySummary', error });
  }
};

export const deleteBiweeklySummary = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = await biweeklySummaryService.deleteBiweeklySummary(id);
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'BiweeklySummary not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting BiweeklySummary', error });
  }
};
