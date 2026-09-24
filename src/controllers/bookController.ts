import { Request, Response, NextFunction } from "express";
import {v4 as uuidv4 } from "uuid";
import { authors } from "../data/authors";
import { books } from "../data/books";
import { Book } from "../types";
import { NotFoundError, BadRequestError, ConflictError } from "../errors/AppErrors";

export function createBook(req: Request, res: Response, next: NextFunction): void {
    const { title, authorId, year, genre } = req.body;

    const authorExists = authors.some((a) => a.id === authorId);
    if(!authorExists) {
        next(new BadRequestError(`No author found with id '${authorId}'`));
        return;
    }

    const duplicate = books.some((b) => b.title.toLowerCase() === title.toLowerCase() && b.authorId === authorId);
    if(duplicate) {
        next(new ConflictError(`Book with title '${title}' already exists for this author`));
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

export function getBooks(req: Request, res: Response, next: NextFunction): void {
    let result = [...books];

    const { title, author, authorId, year, search, sortBy, order, page, limit } = req.query;

    //Filter by title
    if(title) {
        result = result.filter((b) => b.title.toLowerCase() === String(title).toLowerCase());
    }

    //Filter by author id
    if(authorId) {
        result = result.filter((b) => b.authorId === String(authorId));
    }

    //filter by author name
    if(author) {
        const authorIds = authors
            .filter((a) => a.name.toLowerCase().includes(String(author).toLowerCase()))
            .map((a) => a.id);
        result = result.filter((b) => authorIds.includes(b.authorId));
    }

    //filter by year
    if(year){
        const yearNum = Number(year);
        if(isNaN(yearNum)) {
            next(new BadRequestError("Year must be a number"));
            return;
        }
        result = result.filter((b) => b.year === yearNum);
    }

    //search by title and genre
    if(search) {
        const term = String(search).toLowerCase();
        result = result.filter((b) => b.title.toLowerCase().includes(term) || (b.genre && b.genre.toLowerCase().includes(term)));
    }

    //sort
    if(sortBy) {
        const field = String(sortBy) as keyof Book;
        const validFields: (keyof Book)[] = ["title", "authorId", "year", "genre"];
        if(!validFields.includes(field)) {
            next(new BadRequestError(`Invalid sort field '${field}'`));
            return;
        }

        const direction = order === "desc" ? -1 : 1;

        result.sort((a, b) => {
            const valA = a[field];
            const valB = b[field];

            if(valA === undefined) return 1;
            if(valB === undefined) return -1;

            if(typeof valA === "string" && typeof valB === "string") {
                return valA.localeCompare(valB) * direction;
            }

            if(typeof valA === "number" && typeof valB === "number") {
                return (valA - valB) * direction;
            }
            return 0;
        });
    }

    //pagination
    const pageNum = page ? Number(page): 1;
    const limitNum = limit ? Number(limit) : result.length;

    if(isNaN(pageNum) || pageNum < 1) {
        next(new BadRequestError("Page must be a positive number"));
        return;
    }

    if(isNaN(limitNum) || limitNum < 1) {
        next(new BadRequestError("Limit must be a positive number"));
        return;
    }

    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginated = result.slice(startIndex, endIndex);

    res.status(200).json({
        total: result.length,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(result.length / limitNum),
        data: paginated,
    });
}

export function getBookById(req: Request, res: Response, next: NextFunction): void {
    const book = books.find((b) => b.id === req.params.id);

    if(!book) {
        next(new NotFoundError("Book not found"));
        return;
    }

    res.status(200).json(book);
}

export function updateBook(req: Request, res: Response, next: NextFunction): void { 
    const book = books.find((b) => b.id === req.params.id); 

    if(!book) {
        next(new NotFoundError("Book not found"));
        return
    }

    const { title, authorId, year, genre } = req.body;

    if(authorId) {
        const authorExists = authors.some((a) => a.id === authorId);
        if(!authorExists) {
            next(new BadRequestError(`No author found with id '${authorId}'`));
            return;
        }
    }

    book.title = title ?? book.title;
    book.authorId = authorId ?? book.authorId;
    book.year = year ?? book.year;
    book.genre = genre ?? book.genre;

    res.status(200).json(book);
}

export function deleteBook(req: Request, res: Response, next: NextFunction): void {
    const index = books.findIndex((b) => b.id === req.params.id);

    if(index === -1){
        next(new NotFoundError("Book not found"));
        return;
    }

    books.splice(index, 1);
    res.status(204).send();
}