import { Request, Response, NextFunction } from "express";
import { Author } from "../types";
import { books } from "../data/books";
import { authors } from "../data/authors";
import { v4 as uuidv4 } from "uuid";
import { NotFoundError } from "../errors/AppErrors";

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

export function getAuthorById(req: Request, res: Response, next: NextFunction): void {
    const author = authors.find((a) => a.id === req.params.id);

    if(!author) {
        next(new NotFoundError("Author not found"));
        return;
    }

    res.status(200).json(author);
}

export function updateAuthor(req: Request, res: Response, next: NextFunction): void {
    const author = authors.find((a) => a.id === req.params.id);

    if(!author) {
        next(new NotFoundError("Author not found"));
        return;
    }

    const { name, bio, birthYear } = req.body;
    author.name = name ?? author.name;
    author.bio = bio ?? author.bio;
    author.birthYear = birthYear ?? author.birthYear;

    res.status(200).json(author);
}

export function deleteAuthor(req: Request, res: Response, next: NextFunction): void {
    const index = authors.findIndex((a) => a.id === req.params.id);

    if(index === -1) {
        next(new NotFoundError("Author not found"));
        return;
    }

    authors.splice(index, 1);
    res.status(204).send();
}

export function getBooksByAuthor(req: Request, res: Response, next: NextFunction): void {
    const author = authors.find((a) => a.id === req.params.id);

    if(!author) {
        next(new NotFoundError("Author not found"));
        return;
    }

    const authorBooks = books.filter((b) => b.authorId === author.id);
    res.status(200).json(authorBooks);
}