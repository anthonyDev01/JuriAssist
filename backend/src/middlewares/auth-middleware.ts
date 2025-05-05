import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { findUserById } from "../repository/userRepository";

declare module "express-serve-static-core" {
    interface Request {
        userId: string;
    }
}

const jwtSecret = process.env.JWT_SECRET!;

export default async function verifyAuthentication(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const token = request.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        response.status(401).send({ error: "Autenticação necessária." });
        return;
    }

    try {
        const { id } = jwt.verify(token, jwtSecret) as { id: string };
        await findUserById(id);

        request.userId = id;
        next();
    } catch (error: any) {
        if (error.message === "Usuário não encontrado.") {
            response.status(403).send({
                error: "Esta conta foi desativada e não pode ser utilizada.",
            });
            return;
        }

        response.status(401).send({
            error: "Token de autenticação inválido ou expirado.",
        });
    }
}
