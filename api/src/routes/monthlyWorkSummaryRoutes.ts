import express from 'express';
import * as monthlyWorkSummaryController from '../controllers/monthlyWorkSummaryController';

const router = express.Router();

router.post('/monthly-work-summaries', monthlyWorkSummaryController.createMonthlyWorkSummary);
router.get('/monthly-work-summaries', monthlyWorkSummaryController.getAllMonthlyWorkSummaries);
router.get('/monthly-work-summaries/:id', monthlyWorkSummaryController.getMonthlyWorkSummaryById);
router.put('/monthly-work-summaries/:id', monthlyWorkSummaryController.updateMonthlyWorkSummary);
router.delete('/monthly-work-summaries/:id', monthlyWorkSummaryController.deleteMonthlyWorkSummary);

export default router;
