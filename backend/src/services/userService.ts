import { hash } from "bcryptjs";
import * as userRepository from "../repository/userRepository";
import { createCollectionToQdrant } from "./ragService";
import { NotFoundException } from "../exceptions/notFound";
import { ConflictException } from "../exceptions/conflict";
import { UserRequest } from "../types/userRequest";

export async function getUserById(id: string) {
    const user = await userRepository.findUserById(id);

    if (!user) {
        throw new NotFoundException("Usuário não encontrado.");
    }

    return user;
}

export async function getUserByEmail(email: string) {
    const user = await userRepository.findUserByEmail(email);

    if (!user) {
        throw new NotFoundException("Usuário não encontrado.");
    }

    return user;
}

export async function createUser(data: UserRequest) {
    await verifyIsUserExists(data.email);
    const password = await hash(data.password, 10);

    const { id } = await userRepository.saveUser({
        ...data,
        password,
    });

    createCollectionToQdrant(id);

    return id;
}

export async function verifyIsUserExists(userEmail: string) {
    const user = await userRepository.findUserByEmail(userEmail);
    if (user) {
        throw new ConflictException("O email desse usuario ja foi cadastrado");
    }
}
