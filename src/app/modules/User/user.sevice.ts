
import { Admin, UserRole } from "@prisma/client";
import * as bcrypt from 'bcrypt'
import { Request } from "express";
import prisma from "../../shared/prisma";


const createAdmin = async (
    // req: Request
): Promise<Admin> => {

    // const file = req.file as IFile;

    // if (file) {
    //     const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    //     req.body.admin.profilePhoto = uploadToCloudinary?.secure_url
    // }

    // console.log(req);
    

    // const hashedPassword: string = await bcrypt.hash(req.body.password, 12)

    // const userData = {
    //     email: req.body.admin.email,
    //     password: hashedPassword,
    //     role: UserRole.ADMIN
    // }

    // const result = await prisma.$transaction(async (transactionClient) => {
    //     await transactionClient.user.create({
    //         data: userData
    //     });

    //     const createdAdminData = await transactionClient.admin.create({
    //         data: req.body.admin
    //     });

    //     return createdAdminData;
    // });

    // return result;
    return {
        message: "admin created"
    }
};


export const userService = {
    createAdmin,
}