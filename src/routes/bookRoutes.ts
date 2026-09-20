import { Router } from "express";
import { validateBookInput } from "../middleware/validation";
import { createBook, deleteBook, getBookById, getBooks, updateBook } from "../controllers/bookController";

const router = Router();

router.post("/", validateBookInput, createBook);
router.get("/", getBooks);
router.get("/:id", getBookById);
router.put("/:id", validateBookInput, updateBook);  
router.delete("/:id", deleteBook);

export default router;