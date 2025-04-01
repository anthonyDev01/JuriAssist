import { createMessage, getByUserId } from "../repository/messageRepository";

export async function getMessagesByUserId(userId: string) {
    const messages = await getByUserId(userId);

    if (messages.length == 0) {
        throw new Error("messages not found");
    }

    return messages;
}

export async function saveMessage(data: any) {
    return await createMessage(data);
}
