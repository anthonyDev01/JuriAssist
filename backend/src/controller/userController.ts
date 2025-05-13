import { Router, Express } from "express";
import * as userService from "../services/userService";
import verifyAuthentication from "../middlewares/auth-middleware";

export default function userController(app: Express) {
    const router = Router();
    router.use(verifyAuthentication);

    router.get("/", async (req, res, next) => {
        try {
            const userId = req.userId;
            const user = await userService.getUserById(userId);
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    });

    app.use("/api/user", router);
}
