
import { z } from "zod";

const createSpecialistValidation = z.object({
    title: z.string({
        required_error: "Title is required!"
    })
});

export const SpecialtiesValidtaion = {
    createSpecialistValidation
}