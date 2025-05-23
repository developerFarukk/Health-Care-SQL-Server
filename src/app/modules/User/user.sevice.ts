
import { Admin, Doctor, Patient, Prisma, UserRole, UserStatus } from "@prisma/client";
import * as bcrypt from 'bcrypt'
import { Request } from "express";
import prisma from "../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../helpars/paginationHelper";
import { userSearchAbleFields } from "./user.constant";
import { IAuthUser } from "../../interfaces/common";

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


// Update Profile status
const changeProfileStatusIntoDB = async (id: string, status: UserRole) => {

    // const userData = await prisma.user.findUniqueOrThrow({
    //     where: {
    //         id
    //     }
    // });

    const updateUserStatus = await prisma.user.update({
        where: {
            id
        },
        data: status
    });

    return updateUserStatus;
};


// Get Me Profile
const getMyProfileintoDB = async (user: IAuthUser) => {

    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            email: user?.email,
            status: UserStatus.ACTIVE
        },
        select: {
            id: true,
            email: true,
            needPasswordChange: true,
            role: true,
            status: true
        }
    });

    let profileInfo;

    if (userInfo.role === UserRole.SUPER_ADMIN) {
        profileInfo = await prisma.admin.findUnique({
            where: {
                email: userInfo.email
            }
        })
    }
    else if (userInfo.role === UserRole.ADMIN) {
        profileInfo = await prisma.admin.findUnique({
            where: {
                email: userInfo.email
            }
        })
    }
    else if (userInfo.role === UserRole.DOCTOR) {
        profileInfo = await prisma.doctor.findUnique({
            where: {
                email: userInfo.email
            }
        })
    }
    else if (userInfo.role === UserRole.PATIENT) {
        profileInfo = await prisma.patient.findUnique({
            where: {
                email: userInfo.email
            }
        })
    }

    return { ...userInfo, ...profileInfo };
};


// Update Profile
const updateMyProfieIntoDB = async (user: IAuthUser, req: Request) => {
    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            email: user?.email,
            status: UserStatus.ACTIVE
        }
    });

    // const file = req.file as IFile;
    // if (file) {
    //     const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    //     req.body.profilePhoto = uploadToCloudinary?.secure_url;
    // }

    let profileInfo;

    if (userInfo.role === UserRole.SUPER_ADMIN) {
        profileInfo = await prisma.admin.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })
    }
    else if (userInfo.role === UserRole.ADMIN) {
        profileInfo = await prisma.admin.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })
    }
    else if (userInfo.role === UserRole.DOCTOR) {
        profileInfo = await prisma.doctor.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })
    }
    else if (userInfo.role === UserRole.PATIENT) {
        profileInfo = await prisma.patient.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })
    }

    return { ...profileInfo };
}


export const userService = {
    createAdminIntoDB,
    createDoctorIntoDB,
    createPatientIntoDB,
    getAllFromDB,
    changeProfileStatusIntoDB,
    getMyProfileintoDB,
    updateMyProfieIntoDB
}