import { NextFunction, Request, Response } from "express";
import { BadRequestException } from "../exceptions/badRequest";
import { NotFoundException } from "../exceptions/notFound";

import { ConflictException } from "../exceptions/conflict";

export function handleException(
    error: Error,
    _: Request,
    res: Response,
    __: NextFunction
) {
    if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ConflictException
    ) {
        res.status(error.status).json({ error: error.message });
        return;
    }

    console.log(error);
    res.status(500).json({ error: "Internal Server Error." });
}
