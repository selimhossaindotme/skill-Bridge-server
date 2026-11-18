import { prisma } from "../../../lib/prisma";

// GET /api/admin/users - Get all users
const getAllUsers = async (query: { page?: number; limit?: number; role?: string; status?: string }) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const whereClause: any = {};
    if (query.role) whereClause.role = query.role;
    if (query.status) whereClause.status = query.status;

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where: whereClause,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                emailVerified: true,
                createdAt: true,
            },
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        }),
        prisma.user.count({ where: whereClause }),
    ]);

    return { users, total, page, limit };
};

// PATCH /api/admin/users/:id - Update user status (ban/unban) or role
const updateUserStatus = async (
    userId: string,
    data: { status?: string; role?: string }
) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found.");

    const updated = await prisma.user.update({
        where: { id: userId },
        data: {
            ...(data.status && { status: data.status }),
            ...(data.role && { role: data.role }),
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
        },
    });

    return updated;
};

// GET /api/admin/bookings - Get all bookings
const getAllBookings = async (query: { page?: number; limit?: number; status?: string }) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const whereClause: any = {};
    if (query.status) whereClause.status = query.status;

    const [bookings, total] = await Promise.all([
        prisma.booking.findMany({
            where: whereClause,
            include: {
                sessions: true,
            },
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        }),
        prisma.booking.count({ where: whereClause }),
    ]);

    return { bookings, total, page, limit };
};

// GET /api/admin/categories - Get all categories (admin view)
const getAllCategories = async () => {
    return prisma.category.findMany({ orderBy: { name: "asc" } });
};

// POST /api/admin/categories - Create category
const createCategory = async (data: { name: string; description: string }) => {
    const category = await prisma.category.create({ data });
    return category;
};

// DELETE /api/admin/categories/:id - Delete category
const deleteCategory = async (categoryId: string) => {
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) throw new Error("Category not found.");

    await prisma.category.delete({ where: { id: categoryId } });
    return { deleted: true };
};

export const adminService = {
    getAllUsers,
    updateUserStatus,
    getAllBookings,
    getAllCategories,
    createCategory,
    deleteCategory,
};

