import type { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { adminService } from "./admin.service";

// GET /api/admin/users
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const { page, limit, role, status } = req.query;
    const result = await adminService.getAllUsers({
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20,
        role: role as string,
        status: status as string,
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Users retrieved successfully",
        meta: { page: result.page, limit: result.limit, total: result.total },
        data: result.users,
    });
});

// PATCH /api/admin/users/:id
const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
    const id = req.params["id"] as string;
    const updated = await adminService.updateUserStatus(id, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User updated successfully",
        data: updated,
    });
});

// GET /api/admin/bookings
const getAllBookings = catchAsync(async (req: Request, res: Response) => {
    const { page, limit, status } = req.query;
    const result = await adminService.getAllBookings({
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20,
        status: status as string,
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "All bookings retrieved successfully",
        meta: { page: result.page, limit: result.limit, total: result.total },
        data: result.bookings,
    });
});

// GET /api/admin/categories
const getAllCategories = catchAsync(async (req: Request, res: Response) => {
    const categories = await adminService.getAllCategories();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Categories retrieved successfully",
        data: categories,
    });
});

// POST /api/admin/categories
const createCategory = catchAsync(async (req: Request, res: Response) => {
    const category = await adminService.createCategory(req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Category created successfully",
        data: category,
    });
});

// DELETE /api/admin/categories/:id
const deleteCategory = catchAsync(async (req: Request, res: Response) => {
    const id = req.params["id"] as string;
    const result = await adminService.deleteCategory(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Category deleted successfully",
        data: result,
    });
});

export const adminController = {
    getAllUsers,
    updateUserStatus,
    getAllBookings,
    getAllCategories,
    createCategory,
    deleteCategory,
};

