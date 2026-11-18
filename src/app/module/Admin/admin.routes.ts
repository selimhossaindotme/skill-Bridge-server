import { Router } from "express";
import { adminController } from "./admin.controller";
import { auth, UserRole } from "../../middleware/auth";

const router = Router();

// All admin routes require ADMIN role
router.use(auth(UserRole.ADMIN));

// GET  /api/admin/users
router.get("/users", adminController.getAllUsers);

// PATCH /api/admin/users/:id
router.patch("/users/:id", adminController.updateUserStatus);

// GET  /api/admin/bookings
router.get("/bookings", adminController.getAllBookings);

// GET  /api/admin/categories
router.get("/categories", adminController.getAllCategories);

// POST /api/admin/categories
router.post("/categories", adminController.createCategory);

// DELETE /api/admin/categories/:id
router.delete("/categories/:id", adminController.deleteCategory);

export const adminRoutes: Router = router;

