import { Router } from "express";
import { tutorController } from "./tutor.controller";
import { auth, UserRole } from "../../middleware/auth";

const router = Router();

// PUT /api/tutor/profile - Tutor only
router.put(
    "/profile",
    auth(UserRole.TUTOR),
    tutorController.updateTutorProfile
);

// PUT /api/tutor/availability - Tutor only
router.put(
    "/availability",
    auth(UserRole.TUTOR),
    tutorController.updateAvailability
);

export const tutorManagementRoutes: Router = router;

