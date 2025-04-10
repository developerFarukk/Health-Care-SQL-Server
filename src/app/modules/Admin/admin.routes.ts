
import express, { NextFunction, Request, Response } from 'express';
import { AdminController } from './admin.controller';

const router = express.Router();

router.get(
    '/',
    // auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    AdminController.getAllAdmin
);

// router.get(
//     '/:id',
//     auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
//     AdminController.getByIdFromDB
// );

// router.patch(
//     '/:id',
//     auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
//     validateRequest(adminValidationSchemas.update),
//     AdminController.updateIntoDB
// );

// router.delete(
//     '/:id',
//     auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
//     AdminController.deleteFromDB
// );

// router.delete(
//     '/soft/:id',
//     auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
//     AdminController.softDeleteFromDB
// );

export const AdminRoutes = router;