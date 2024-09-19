import express from 'express';
import * as weeklySummaryController from '../controllers/weeklySummaryController';

const router = express.Router();

router.post('/', weeklySummaryController.createWeeklySummary);
router.get('/', weeklySummaryController.getAllWeeklySummaries);
router.get('/:id', weeklySummaryController.getWeeklySummaryById);
router.put('/:id', weeklySummaryController.updateWeeklySummary);
router.delete('/:id', weeklySummaryController.deleteWeeklySummary);

export default router;
