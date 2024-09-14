import express from 'express';
import * as monthlySummaryController from '../controllers/monthlySummaryController';

const router = express.Router();

router.post('/monthly-summaries', monthlySummaryController.createMonthlySummary);
router.get('/monthly-summaries', monthlySummaryController.getAllMonthlySummaries);
router.get('/monthly-summaries/:id', monthlySummaryController.getMonthlySummaryById);
router.put('/monthly-summaries/:id', monthlySummaryController.updateMonthlySummary);
router.delete('/monthly-summaries/:id', monthlySummaryController.deleteMonthlySummary);

export default router;
