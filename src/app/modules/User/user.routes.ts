
import express, { NextFunction, Request, Response } from 'express';
import { userController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { userValidation } from './user.validation';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
// import { DoctorValidation } from '../Doctor/doctor.validation';

const router = express.Router();

// Get all user
router.get(
    '/',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    userController.getAllUser
);

// Get My Profile
router.get(
    '/me',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
    userController.getMyProfile
)


// create admin
router.post(
    "/create-admin",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    // fileUploader.upload.single('file'),
    // (req: Request, res: Response, next: NextFunction) => {
    //     req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data))
    //     return userController.createAdmin(req, res, next)
    // }
    // validateRequest(userValidation.createAdminValidation),
    userController.createAdmin
);


// Create Doctor route
router.post(
    "/create-doctor",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    // fileUploader.upload.single('file'),
    // (req: Request, res: Response, next: NextFunction) => {
    //     req.body = userValidation.createDoctorValidation.parse(JSON.parse(req.body.data))
    //     // req.body = validateRequest(userValidation.createDoctorValidation.parse(JSON.parse(req.body.data)))
    //     return userController.createDoctor(req, res, next)
    // }
    // validateRequest(DoctorValidation.createDoctorValidation),
    userController.createDoctor
);

// Create patient Route
router.post(
    "/create-patient",
    // fileUploader.upload.single('file'),
    // (req: Request, res: Response, next: NextFunction) => {
    //     req.body = userValidation.createPatient.parse(JSON.parse(req.body.data))
    //     return userController.createPatient(req, res, next)
    // }
    // validateRequest(userValidation.createPatientValidation),
    userController.createPatient
);

// Update Profile status route
router.patch(
    '/:id/status',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    validateRequest(userValidation.updateStatusValidation),
    userController.changeProfileStatus
);


// Update Profile Route
router.patch(
    "/update-my-profile",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),

    // fileUploader.upload.single('file'),
    // (req: Request, res: Response, next: NextFunction) => {
    //     req.body = JSON.parse(req.body.data)
    //     return userController.updateMyProfie(req, res, next)
    // }

    userController.updateMyProfie
);


export const userRoutes = router;