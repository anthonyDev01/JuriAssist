import prisma from "../orm/prisma";

export function getMessageByUserId(userId: string) {
    return prisma.messages.findMany({
        where: {
            userId,
        },
    });
}

export function createMessage(data: any) {
    return prisma.messages.create({
        data,
    });
}
