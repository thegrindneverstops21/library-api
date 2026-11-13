import { Router } from "express"
import { createAuthor, deleteAuthor, getAuthorById, getAuthors, updateAuthor, getBooksByAuthor } from "../controllers/authorController";
import { validateAuthorInput } from "../middleware/validation";

const router = Router();

router.post("/", validateAuthorInput, createAuthor);
router.get("/", getAuthors);
router.get("/:id", getAuthorById);
router.put("/:id", validateAuthorInput, updateAuthor);
router.delete("/:id", deleteAuthor);
router.get("/:id/books", getBooksByAuthor);
export default router;