import { Express, Router } from "express";
import * as messageService from "../services/messagesService";
import verifyAuthentication from "../middlewares/auth-middleware";

export default function messageController(app: Express) {
    const router = Router();
    router.use(verifyAuthentication);

    router.get("/", async (req, res, next) => {
        try {
            const userId = req.userId;
            const messages = await messageService.getMessagesByUserId(userId);
            res.status(200).json(messages);
        } catch (err: any) {
            next(err);
        }
    });

    router.get("/count-assistant", async (req, res, next) => {
        try {
            const userId = req.userId;
            const contedMessages = await messageService.countAssistantMessages(
                userId
            );
            res.status(200).json({ count: contedMessages });
        } catch (err: any) {
            next(err);
        }
    });

    app.use("/api/message", router);
}
