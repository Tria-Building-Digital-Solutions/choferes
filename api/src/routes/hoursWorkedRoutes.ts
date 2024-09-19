import express from 'express';
import * as hoursWorkedController from '../controllers/hoursWorkedController';

const router = express.Router();

router.post('/', hoursWorkedController.createHoursWorked);
router.get('/', hoursWorkedController.getAllHoursWorked);
router.get('/:id', hoursWorkedController.getHoursWorkedById);
router.put('/:id', hoursWorkedController.updateHoursWorked);
router.delete('/:id', hoursWorkedController.deleteHoursWorked);

export default router;
