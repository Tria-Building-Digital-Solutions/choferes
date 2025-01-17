import express from 'express';
import * as vehicleController from '../controllers/vehicleController';

const router = express.Router();

router.post('/', vehicleController.createVehicle);
router.get('/', vehicleController.getAllVehicles);
router.get('/:licensePlate', vehicleController.getVehicleByLicensePlate);
router.put('/:licensePlate', vehicleController.updateVehicle);
router.delete('/:licensePlate', vehicleController.deleteVehicle);
router.get("/dates/unique", vehicleController.getUniqueDates);
router.get("/dates/:date", vehicleController.getVehiclesByDate);

export default router;