import { prisma } from "../../../lib/prisma";

// GET /api/tutors - all tutors with optional filters
const getAllTutors = async (query: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    page?: number;
    limit?: number;
}) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const whereClause: any = {};

    if (query.search) {
        whereClause.OR = [
            { bio: { contains: query.search, mode: "insensitive" } },
            { qualifications: { contains: query.search, mode: "insensitive" } },
        ];
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
        whereClause.hourlyRate = {};
        if (query.minPrice !== undefined) whereClause.hourlyRate.gte = Number(query.minPrice);
        if (query.maxPrice !== undefined) whereClause.hourlyRate.lte = Number(query.maxPrice);
    }

    if (query.category) {
        whereClause.tutorCategories = {
            some: {
                category: {
                    name: { equals: query.category, mode: "insensitive" },
                },
            },
        };
    }

    const [tutors, total] = await Promise.all([
        prisma.tutorProfile.findMany({
            where: whereClause,
            include: {
                tutorCategories: {
                    include: { category: true },
                },
                availableTimeSlots: {
                    where: { isAvailable: true },
                },
            },
            skip,
            take: limit,
        }),
        prisma.tutorProfile.count({ where: whereClause }),
    ]);

    return { tutors, total, page, limit };
};

// GET /api/tutors/:id - single tutor details
const getTutorById = async (tutorId: string) => {
    const tutor = await prisma.tutorProfile.findUnique({
        where: { id: tutorId },
        include: {
            tutorCategories: {
                include: { category: true },
            },
            availableTimeSlots: true,
        },
    });

    if (!tutor) throw new Error("Tutor not found.");
    return tutor;
};

// PUT /api/tutor/profile - update tutor profile (tutor only)
const updateTutorProfile = async (
    userId: string,
    data: {
        bio?: string;
        qualifications?: string;
        experience?: number;
        price?: number;
        hourlyRate?: number;
        categoryIds?: string[];
    }
) => {
    const existing = await prisma.tutorProfile.findUnique({ where: { userId } });

    if (!existing) {
        // Create new profile if doesn't exist
        const { categoryIds, ...profileData } = data;

        const profile = await prisma.tutorProfile.create({
            data: {
                userId,
                bio: profileData.bio ?? "",
                qualifications: profileData.qualifications ?? "",
                experience: profileData.experience ?? 0,
                price: profileData.price ?? 0,
                hourlyRate: profileData.hourlyRate ?? 0,
                ...(categoryIds && categoryIds.length > 0
                    ? {
                          tutorCategories: {
                              create: categoryIds.map((cId) => ({
                                  category: { connect: { id: cId } },
                              })),
                          },
                      }
                    : {}),
            },
            include: { tutorCategories: { include: { category: true } } },
        });

        return profile;
    }

    const { categoryIds, ...profileData } = data;

    // Update categories: delete old, create new
    if (categoryIds) {
        await prisma.tutor_Category.deleteMany({ where: { tutorId: existing.id } });
    }

    const profile = await prisma.tutorProfile.update({
        where: { userId },
        data: {
            ...profileData,
            ...(categoryIds && categoryIds.length > 0
                ? {
                      tutorCategories: {
                          create: categoryIds.map((cId) => ({
                              category: { connect: { id: cId } },
                          })),
                      },
                  }
                : {}),
        },
        include: { tutorCategories: { include: { category: true } } },
    });

    return profile;
};

// PUT /api/tutor/availability - update availability slots
const updateAvailability = async (
    userId: string,
    slots: { startTime: string; endTime: string }[]
) => {
    const tutorProfile = await prisma.tutorProfile.findUnique({ where: { userId } });
    if (!tutorProfile) throw new Error("Tutor profile not found. Create a profile first.");

    // Replace all existing slots
    await prisma.availableTimeSlot.deleteMany({ where: { tutorId: tutorProfile.id } });

    const created = await prisma.availableTimeSlot.createMany({
        data: slots.map((slot) => ({
            tutorId: tutorProfile.id,
            startTime: new Date(slot.startTime),
            endTime: new Date(slot.endTime),
            isAvailable: true,
        })),
    });

    return { count: created.count };
};

export const tutorService = {
    getAllTutors,
    getTutorById,
    updateTutorProfile,
    updateAvailability,
};

