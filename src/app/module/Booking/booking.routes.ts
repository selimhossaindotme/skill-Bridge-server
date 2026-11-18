import { Router } from "express";
import { bookingController } from "./booking.controller";
import { auth, UserRole } from "../../middleware/auth";

const router = Router();

// POST /api/bookings - Create new booking (only students)
router.post(
    "/",
    auth(UserRole.STUDENT),
    bookingController.createBooking
);

// GET /api/bookings - Get current user's bookings (students & tutors)
router.get(
    "/",
    auth(UserRole.STUDENT, UserRole.TUTOR),
    bookingController.getMyBookings
);

// GET /api/bookings/:id - Get single booking details
router.get(
    "/:id",
    auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
    bookingController.getBookingById
);

export const bookingRoutes: Router = router;
