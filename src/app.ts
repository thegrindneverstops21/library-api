import express, { Application } from "express";
import { logger } from "./middleware/logger";

const app: Application = express();

app.use(express.json());
app.use(logger);

app.use("/authors", require("./routes/authorRoutes"));

app.get("/", (_req, res) => {
    res.status(200).json({ message: "Library API is running"});
});

export default app;

