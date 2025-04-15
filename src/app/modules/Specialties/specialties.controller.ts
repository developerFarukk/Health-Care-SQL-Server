

import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import { SpecialtiesService } from "./specialties.service";
import sendResponse from "../../shared/sendResponse";


// Create Spetialist
const insertSpesialist = catchAsync(async (req: Request, res: Response) => {
    console.log(req.body)
    const result = await SpecialtiesService.insertSpecialistIntoDB(req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Specialties created successfully!",
        data: result
    });
});

// get all Specialist
const getAllSpecilist = catchAsync(async (req: Request, res: Response) => {
    const result = await SpecialtiesService.getAllspecialistFromDB();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All Specialties data fetched successfully',
        data: result,
    });
});


// delete Specilist
const deleteSpecilist = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await SpecialtiesService.deleteSpecialistFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Specialty deleted successfully',
        data: result,
    });
});

export const SpecialtiesController = {
    insertSpesialist,
    getAllSpecilist,
    deleteSpecilist
};