import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export function requestBodyValidator(schema: ZodSchema) {
    return (request: Request, response: Response, next: NextFunction) => {
        const parsedBody = schema.safeParse(request.body);
        if (!parsedBody.success) {
            const formattedErrors = parsedBody.error.errors.map((err) => ({
                field: err.path.join("."),
                message: err.message,
            }));
            response.status(400).json({ errors: formattedErrors });
            return;
        }
        next();
    };
}
