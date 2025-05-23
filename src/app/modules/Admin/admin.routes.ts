
import express, { NextFunction, Request, Response } from 'express';
import { AdminController } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { adminValidationSchemas } from './admin.validations';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();


// get all user
router.get(
    '/',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    AdminController.getAllAdmin
);


// get single data by ID
router.get(
    '/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    AdminController.getById
);

// Update admin route
router.patch(
    '/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    validateRequest(adminValidationSchemas.update),
    AdminController.updateAdmin
);


// delete admin route
router.delete(
    '/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    AdminController.deleteAdmin
);


// soft delete route
router.delete(
    '/soft/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    AdminController.softDelete
);

export const AdminRoutes = router;