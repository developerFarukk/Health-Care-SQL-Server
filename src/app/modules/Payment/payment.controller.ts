

import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import { PaymentService } from "./payment.service";
import sendResponse from "../../shared/sendResponse";

const initPayment = catchAsync(async (req: Request, res: Response) => {
    const { appointmentId } = req.params;
    const result = await PaymentService.initPaymentIntoDB(appointmentId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payment initiate successfully',
        data: result,
    });
});

// const validatePayment = catchAsync(async (req: Request, res: Response) => {
//     const result = await PaymentService.validatePayment(req.query);
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'Payment validate successfully',
//         data: result,
//     });
// });

export const PaymentController = {
    initPayment,
    
}