import express from 'express';
import * as biweeklySummaryController from '../controllers/biweeklySummaryController';

const router = express.Router();

router.post('/', biweeklySummaryController.createBiweeklySummary);
router.get('/', biweeklySummaryController.getAllBiweeklySummaries);
router.get('/:id', biweeklySummaryController.getBiweeklySummaryById);
router.put('/:id', biweeklySummaryController.updateBiweeklySummary);
router.delete('/:id', biweeklySummaryController.deleteBiweeklySummary);

export default router;