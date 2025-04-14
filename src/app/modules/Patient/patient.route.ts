

import express from 'express';
import { PatientController } from './patient.controller';

const router = express.Router();

// get all patient route
router.get(
    '/',
    PatientController.getAllPatient
);

// router.get(
//     '/:id',
//     PatientController.getByIdFromDB
// );

// router.patch(
//     '/:id',
//     PatientController.updateIntoDB
// );

// router.delete(
//     '/:id',
//     PatientController.deleteFromDB
// );
// router.delete(
//     '/soft/:id',
//     PatientController.softDelete
// );

export const PatientRoutes = router;
