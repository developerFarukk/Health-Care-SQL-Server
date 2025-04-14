

import express from 'express'
import { DoctorController } from './doctor.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { DoctorValidation } from './doctor.validation';

const router = express.Router();

// get all Doctor data route
router.get('/', DoctorController.getAllDoctor);

// single Doctor data route
router.get('/:id', DoctorController.getByIdOfDoctor);

// Update doctor data
router.patch(
    '/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
    validateRequest(DoctorValidation.updateDoctorValidation),
    DoctorController.updateDoctor
);

// Delete Docor
router.delete(
    '/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    DoctorController.deleteDoctor
);

// Soft delete doctor data route
router.delete(
    '/soft/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    DoctorController.softDeleteDoctor);


  
export const DoctorRoutes = router