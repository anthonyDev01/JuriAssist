import "dotenv/config";
import express, { json } from "express";

const app = express();
const port = process.env.PORT;
app.use(json());

app.listen(port, () => {
    console.warn(`Server listening on port ${port}`)
});
