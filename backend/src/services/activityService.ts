import * as activityRepository from "../repository/activityRepository";
import { activityRequest } from "../types/activityRequest";

export async function saveActivity(activity: activityRequest, userId: string) {
    return await activityRepository.createActivity({ ...activity, userId });
}

export async function getActivities(
    userId: string,
    page: number,
    limit: number
) {
    return await activityRepository.getActivitiesByUserId(userId, page, limit);
}
