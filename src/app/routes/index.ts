import { Router } from "express";
import { bookingRoutes } from "../module/Booking/booking.routes";
import { tutorRoutes } from "../module/Tutor/tutor.routes";
import { tutorManagementRoutes } from "../module/Tutor/tutorManagement.routes";
import { categoryRoutes } from "../module/Category/category.routes";
import { reviewRoutes } from "../module/Review/review.routes";
import { adminRoutes } from "../module/Admin/admin.routes";

const router: Router = Router();

const modelRoutes = [
    { path: "/bookings",   router: bookingRoutes },
    { path: "/tutors",     router: tutorRoutes },
    { path: "/tutor",      router: tutorManagementRoutes },
    { path: "/categories", router: categoryRoutes },
    { path: "/reviews",    router: reviewRoutes },
    { path: "/admin",      router: adminRoutes },
];

modelRoutes.forEach((route) => {
    router.use(route.path, route.router);
});

export default router;
