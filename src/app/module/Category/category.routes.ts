import { Router } from "express";
import { categoryController } from "./category.controller";

const router = Router();

// GET /api/categories - Public
router.get("/", categoryController.getAllCategories);

export const categoryRoutes: Router = router;

