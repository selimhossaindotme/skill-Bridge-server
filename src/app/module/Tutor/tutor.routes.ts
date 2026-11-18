import { Router } from "express";
import { tutorController } from "./tutor.controller";
import { auth, UserRole } from "../../middleware/auth";

const router = Router();

// ─── Public Routes ───────────────────────────────────────────────────────────
// GET /api/tutors
router.get("/", tutorController.getAllTutors);

// GET /api/tutors/:id
router.get("/:id", tutorController.getTutorById);

export const tutorRoutes: Router = router;

