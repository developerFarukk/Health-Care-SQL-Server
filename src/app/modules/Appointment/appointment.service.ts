

import { v4 as uuidv4 } from 'uuid';
import httpStatus from "http-status";
import { IAuthUser } from '../../interfaces/common';
import prisma from '../../shared/prisma';
import { IPaginationOptions } from '../../interfaces/pagination';
import { paginationHelper } from '../../helpars/paginationHelper';
import { AppointmentStatus, PaymentStatus, Prisma, UserRole } from '@prisma/client';
import ApiError from '../../errors/ApiError';


// Create Apoinment
const createAppointmentIntoDB = async (user: IAuthUser, payload: any) => {

    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user?.email
        }
    });
    

    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            id: payload.doctorId
        }
    });

    
   const alow = await prisma.doctorSchedules.findFirstOrThrow({
        where: {
            doctorId: doctorData.id,
            scheduleId: payload.scheduleId,
            isBooked: false
        }
    });

    // console.log(alow);
    
    

    const videoCallingId: string = uuidv4();

    const result = await prisma.$transaction(async (tx) => {
        const appointmentData = await tx.appointment.create({
            data: {
                patientId: patientData.id,
                doctorId: doctorData.id,
                scheduleId: payload.scheduleId,
                videoCallingId
            },
            include: {
                patient: true,
                doctor: true,
                schedule: true
            }
        });

        await tx.doctorSchedules.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: doctorData.id,
                    scheduleId: payload.scheduleId
                }
            },
            data: {
                isBooked: true,
                appointmentId: appointmentData.id
            }
        });

        // PH-HealthCare-datatime
        const today = new Date();

        const transactionId = "PH-HealthCare-" + today.getFullYear() + "-" + today.getMonth() + "-" + today.getDay() + "-" + today.getHours() + "-" + today.getMinutes();

       const data = await tx.payment.create({
            data: {
                appointmentId: appointmentData.id,
                amount: doctorData.appointmentFee,
                transactionId
            }
        })

        // console.log(data);
        

        return appointmentData;
    })

    return result;
};


// get my apoinment
const getMyAppointmentIntoDB = async (user: IAuthUser, filters: any, options: IPaginationOptions) => {

    const { limit, page, skip } = paginationHelper.calculatePagination(options);
    const { ...filterData } = filters;

    const andConditions: Prisma.AppointmentWhereInput[] = [];

    if (user?.role === UserRole.PATIENT) {
        andConditions.push({
            patient: {
                email: user?.email
            }
        })
    }
    else if (user?.role === UserRole.DOCTOR) {
        andConditions.push({
            doctor: {
                email: user?.email
            }
        })
    }

    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map(key => ({
            [key]: {
                equals: (filterData as any)[key],
            },
        }));
        andConditions.push(...filterConditions);
    }

    const whereConditions: Prisma.AppointmentWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.appointment.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: 'desc' },
        include: user?.role === UserRole.PATIENT
            ? { doctor: true, schedule: true } : { patient: { include: { medicalReport: true, patientHealthData: true } }, schedule: true }
    });

    const total = await prisma.appointment.count({
        where: whereConditions,
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};


// get All Apoinment
const getAllApoinmentFromDB = async (
    filters: any,
    options: IPaginationOptions
) => {
    const { limit, page, skip } = paginationHelper.calculatePagination(options);
    const { patientEmail, doctorEmail, ...filterData } = filters;
    const andConditions = [];

    if (patientEmail) {
        andConditions.push({
            patient: {
                email: patientEmail
            }
        })
    }
    else if (doctorEmail) {
        andConditions.push({
            doctor: {
                email: doctorEmail
            }
        })
    }

    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => {
                return {
                    [key]: {
                        equals: (filterData as any)[key]
                    }
                };
            })
        });
    }

    // console.dir(andConditions, { depth: Infinity })
    const whereConditions: Prisma.AppointmentWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.appointment.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : {
                    createdAt: 'desc',
                },
        include: {
            doctor: true,
            patient: true
        }
    });
    const total = await prisma.appointment.count({
        where: whereConditions
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};


// Change Apoinment Status
const changeAppointmentStatusIntoDB = async (appointmentId: string, status: AppointmentStatus, user: IAuthUser) => {
    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: appointmentId
        },
        include: {
            doctor: true
        }
    });

    if (user?.role === UserRole.DOCTOR) {
        if (!(user.email === appointmentData.doctor.email)) {
            throw new ApiError(httpStatus.BAD_REQUEST, "This is not your appointment!")
        }
    }

    const result = await prisma.appointment.update({
        where: {
            id: appointmentId
        },
        data: {
            status
        }
    });

    return result;

}


// Cancle Unpaid Apoinment
const cancelUnpaidAppointments = async () => {
    const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000)

    const unPaidAppointments = await prisma.appointment.findMany({
        where: {
            createdAt: {
                lte: thirtyMinAgo
            },
            paymentStatus: PaymentStatus.UNPAID
        },
    });

    const appointmentIdsToCancel = unPaidAppointments.map(appointment => appointment.id);

    await prisma.$transaction(async (tx) => {
        await tx.payment.deleteMany({
            where: {
                appointmentId: {
                    in: appointmentIdsToCancel
                }
            }
        });

        await tx.appointment.deleteMany({
            where: {
                id: {
                    in: appointmentIdsToCancel
                }
            }
        });

        for (const upPaidAppointment of unPaidAppointments) {
            await tx.doctorSchedules.updateMany({
                where: {
                    doctorId: upPaidAppointment.doctorId,
                    scheduleId: upPaidAppointment.scheduleId
                },
                data: {
                    isBooked: false
                }
            })
        }
    })

    //console.log("updated")
}

export const AppointmentService = {
    createAppointmentIntoDB,
    getMyAppointmentIntoDB,
    getAllApoinmentFromDB,
    changeAppointmentStatusIntoDB,
    cancelUnpaidAppointments
}