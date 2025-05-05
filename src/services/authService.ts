import { sign } from "jsonwebtoken";
import { compare } from "bcryptjs";
import { findUserByEmail } from "../repository/userRepository";
import { createUser } from "./userService";

const jwtSecret = process.env.JWT_SECRET!;
const jwtTokenDuration: number = parseInt(process.env.JWT_TOKEN_DURATION!);

export async function createUserAccount(userData: any) {
    await createUser(userData);
}

export async function signIn(email: string, password: string) {
    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error("Usuario não encontrado");
    }

    if (!(await compare(password, user.password))) {
        throw new Error("Senha incorreta.");
    }

    const token = sign(user, jwtSecret, { expiresIn: jwtTokenDuration });
    const { password: _, ...userWithoutPassword } = user!;

    return { token, ...userWithoutPassword };
}
