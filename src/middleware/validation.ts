import { NextFunction, Request, Response } from "express";

export function validateAuthorInput(req: Request, res: Response, next: NextFunction): void {
    const { name, birthYear } = req.body;

    if(!name || typeof name !== "string" || name.trim() === "") {
        res.status(400).json({ error: "Failed 'name' is required & must be a string" });
        return;
    }

    if(birthYear != undefined && typeof birthYear !== "number") {
        res.status(400).json({ error: "Failed 'birth year' must be a number" });
        return;
    }

    next();
}

export function validateBookInput(req: Request, res: Response, next: NextFunction): void {
    const { title, authorId, year } = req.body;

    if(!title || typeof title !== "string" || title.trim() === "") {
        res.status(400).json({ error: "Failed 'title' is required and must be a string"});
        return;
    }

    if(!authorId || typeof authorId !== "string") {
        res.status(400).json({ error: "Failed 'authorId' is required and must reference an existing author"});
        return;
    }

    if(year != undefined && typeof year !== "number"){
        res.status(400).json({ error: "Failed 'year' must be a number "});
        return;
    }

    next();
}