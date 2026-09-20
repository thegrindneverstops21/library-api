export interface Author {
    id: string;
    name: string;
    bio?: string;
    birthYear?: number;
}

export interface AuthorInput {
    name: string;
    bio?: string;
    birthYear?: number;
}

export interface Book {
    id: string;
    title: string;
    authorId: string;
    year?: number;
    genre?: string;
}
export interface BookInput {
    title: string;
    authorId: string;
    year?: number;
    genre?: string;
}