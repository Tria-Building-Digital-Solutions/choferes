import express from 'express';
import * as biweeklySummaryController from '../controllers/biweeklySummaryController';

const router = express.Router();

router.post('/biweekly-summaries', biweeklySummaryController.createBiweeklySummary);
router.get('/biweekly-summaries', biweeklySummaryController.getAllBiweeklySummaries);
router.get('/biweekly-summaries/:id', biweeklySummaryController.getBiweeklySummaryById);
router.put('/biweekly-summaries/:id', biweeklySummaryController.updateBiweeklySummary);
router.delete('/biweekly-summaries/:id', biweeklySummaryController.deleteBiweeklySummary);

export default router;
