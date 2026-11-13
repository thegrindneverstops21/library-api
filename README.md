# Library API

A RESTful API for managing a community library, built with **TypeScript + Express**. It manages two resources, **Authors** and **Books** (each book belongs to an author), with full CRUD, validation, centralized error handling, and query support. Data is stored in memory, so it resets when the server restarts.

## Setup

```bash
git clone <your-repo-url>
cd library-api
npm install
npm run dev
```

Server runs on `http://localhost:3000` (override with the `PORT` env variable).

| Script          | What it does                  |
| --------------- | ----------------------------- |
| `npm run dev`   | Start with nodemon + ts-node  |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start`     | Run the compiled build        |

## Project Structure

```
src/
├── controllers/   # Request handlers (authors, books)
├── data/          # In-memory arrays
├── errors/        # AppError + NotFound/BadRequest/Conflict
├── middleware/    # logger, validate, errorHandler
├── routes/        # Route definitions
├── types/         # Author and Book interfaces
├── app.ts         # Express app setup
└── server.ts      # Entry point
```

## Data Models

**Author**
| Field | Type | Required |
|---|---|---|
| id | string (uuid) | auto |
| name | string | yes |
| bio | string | no |
| birthYear | number | no |

**Book**
| Field | Type | Required |
|---|---|---|
| id | string (uuid) | auto |
| title | string | yes |
| authorId | string | yes (must match an existing author) |
| year | number | no |
| genre | string | no |

## Endpoints

### Authors

| Method | Endpoint             | Description                 | Success |
| ------ | -------------------- | --------------------------- | ------- |
| POST   | `/authors`           | Create an author            | 201     |
| GET    | `/authors`           | List all authors            | 200     |
| GET    | `/authors/:id`       | Get one author              | 200     |
| PUT    | `/authors/:id`       | Update an author            | 200     |
| DELETE | `/authors/:id`       | Delete an author            | 204     |
| GET    | `/authors/:id/books` | List all books by an author | 200     |

**Example: create an author**

```http
POST /authors
Content-Type: application/json

{
  "name": "J.R.R. Tolkien",
  "bio": "English writer and philologist",
  "birthYear": 1892
}
```

### Books

| Method | Endpoint     | Description                        | Success |
| ------ | ------------ | ---------------------------------- | ------- |
| POST   | `/books`     | Create a book                      | 201     |
| GET    | `/books`     | List books (supports query params) | 200     |
| GET    | `/books/:id` | Get one book                       | 200     |
| PUT    | `/books/:id` | Update a book                      | 200     |
| DELETE | `/books/:id` | Delete a book                      | 204     |

**Example: create a book**

```http
POST /books
Content-Type: application/json

{
  "title": "The Hobbit",
  "authorId": "<author-uuid>",
  "year": 1937,
  "genre": "Fantasy"
}
```

### Query Parameters (`GET /books`)

| Param    | Example             | Description                             |
| -------- | ------------------- | --------------------------------------- |
| title    | `?title=The Hobbit` | Exact title match (case-insensitive)    |
| author   | `?author=tolkien`   | Partial author name match               |
| authorId | `?authorId=<uuid>`  | Exact author id                         |
| year     | `?year=1937`        | Exact year                              |
| search   | `?search=fantasy`   | Free-text search across title and genre |
| sortBy   | `?sortBy=year`      | Sort by `title`, `year`, or `authorId`  |
| order    | `?order=desc`       | `asc` (default) or `desc`               |
| page     | `?page=2`           | Page number (default 1)                 |
| limit    | `?limit=10`         | Items per page (default: all)           |

Params can be combined: `GET /books?author=tolkien&sortBy=year&order=desc&page=1&limit=5`

**Response shape**

```json
{
  "total": 12,
  "page": 1,
  "limit": 5,
  "totalPages": 3,
  "data": [ ... ]
}
```

## Validation Rules

Applied to `POST` and `PUT` on both resources.

- **Author:** `name` must be a non-empty string; `birthYear`, if given, must be a number.
- **Book:** `title` must be a non-empty string; `authorId` is required; `year`, if given, must be a number.
- A book's `authorId` must reference an existing author, otherwise `400`.
- A book with the same title (case-insensitive) and the same author cannot be created twice, otherwise `409`.

## Error Handling

All errors return JSON in the same shape:

```json
{ "error": "Author not found" }
```

| Status | Meaning      | Example cause                                                            |
| ------ | ------------ | ------------------------------------------------------------------------ |
| 400    | Invalid data | Missing `title`, non-numeric `year`, unknown `authorId`, bad query param |
| 404    | Not found    | Unknown author/book id, or unknown route                                 |
| 409    | Conflict     | Duplicate book for the same author                                       |
| 500    | Server error | Unexpected failure                                                       |

## Middleware

- **Logger:** logs timestamp, method, and URL for every request.
- **Validation:** checks request bodies before they reach controllers.
- **Error handler:** one central handler turns thrown `AppError`s into JSON responses.

## Testing with Postman

1. `POST /authors` → copy the returned `id`.
2. `POST /books` using that id as `authorId` → expect `201`.
3. `POST /books` again with the same title and author → expect `409`.
4. `POST /books` with a fake `authorId` → expect `400`.
5. `POST /books` with no `title` → expect `400`.
6. `GET /books?sortBy=year&order=desc&page=1&limit=5` → expect paginated response.
7. `GET /authors/:id/books` → expect the author's books.
8. `PUT /books/:id` with updated fields → expect `200`.
9. `DELETE /books/:id` → expect `204`, then `GET /books/:id` → expect `404`.

## Known Limitations

- Data is in memory only and is lost on restart.
- Deleting an author does not delete their books.
