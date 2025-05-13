import prisma from "../orm/prisma";
import { activityRequest } from "../types/activityRequest";

export function createActivity(data: activityRequest) {
    return prisma.activity.create({
        data,
    });
}

export async function getActivitiesByUserId(
    userId: string,
    page: number,
    limit: number
) {
    const skip = (page - 1) * limit;

    const [activities, total] = await Promise.all([
        prisma.activity.findMany({
            where: { userId },
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        }),
        prisma.activity.count({
            where: { userId },
        }),
    ]);

    return {
        data: activities,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
}
