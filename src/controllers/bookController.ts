import { Request, Response } from "express";
import {v4 as uuidv4 } from "uuid";
import { authors } from "../data/authors";
import { books } from "../data/books";
import { Book } from "../types";

export function createBook(req: Request, res: Response): void {
    const { title, authorId, year, genre } = req.body;

    const authorExists = authors.some((a) => a.id === authorId);
    if(!authorExists) {
        res.status(400).json({error: `No author found with id '${authorId}'`});
        return;
    }

    const duplicate = books.some((b) => b.title.toLowerCase() === title.toLowerCase() && b.authorId === authorId);
    if(duplicate) {
        res.status(400).json({error: `Book with title '${title}' already exists for this author`});
        return;
    }

    const newBook: Book = {
        id: uuidv4(),
        title,
        authorId,
        year,
        genre,
    };

    books.push(newBook);
    res.status(201).json(newBook);
}

export function getBooks(req: Request, res: Response): void {
    res.status(200).json(books);
}

export function getBookById(req: Request, res: Response): void {
    const book = books.find((b) => b.id === req.params.id);

    if(!book) {
        res.status(404).json({ message: "Book not found" });
        return;
    }

    res.status(200).json(book);
}

export function updateBook(req: Request, res: Response): void { 
    const book = books.find((b) => b.id === req.params.id); 

    if(!book) {
        res.status(404).json({ error: "Book not found"});
        return
    }

    const { title, authorId, year, genre } = req.body;

    if(authorId) {
        const authorExists = authors.some((a) => a.id === authorId);
        if(!authorExists) {
            res.status(400).json({ error: `No author found with id '${authorId}'`});
            return;
        }
    }

    book.title = title ?? book.title;
    book.authorId = authorId ?? book.authorId;
    book.year = year ?? book.year;
    book.genre = genre ?? book.genre;

    res.status(200).json(book);
}

export function deleteBook(req: Request, res: Response): void {
    const index = books.findIndex((b) => b.id === req.params.id);

    if(index === -1){
        res.status(404).json({error: "Book not found" });
        return;
    }

    books.splice(index, 1);
    res.status(204).send();
}