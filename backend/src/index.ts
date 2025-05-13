import "dotenv/config";
import cors from "cors";
import express, { json } from "express";
import ragController from "./controller/ragController";
import authController from "./controller/authController";
import messageController from "./controller/messageController";
import activityController from "./controller/activityController";
import { handleException } from "./middlewares/exceptionHandlerMiddleware";
import swagger from "swagger-ui-express";
import swaggerDocs from "./swagger.json";
import userController from "./controller/userController";

const app = express();
const port = process.env.PORT;
app.use(json());
app.use(cors());

ragController(app);
authController(app);
messageController(app);
activityController(app);
userController(app);

app.use(handleException);
app.use("/swagger", swagger.serve, swagger.setup(swaggerDocs));

app.listen(port, () => {
    console.warn(`Server listening on port ${port}`);
});
