

import express from 'express';
import { UserRole } from '@prisma/client';
import { AuthController } from './auth.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

// user login route
router.post(
    '/login',
    AuthController.loginUser
);

// refress token
router.post(
    '/refresh-token',
    AuthController.refreshToken
)


// change password route
router.post(
    '/change-password',
    auth(
        UserRole.SUPER_ADMIN,
        UserRole.ADMIN,
        UserRole.DOCTOR,
        UserRole.PATIENT
    ),
    AuthController.changePassword
);

// router.post(
//     '/forgot-password',
//     AuthController.forgotPassword
// );

// router.post(
//     '/reset-password',
//     AuthController.resetPassword
// )

export const AuthRoutes = router;