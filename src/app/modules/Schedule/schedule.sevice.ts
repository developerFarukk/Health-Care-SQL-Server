
import { addHours, addMinutes, format } from 'date-fns';
import { IFilterRequest, ISchedule } from './schedule.interface';
import { Prisma, Schedule } from '@prisma/client';
import prisma from '../../shared/prisma';
import { IPaginationOptions } from '../../interfaces/pagination';
import { IAuthUser } from '../../interfaces/common';
import { paginationHelper } from '../../helpars/paginationHelper';
import ApiError from '../../errors/ApiError';
import httpStatus from "http-status";


// Convert time
const convertDateTime = async (date: Date) => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + offset);
}

// Add Schedule
const inserScheduleIntoDB = async (payload: ISchedule): Promise<Schedule[]> => {
    const { startDate, endDate, startTime, endTime } = payload;

    const interverlTime = 30;

    const schedules = [];

    const currentDate = new Date(startDate); // start date
    const lastDate = new Date(endDate) // end date

    while (currentDate <= lastDate) {
        // 09:30  ---> ['09', '30']
        const startDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, 'yyyy-MM-dd')}`,
                    Number(startTime.split(':')[0])
                ),
                Number(startTime.split(':')[1])
            )
        );

        const endDateTime = new Date(
            addMinutes(
                addHours(
                    `${format(currentDate, 'yyyy-MM-dd')}`,
                    Number(endTime.split(':')[0])
                ),
                Number(endTime.split(':')[1])
            )
        );

        while (startDateTime < endDateTime) {
            // const scheduleData = {
            //     startDateTime: startDateTime,
            //     endDateTime: addMinutes(startDateTime, interverlTime)
            // }

            const s = await convertDateTime(startDateTime);
            const e = await convertDateTime(addMinutes(startDateTime, interverlTime))

            const scheduleData = {
                startDateTime: s,
                endDateTime: e
            }

            const existingSchedule = await prisma.schedule.findFirst({
                where: {
                    startDateTime: scheduleData.startDateTime,
                    endDateTime: scheduleData.endDateTime
                }
            });

            if (!existingSchedule) {
                const result = await prisma.schedule.create({
                    data: scheduleData
                });
                schedules.push(result);
            }

            startDateTime.setMinutes(startDateTime.getMinutes() + interverlTime);
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return schedules;
};

// get all schedule
const getAllScheduleFromDB = async (
    filters: IFilterRequest,
    options: IPaginationOptions,
    user: IAuthUser
) => {
    const { limit, page, skip } = paginationHelper.calculatePagination(options);
    const { startDate, endDate, ...filterData } = filters;

    const andConditions = [];

    if (startDate && endDate) {
        andConditions.push({
            AND: [
                {
                    startDateTime: {
                        gte: startDate
                    }
                },
                {
                    endDateTime: {
                        lte: endDate
                    }
                }
            ]
        })
    };


    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => {
                return {
                    [key]: {
                        equals: (filterData as any)[key],
                    },
                };
            }),
        });
    }

    const whereConditions: Prisma.ScheduleWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const doctorSchedules = await prisma.doctorSchedules.findMany({
        where: {
            doctor: {
                email: user?.email
            }
        }
    });

    const doctorScheduleIds = doctorSchedules.map(schedule => schedule.scheduleId);
    console.log(doctorScheduleIds)

    const result = await prisma.schedule.findMany({
        where: {
            ...whereConditions,
            id: {
                notIn: doctorScheduleIds
            }
        },
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : {
                    createdAt: 'desc',
                }
    });
    const total = await prisma.schedule.count({
        where: {
            ...whereConditions,
            id: {
                notIn: doctorScheduleIds
            }
        },
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

// get single Schedule
const getByScheduleIdFromDB = async (id: string): Promise<Schedule | null> => {

    const result = await prisma.schedule.findUnique({
        where: {
            id,
        },
    });

    if (!result) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Schedule ID not found');
    }

    //console.log(result?.startDateTime.getHours() + ":" + result?.startDateTime.getMinutes())
    return result;
};

// delete Schedule
const deleteScheduleFromDB = async (id: string): Promise<Schedule> => {
    const result = await prisma.schedule.delete({
        where: {
            id,
        },
    });
    return result;
};

// all schedule data delete/drop
const deleteAllSchedulesFromDB = async (): Promise<{ count: number }> => {

    const totalSchedules = await prisma.schedule.count();

    if (totalSchedules === 0) {
        return { count: 0 };
    }

    const result = await prisma.schedule.deleteMany({});
    
    return result;
};


export const ScheduleService = {
    inserScheduleIntoDB,
    getAllScheduleFromDB,
    getByScheduleIdFromDB,
    deleteScheduleFromDB,
    deleteAllSchedulesFromDB
}