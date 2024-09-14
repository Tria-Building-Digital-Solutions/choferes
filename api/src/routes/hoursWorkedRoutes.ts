import express from 'express';
import * as hoursWorkedController from '../controllers/hoursWorkedController';

const router = express.Router();

router.post('/hours', hoursWorkedController.createHoursWorked);
router.get('/hours', hoursWorkedController.getAllHoursWorked);
router.get('/hours/:id', hoursWorkedController.getHoursWorkedById);
router.put('/hours/:id', hoursWorkedController.updateHoursWorked);
router.delete('/hours/:id', hoursWorkedController.deleteHoursWorked);

export default router;
