import { prisma } from "../../../lib/prisma";

// POST /api/reviews - Student creates a review after a COMPLETED booking
const createReview = async (
    studentId: string,
    data: {
        bookingId: string;
        rating: number;
    }
) => {
    // Verify the booking belongs to this student and is COMPLETED
    const booking = await prisma.booking.findUnique({
        where: { id: data.bookingId },
    });

    if (!booking) throw new Error("Booking not found.");
    if (booking.studentId !== studentId)
        throw new Error("You can only review your own bookings.");
    if (booking.status !== "COMPLETED")
        throw new Error("You can only review completed sessions.");

    // Check if review already exists
    const existing = await prisma.review.findUnique({
        where: { bookingId: data.bookingId },
    });
    if (existing) throw new Error("You have already reviewed this booking.");

    if (data.rating < 1 || data.rating > 5)
        throw new Error("Rating must be between 1 and 5.");

    const review = await prisma.review.create({
        data: {
            bookingId: data.bookingId,
            tutorId: booking.tutorId,
            studentId,
            rating: data.rating,
        },
    });

    return review;
};

export const reviewService = {
    createReview,
};

