import { Express, Router } from "express";
import * as activityService from "../services/activityService";
import verifyAuthentication from "../middlewares/auth-middleware";

export default function activityController(app: Express) {
    const router = Router();
    router.use(verifyAuthentication);

    router.get("/", async (req, res, next) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const userId = req.userId;
            const activities = await activityService.getActivities(
                userId,
                page,
                limit
            );
            res.status(200).json(activities);
        } catch (error: any) {
            next(error);
        }
    });

    router.post("/", async (req, res, next) => {
        try {
            const userId = req.userId;
            const data = req.body;
            const activity = activityService.saveActivity(data, userId);
            res.status(200).json(activity);
        } catch (error: any) {
            next(error);
        }
    });

    app.use("/api/activity", router);
}
