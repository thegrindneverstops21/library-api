import { Request, Response } from "express";
import { Author } from "../types";
import { authors } from "../data/authors";
import { v4 as uuidv4 } from "uuid";

export function createAuthor(req: Request, res: Response): void {
    const { name, bio, birthYear } = req.body;

    const newAuthor: Author = {
        id: uuidv4(),
        name,
        bio,
        birthYear,
    };

    authors.push(newAuthor);
    res.status(201).json(newAuthor);
}

export function getAuthors(req: Request, res: Response): void {
    res.status(200).json(authors);
}

export function getAuthorById(req: Request, res: Response): void {
    const author = authors.find((a) => a.id === req.params.id);

    if(!author) {
        res.status(404).json({ message: "Author not found" });
        return;
    }

    res.status(200).json(author);
}

export function updateAuthor(req: Request, res: Response): void {
    const author = authors.find((a) => a.id === req.params.id);

    if(!author) {
        res.status(404).json({ message: "Author not found" });
        return;
    }

    const { name, bio, birthYear } = req.body;
    author.name = name ?? author.name;
    author.bio = bio ?? author.bio;
    author.birthYear = birthYear ?? author.birthYear;

    res.status(200).json(author);
}

export function deleteAuthor(req: Request, res: Response): void {
    const index = authors.findIndex((a) => a.id === req.params.id);

    if(index === -1) {
        res.status(404).json({ message: "Author not found" });
        return;
    }

    authors.splice(index, 1);
    res.status(204).send();
}