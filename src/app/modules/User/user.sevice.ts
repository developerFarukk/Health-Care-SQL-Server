
import { Admin, Doctor, Patient, Prisma, UserRole } from "@prisma/client";
import * as bcrypt from 'bcrypt'
import { Request } from "express";
import prisma from "../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../helpars/paginationHelper";
import { userSearchAbleFields } from "./user.constant";

// Create admin
const createAdminIntoDB = async (
    req: Request
): Promise<Admin> => {
    // console.log(req.body);


    // const file = req.file as IFile;

    // if (file) {
    //     const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    //     req.body.admin.profilePhoto = uploadToCloudinary?.secure_url
    // }

    // console.log(req);


    const hashedPassword: string = await bcrypt.hash(req.body.password, 12)

    const userData = {
        email: req.body.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdAdminData = await transactionClient.admin.create({
            data: req.body.admin
        });

        return createdAdminData;
    });

    return result;
    // return {
    //     message: "admin created"
    // }
};


// create Doctor
const createDoctorIntoDB = async (req: Request): Promise<Doctor> => {

    console.log(req.body.doctor);


    // const file = req.file as IFile;

    // if (file) {
    //     const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    //     req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url
    // }

    const hashedPassword: string = await bcrypt.hash(req.body.password, 12)

    const userData = {
        email: req.body.doctor.email,
        password: hashedPassword,
        role: UserRole.DOCTOR
    }


    const result = await prisma.$transaction(async (transactionClient) => {

        await transactionClient.user.create({
            data: userData
        });


        const createdDoctorData = await transactionClient.doctor.create({
            data: req.body.doctor
        });

        console.log(createdDoctorData);


        return createdDoctorData;
    });


    return result;
};


// Create Patient
const createPatientIntoDB = async (req: Request): Promise<Patient> => {
    // const file = req.file as IFile;

    // if (file) {
    //     const uploadedProfileImage = await fileUploader.uploadToCloudinary(file);
    //     req.body.patient.profilePhoto = uploadedProfileImage?.secure_url;
    // }

    const hashedPassword: string = await bcrypt.hash(req.body.password, 12)

    const userData = {
        email: req.body.patient.email,
        password: hashedPassword,
        role: UserRole.PATIENT
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdPatientData = await transactionClient.patient.create({
            data: req.body.patient
        });

        return createdPatientData;
    });

    return result;
};


// get all user
const getAllFromDB = async (params: any, options: IPaginationOptions) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = params;

    const andCondions: Prisma.UserWhereInput[] = [];

    //console.log(filterData);
    if (params.searchTerm) {
        andCondions.push({
            OR: userSearchAbleFields.map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    };

    if (Object.keys(filterData).length > 0) {
        andCondions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    };

    const whereConditons: Prisma.UserWhereInput = andCondions.length > 0 ? { AND: andCondions } : {};

    const result = await prisma.user.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        },
        select: {
            id: true,
            email: true,
            role: true,
            needPasswordChange: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            admin: true,
            Patient: true,
            Doctor: true
        }
    });

    const total = await prisma.user.count({
        where: whereConditons
    });

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
};


export const userService = {
    createAdminIntoDB,
    createDoctorIntoDB,
    createPatientIntoDB,
    getAllFromDB
}