
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import { IAuthUser } from "../../interfaces/common";
import { AppointmentService } from "./appointment.service";
import sendResponse from "../../shared/sendResponse";
import pick from "../../shared/pick";
import { appointmentFilterableFields } from "./appointment.constant";



// Create Apoinment
const createAppointment = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {

    const user = req.user;
 
    const result = await AppointmentService.createAppointmentIntoDB(user as IAuthUser, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Appointment booked successfully!",
        data: result
    })
});


// get my Apoinment
const getMyAppointment = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const filters = pick(req.query, ['status', 'paymentStatus']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await AppointmentService.getMyAppointmentIntoDB(user as IAuthUser, filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'My Appointment retrive successfully',
        data: result
    });
});


// get all Apoinment
const getAllApoinment = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, appointmentFilterableFields)
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await AppointmentService.getAllApoinmentFromDB(filters, options);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All Appointment retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
});

// const changeAppointmentStatus = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
//     const { id } = req.params;
//     const { status } = req.body;
//     const user = req.user;

//     const result = await AppointmentService.changeAppointmentStatus(id, status, user as IAuthUser);
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Appointment status changed successfully',
//         data: result
//     });
// });

export const AppointmentController = {
    createAppointment,
    getMyAppointment,
    getAllApoinment,
}