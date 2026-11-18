import { Router } from "express";
import { reviewController } from "./review.controller";
import { auth, UserRole } from "../../middleware/auth";

const router = Router();

// POST /api/reviews - Students only
router.post(
    "/",
    auth(UserRole.STUDENT),
    reviewController.createReview
);

export const reviewRoutes: Router = router;

