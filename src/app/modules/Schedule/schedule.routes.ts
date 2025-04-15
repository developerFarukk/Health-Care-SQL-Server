
import express from 'express';
import { ScheduleController } from './schedule.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();


// get all schedule route
router.get(
    '/',
    auth(UserRole.DOCTOR),
    ScheduleController.getAllSchedule
);

/**
 * API ENDPOINT: /schedule/:id
 * 
 * Get schedule data by id
 */

// get schedule ID
router.get(
    '/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
    ScheduleController.getByScheduleID
);


// Create Schedule Route
router.post(
    '/create-schedule',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    ScheduleController.inserSchedule
);



/**
 * API ENDPOINT: /schdeule/:id
 * 
 * Delete schedule data by id
 */
// router.delete(
//     '/:id',
//     auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
//     ScheduleController.deleteFromDB
// );

export const ScheduleRoutes = router;