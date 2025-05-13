import { Express, Router } from "express";
import { createUserAccount, signIn } from "../services/authService";
import { requestBodyValidator } from "../middlewares/request-body-validator";
import { loginSchema, registerSchema } from "../schemas/auth-schema";

export default function authController(app: Express) {
    const router = Router();

    router.post(
        "/register",
        requestBodyValidator(registerSchema),
        async (req, res, next) => {
            try {
                const body = req.body;
                await createUserAccount(body);

                res.status(201).json({
                    message: "Usuário criado com sucesso.",
                });
            } catch (error: any) {
                next(error);
            }
        }
    );

    router.post(
        "/sign-in",
        requestBodyValidator(loginSchema),
        async (req, res, next) => {
            try {
                const { email, password } = req.body;
                const authData = await signIn(email, password);

                res.status(200).json(authData);
            } catch (error: any) {
                next(error);
            }
        }
    );

    app.use("/api/auth", router);
}
