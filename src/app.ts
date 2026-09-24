import express, { Application } from "express";
import { logger } from "./middleware/logger";
import authorRoutes from "./routes/authorRoutes";
import bookRoutes from "./routes/bookRoutes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

const app: Application = express();

app.use(express.json());
app.use(logger);

app.use("/authors", authorRoutes);
app.use("/books", bookRoutes);

app.get("/", (_req, res) => {
    res.status(200).json({ message: "Library API is running"});
});

app.use(errorHandler);
app.use(notFoundHandler);

export default app;

