

import express from 'express';
import { PatientController } from './patient.controller';

const router = express.Router();

// get all patient route
router.get(
    '/',
    PatientController.getAllPatient
);

// get single patient route
router.get(
    '/:id',
    PatientController.getBySinglePatient
);

// Update patient route
router.patch(
    '/:id',
    PatientController.updatePatient
);

// router.delete(
//     '/:id',
//     PatientController.deleteFromDB
// );
// router.delete(
//     '/soft/:id',
//     PatientController.softDelete
// );

export const PatientRoutes = router;
