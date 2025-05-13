import prisma from "../orm/prisma";
import { MessageRequest } from "../types/messageRequest";

export function getMessageByUserId(userId: string) {
    return prisma.messages.findMany({
        where: {
            userId,
        },
    });
}

export function createMessage(data: MessageRequest) {
    return prisma.messages.create({
        data,
    });
}

export function countAssistantMessagesByUserId(userId: string) {
    return prisma.messages.count({
        where: {
            userId,
            owner: "assistant",
        },
    });
}
