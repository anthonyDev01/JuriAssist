import prisma from "../orm/prisma";

export async function getById(id: string) {
    return await prisma.user.findUnique({
        where: {
            id,
        },
    });
}
