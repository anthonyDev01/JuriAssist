import * as messageRepository from "../repository/messageRepository";
import { MessageRequest } from "../types/messageRequest";

export async function getMessagesByUserId(userId: string) {
    return await messageRepository.getMessageByUserId(userId);
}

export async function saveMessage(data: MessageRequest) {
    return await messageRepository.createMessage(data);
}

export async function countAssistantMessages(userId: string) {
    return await messageRepository.countAssistantMessagesByUserId(userId);
}
