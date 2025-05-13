import { sign } from "jsonwebtoken";
import { compare } from "bcryptjs";
import * as userRepository from "../repository/userRepository";
import { createUser } from "./userService";
import { NotFoundException } from "../exceptions/notFound";
import { BadRequestException } from "../exceptions/badRequest";
import { UserRequest } from "../types/userRequest";

const jwtSecret = process.env.JWT_SECRET!;
const jwtTokenDuration: number = parseInt(process.env.JWT_TOKEN_DURATION!);

export async function createUserAccount(userData: UserRequest) {
    await createUser(userData);
}

export async function signIn(email: string, password: string) {
    const user = await userRepository.findUserByEmail(email);

    if (!user) {
        throw new NotFoundException("Usuario não encontrado");
    }

    if (!(await compare(password, user.password))) {
        throw new BadRequestException("Senha incorreta.");
    }

    const token = sign(user, jwtSecret, { expiresIn: jwtTokenDuration });

    return { id: user.id, token };
}
