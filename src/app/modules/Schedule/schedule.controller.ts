

import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import { ScheduleService } from "./schedule.sevice";
import sendResponse from "../../shared/sendResponse";
import { IAuthUser } from "../../interfaces/common";
import pick from "../../shared/pick";

// create schedule
const inserSchedule = catchAsync(async (req: Request, res: Response) => {
    const result = await ScheduleService.inserScheduleIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Schedule created successfully!",
        data: result
    });
});

// get all chedule
const getAllSchedule = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
    const filters = pick(req.query, ['startDate', 'endDate']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const user = req.user;
    const result = await ScheduleService.getAllScheduleFromDB(filters, options, user as IAuthUser);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Schedule fetched successfully!",
        data: result
    });
});

// get single Schedule
const getByScheduleID = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ScheduleService.getByScheduleIdFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Schedule retrieval successfully',
        data: result,
    });
});


// delete schedule
const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ScheduleService.deleteScheduleFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Schedule deleted successfully',
        data: result,
    });
});


export const ScheduleController = {
    inserSchedule,
    getAllSchedule,
    getByScheduleID,
    deleteSchedule
};