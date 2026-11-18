import type { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { tutorService } from "./tutor.service";

// GET /api/tutors
const getAllTutors = catchAsync(async (req: Request, res: Response) => {
    const { category, minPrice, maxPrice, search, page, limit } = req.query;

    const filters: Parameters<typeof tutorService.getAllTutors>[0] = {
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
    };
    if (category) filters.category = category as string;
    if (minPrice) filters.minPrice = Number(minPrice);
    if (maxPrice) filters.maxPrice = Number(maxPrice);
    if (search) filters.search = search as string;

    const result = await tutorService.getAllTutors(filters);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Tutors retrieved successfully",
        meta: {
            page: result.page,
            limit: result.limit,
            total: result.total,
        },
        data: result.tutors,
    });
});

// GET /api/tutors/:id
const getTutorById = catchAsync(async (req: Request, res: Response) => {
    const id = req.params["id"] as string;
    const tutor = await tutorService.getTutorById(id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Tutor retrieved successfully",
        data: tutor,
    });
});

// PUT /api/tutor/profile
const updateTutorProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const profile = await tutorService.updateTutorProfile(userId, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Tutor profile updated successfully",
        data: profile,
    });
});

// PUT /api/tutor/availability
const updateAvailability = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { slots } = req.body;

    const result = await tutorService.updateAvailability(userId, slots);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Availability updated successfully",
        data: result,
    });
});

export const tutorController = {
    getAllTutors,
    getTutorById,
    updateTutorProfile,
    updateAvailability,
};
