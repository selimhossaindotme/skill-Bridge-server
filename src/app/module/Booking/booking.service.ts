import { prisma } from "../../../lib/prisma"

// POST /api/bookings - Create new booking
const createBooking = async (studentId: string, bookingData: {
    tutorId: string;
    startTime: Date;
    endTime: Date;
    price: number;
}) => {
    const conflictingBooking = await prisma.booking.findFirst({
        where: {
            tutorId: bookingData.tutorId,
            OR: [
                {
                    startTime: { lte: bookingData.startTime },
                    endTime: { gt: bookingData.startTime },
                },
                {
                    startTime: { lt: bookingData.endTime },
                    endTime: { gte: bookingData.endTime },
                },
                {
                    startTime: { gte: bookingData.startTime },
                    endTime: { lte: bookingData.endTime },
                },
            ],
        },
    });

    if (conflictingBooking) {
        throw new Error("Tutor is not available at the requested time slot.");
    }

    const booking = await prisma.booking.create({
        data: {
            studentId,
            tutorId: bookingData.tutorId,
            startTime: bookingData.startTime,
            endTime: bookingData.endTime,
            price: bookingData.price,
            status: "PENDING",
        },
    });

    return booking;
};

// GET /api/bookings - Get current user's bookings
const getMyBookings = async (userId: string, role: string) => {
    const whereClause = role === "tutor"
        ? { tutorId: userId }
        : { studentId: userId };

    const bookings = await prisma.booking.findMany({
        where: whereClause,
        include: {
            sessions: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return bookings;
};

// GET /api/bookings/:id - Get single booking details
const getBookingById = async (bookingId: string, userId: string, role: string) => {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            sessions: true,
            reviews: true,
        },
    });

    if (!booking) {
        throw new Error("Booking not found.");
    }

    // Only the student or tutor of the booking can view it
    const isOwner =
        booking.studentId === userId || booking.tutorId === userId;
    const isAdmin = role === "admin";

    if (!isOwner && !isAdmin) {
        throw new Error("You are not authorized to view this booking.");
    }

    return booking;
};

export const bookingService = {
    createBooking,
    getMyBookings,
    getBookingById,
};
