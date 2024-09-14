import express from 'express';
import * as weeklySummaryController from '../controllers/weeklySummaryController';

const router = express.Router();

router.post('/weekly-summaries', weeklySummaryController.createWeeklySummary);
router.get('/weekly-summaries', weeklySummaryController.getAllWeeklySummaries);
router.get('/weekly-summaries/:id', weeklySummaryController.getWeeklySummaryById);
router.put('/weekly-summaries/:id', weeklySummaryController.updateWeeklySummary);
router.delete('/weekly-summaries/:id', weeklySummaryController.deleteWeeklySummary);

export default router;
