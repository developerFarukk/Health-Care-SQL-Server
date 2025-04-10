
import express, { NextFunction, Request, Response } from 'express';
import { AdminController } from './admin.controller';

const router = express.Router();


// get all user
router.get(
    '/',
    // auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    AdminController.getAllAdmin
);


// get single data by ID
router.get(
    '/:id',
    // auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    AdminController.getById
);

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