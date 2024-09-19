import express from 'express';
import * as scheduleController from '../controllers/scheduleController';

const router = express.Router();

router.post('/', scheduleController.createSchedule);
router.get('/', scheduleController.getAllSchedules);
router.get('/:id', scheduleController.getScheduleById);
router.put('/:id', scheduleController.updateSchedule);
router.delete('/:id', scheduleController.deleteSchedule);

export default router;