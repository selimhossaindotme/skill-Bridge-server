import type { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { bookingService } from "./booking.service";

// POST /api/bookings
const createBooking = catchAsync(async (req: Request, res: Response) => {
    const studentId = req.user!.id;
    const { tutorId, startTime, endTime, price } = req.body;

    const booking = await bookingService.createBooking(studentId, {
        tutorId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        price,
    });

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Booking created successfully",
        data: booking,
    });
});

// GET /api/bookings
const getMyBookings = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const role = req.user!.role;

    const bookings = await bookingService.getMyBookings(userId, role);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Bookings retrieved successfully",
        data: bookings,
    });
});

// GET /api/bookings/:id
const getBookingById = catchAsync(async (req: Request, res: Response) => {
    const id = req.params["id"] as string;
    const userId = req.user!.id;
    const role = req.user!.role;

    const booking = await bookingService.getBookingById(id, userId, role);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Booking details retrieved successfully",
        data: booking,
    });
});

export const bookingController = {
    createBooking,
    getMyBookings,
    getBookingById,
};
