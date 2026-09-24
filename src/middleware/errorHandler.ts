import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppErrors";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
    if(err instanceof AppError) {
        res.status(err.statusCode).json({error: err.message });
        return
    }

    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
}

export function notFoundHandler(req: Request, res: Response): void {
    res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
}