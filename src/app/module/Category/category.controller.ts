import type { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { categoryService } from "./category.service";

// GET /api/categories
const getAllCategories = catchAsync(async (req: Request, res: Response) => {
    const categories = await categoryService.getAllCategories();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Categories retrieved successfully",
        data: categories,
    });
});

export const categoryController = {
    getAllCategories,
};

