import "dotenv/config";
import express, { json } from "express";
import ragController from "./controller/ragController";
import authController from "./controller/authController";

const app = express();
const port = process.env.PORT;
app.use(json());

ragController(app);
authController(app);

app.listen(port, () => {
    console.warn(`Server listening on port ${port}`);
});
