

import express from 'express';
import { PatientController } from './patient.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

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

// delete patient route
router.delete(
    '/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    PatientController.deletePatient
);


// router.delete(
//     '/soft/:id',
//     PatientController.softDelete
// );

export const PatientRoutes = router;
