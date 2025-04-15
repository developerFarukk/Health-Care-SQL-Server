
import express, { NextFunction, Request, Response } from 'express';
import { fileUploader } from '../../helpars/fileUploader';
import { SpecialtiesValidtaion } from './specialties.validation';
import { SpecialtiesController } from './specialties.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';



const router = express.Router();


// Task 1: Retrieve Specialties Data

/**
- Develop an API endpoint to retrieve all specialties data.
- Implement an HTTP GET endpoint returning specialties in JSON format.
- ENDPOINT: /specialties
*/

// All Specialist route
router.get(
    '/',
    SpecialtiesController.getAllSpecilist
);


// Speciality create route
router.post(
    '/create-speciality',
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = SpecialtiesValidtaion.createSpecialistValidation.parse(JSON.parse(req.body.data))
        return SpecialtiesController.insertSpesialist(req, res, next)
    }
);



// Task 2: Delete Specialties Data by ID

/**
- Develop an API endpoint to delete specialties by ID.
- Implement an HTTP DELETE endpoint accepting the specialty ID.
- Delete the specialty from the database and return a success message.
- ENDPOINT: /specialties/:id
*/

// delete spelist
router.delete(
    '/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    SpecialtiesController.deleteSpecilist
);

export const SpecialtiesRoutes = router;