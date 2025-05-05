import prisma from "../orm/prisma";

export async function findUserById(id: string) {
    return await prisma.user.findUnique({
        where: {
            id,
        },
    });
}

export function saveUser(data: any) {
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
