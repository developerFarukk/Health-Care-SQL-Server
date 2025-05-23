

import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AuthServices } from "./auth.service";


// login functuion
const loginUser = catchAsync(async (req: Request, res: Response) => {

    const result = await AuthServices.loginUser(req.body);

    const { refreshToken } = result;

    res.cookie('refreshToken', refreshToken, {
        secure: false,
        httpOnly: true
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Logged in successfully!",
        data: {
            accessToken: result.accessToken,
            needPasswordChange: result.needPasswordChange
        }
    })
});


// refress token function
const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    const result = await AuthServices.refreshToken(refreshToken);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Access token genereated successfully!",
        data: result
        // data: {
        //     accessToken: result.accessToken,
        //     needPasswordChange: result.needPasswordChange
        // }
    })
});

// Password change
const changePassword = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    console.log(user);

    const result = await AuthServices.changePasswordIntoDB(user, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password Changed successfully",
        data: result
    })
});


// forget password
const forgotPassword = catchAsync(async (req: Request, res: Response) => {

    await AuthServices.forgotPasswordIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Check your email!",
        data: null
    })
});


// resete password
const resetPassword = catchAsync(async (req: Request, res: Response) => {

    const token = req.headers.authorization || "";

    await AuthServices.resetPasswordIntoDB(token, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password Reset Successfuly!",
        data: null
        // data: result
    })
});


export const AuthController = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
};