import prisma from "../orm/prisma";
import { UserRequest } from "../types/userRequest";

export async function findUserById(id: string) {
    return await prisma.user.findUnique({
        where: {
            id,
        },
    });
}

export function saveUser(data: UserRequest) {
    return prisma.user.create({
        data,
    });
}

export async function findUserByEmail(email: string) {
    return await prisma.user.findUnique({
        where: {
            email,
        },
    });
}
