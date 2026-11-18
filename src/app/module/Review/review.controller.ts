import type { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { reviewService } from "./review.service";

// POST /api/reviews
const createReview = catchAsync(async (req: Request, res: Response) => {
    const studentId = req.user!.id;
    const { bookingId, rating } = req.body;

    const review = await reviewService.createReview(studentId, { bookingId, rating });

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Review submitted successfully",
        data: review,
    });
});

export const reviewController = {
    createReview,
};

