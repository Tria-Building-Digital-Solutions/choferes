import express from 'express';
import * as monthlySummaryController from '../controllers/monthlySummaryController';

const router = express.Router();

router.post('/', monthlySummaryController.createMonthlySummary);
router.get('/', monthlySummaryController.getAllMonthlySummaries);
router.get('/:id', monthlySummaryController.getMonthlySummaryById);
router.put('/:id', monthlySummaryController.updateMonthlySummary);
router.delete('/:id', monthlySummaryController.deleteMonthlySummary);

export default router;
