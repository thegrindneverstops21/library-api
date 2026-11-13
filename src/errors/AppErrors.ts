export class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export class NotFoundError extends AppError {
    constructor(message ="Resource not found"){
        super(message, 404);
    }
}

export class BadRequestError extends AppError {
    constructor(message = "Invalid request data"){
        super(message, 400);
    }
}

export class ConflictError extends AppError {
    constructor(message = "Conflict with existing resource"){
        super(message, 409);
    }
}