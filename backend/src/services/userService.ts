import { hash } from "bcryptjs";
import {
    findUserByEmail,
    findUserById,
    saveUser,
} from "../repository/userRepository";
import { createCollection } from "./qdrantService";
import { createCollectionToQdrant } from "./ragService";

export async function getUserById(id: string) {
    const user = await findUserById(id);

    if (!user) {
        throw new Error("Usuário não encontrado.");
    }

    return user;
}

export async function getUserByEmail(email: string) {
    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error("Usuário não encontrado.");
    }

    return user;
}

export async function createUser(data: any) {
    const password = await hash(data.password, 10);

    const { id } = await saveUser({
        ...data,
        password,
    });

    createCollectionToQdrant(id)

    return id;
}
