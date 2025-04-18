

import express from 'express';
import { DoctorScheduleController } from './doctorSchedule.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import validateRequest from '../../middlewares/validateRequest';
import { DoctorScheduleValidation } from './doctorSchedule.validation';

const router = express.Router();

/**
 * API ENDPOINT: /doctor-schedule/
 * 
 * Get all doctor schedule with filtering
 */

// get all deoctor Schedule route
router.get(
    '/',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
    DoctorScheduleController.getAllDoctorShedule
);

// get my schedule
router.get(
    '/my-schedule',
    auth(UserRole.DOCTOR),
    DoctorScheduleController.getMySchedule
)



// create Doctor Schedule rpute
router.post(
    '/create-doctorschdule',
    auth(UserRole.DOCTOR),
    validateRequest(DoctorScheduleValidation.createDoctorShiduleValidation),
    DoctorScheduleController.createDoctorSchedule
);


// delete D. Shedule route
router.delete(
    '/:id',
    auth(UserRole.DOCTOR),
    DoctorScheduleController.deleteDoctorSchedule
);



export const DoctorScheduleRoutes = router;