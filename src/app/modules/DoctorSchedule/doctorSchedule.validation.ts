

import { z } from 'zod';

const createDoctorShiduleValidation = z.object({
    body: z.object({
        scheduleIds: z.array(z.string()),
    }),
});

export const DoctorScheduleValidation = {
    createDoctorShiduleValidation,
};