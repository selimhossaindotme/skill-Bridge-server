import { prisma } from "../../../lib/prisma";

// GET /api/categories - Get all categories (public)
const getAllCategories = async () => {
    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
    });
    return categories;
};

export const categoryService = {
    getAllCategories,
};

