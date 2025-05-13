import { Router, Express } from "express";
import * as userService from "../services/userService";

export default function userController(app: Express) {
    const router = Router();
    router.get("/", async (req, res) => {
        try {
            const userId = req.userId;
            const user = await userService.getUserById(userId);
            res.status(200).json(user);
        } catch {
            res.status(500).json({ error: "Internal server error" });
        }
    });

    app.use("/api/user", router);
}
