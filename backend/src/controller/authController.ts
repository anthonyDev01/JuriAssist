import { Express, Router, Request, Response } from "express";
import { createUserAccount, signIn } from "../services/authService";
import { requestBodyValidator } from "../middlewares/request-body-validator";
import { loginSchema, registerSchema } from "../schemas/auth-schema";

export default function authController(app: Express) {
    const router = Router();

    router.post(
        "/register",
        requestBodyValidator(registerSchema),
        async (req, res) => {
            try {
                const body = req.body;
                await createUserAccount(body);

                res.status(201).json({
                    message: "Usuário criado com sucesso.",
                });
            } catch (error: any) {
                console.log(error);

                res.status(500).json({ error: "Erro inesperado." });
            }
        }
    );

    router.post(
        "/sign-in",
        requestBodyValidator(loginSchema),
        async (req, res) => {
            try {
                const { email, password } = req.body;
                const authData = await signIn(email, password);

                res.status(200).json(authData);
            } catch (error: any) {
                if (error.message === "Usuario não encontrado") {
                    res.status(404).send({
                        error: error.message,
                    });
                    return;
                }

                if (
                    error.message ===
                    "Esta conta foi desativada e não pode ser utilizada."
                ) {
                    res.status(403).send({ error: error.message });
                    return;
                }

                if (error.message === "Senha incorreta.") {
                    res.status(401).send({ error: error.message });
                    return;
                }

                console.error(error);

                res.status(500).json({ error: "Erro inesperado." });
            }
        }
    );

    app.use("/api/auth", router);
}
