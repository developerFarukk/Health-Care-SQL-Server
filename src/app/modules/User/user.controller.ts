
import { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../shared/sendResponse";
import catchAsync from "../../shared/catchAsync";
import { userService } from "./user.sevice";
import pick from "../../shared/pick";
import { userFilterableFields } from "./user.constant";
import { IAuthUser } from "../../interfaces/common";

const createAdmin = catchAsync(async (req: Request, res: Response ) => {

    // console.log(req.body);

    const result = await userService.createAdminIntoDB(req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin Created successfuly!",
        data: result
    })
});


// Create doctor
const createDoctor = catchAsync(async (req: Request, res: Response) => {

    console.log(req.body);
    
    const result = await userService.createDoctorIntoDB(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Doctor Created successfuly!",
        data: result
    })
});


// Create Patient
const createPatient = catchAsync(async (req: Request, res: Response) => {

    const result = await userService.createPatientIntoDB(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Patient Created successfuly!",
        data: result
    })
});

// All user data
const getAllUser = catchAsync(async (req: Request, res: Response) => {
    // console.log(req.query)
    const filters = pick(req.query, userFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])

    const result = await userService.getAllFromDB(filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users data fetched!",
        meta: result.meta,
        data: result.data
    })
});


// Change Profile Status
const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params;
    const result = await userService.changeProfileStatusIntoDB(id, req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users profile status changed!",
        data: result
    })
});


// get Me Profile
const getMyProfile = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {

    const user = req.user;

    const result = await userService.getMyProfileintoDB(user as IAuthUser);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My profile data fetched!",
        data: result
    })
});

// Update Profile
const updateMyProfie = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {

    const user = req.user;

    const result = await userService.updateMyProfieIntoDB(user as IAuthUser, req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My profile updated!",
        data: result
    })
});

export const userController = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllUser,
    changeProfileStatus,
    getMyProfile,
    updateMyProfie
}