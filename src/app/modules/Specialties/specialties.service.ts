

import { Request } from "express";
import { IFile } from "../../interfaces/file";
import prisma from "../../shared/prisma";
import { fileUploader } from "../../helpars/fileUploader";
import { Specialties } from "@prisma/client";


// Create Scecialist
const insertSpecialistIntoDB = async (req: Request) => {

    const file = req.file as IFile;

    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.icon = uploadToCloudinary?.secure_url;
    }

    const result = await prisma.specialties.create({
        data: req.body
    });

    return result;
};

// get all Specialist
const getAllspecialistFromDB = async (): Promise<Specialties[]> => {
    return await prisma.specialties.findMany();
}

// const deleteFromDB = async (id: string): Promise<Specialties> => {
//     const result = await prisma.specialties.delete({
//         where: {
//             id,
//         },
//     });
//     return result;
// };

export const SpecialtiesService = {
    insertSpecialistIntoDB,
    getAllspecialistFromDB
    // deleteFromDB
}