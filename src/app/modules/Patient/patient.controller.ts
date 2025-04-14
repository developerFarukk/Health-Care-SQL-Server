
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync';
import pick from '../../shared/pick';
import { patientFilterableFields } from './patient.constants';
import { PatientService } from './patient.services';
import sendResponse from '../../shared/sendResponse';

// get all patient
const getAllPatient = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, patientFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await PatientService.getAllPatientIntoFromDB(filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Patient retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
});

// get Single patient
const getBySinglePatient = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params;
    const result = await PatientService.getByPatientIdFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Patient retrieval successfully',
        data: result,
    });
});

// Update Patient
const updatePatient = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PatientService.updatePatientIntoDB(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Patient updated successfully',
        data: result,
    });
});

// Delete Patient
const deletePatient = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PatientService.deletePatientFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Patient deleted successfully',
        data: result,
    });
});

// soft delete patient
const softDeletePatient = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PatientService.softDeletePatientIntoDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Patient soft deleted successfully',
        data: result,
    });
});

export const PatientController = {
    getAllPatient,
    getBySinglePatient,
    updatePatient,
    deletePatient,
    softDeletePatient
};
