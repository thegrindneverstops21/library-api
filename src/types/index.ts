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