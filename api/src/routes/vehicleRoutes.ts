import express from 'express';
import * as vehicleController from '../controllers/vehicleController';

const router = express.Router();

router.post('/', vehicleController.createVehicle);
router.get('/', vehicleController.getAllVehicles);
router.get('/:licensePlate', vehicleController.getVehicleByLicensePlate);
router.put('/:licensePlate', vehicleController.updateVehicle);
router.delete('/:licensePlate', vehicleController.deleteVehicle);

export default router;