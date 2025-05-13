export type activityRequest = {
    type: "upload" | "chat" | "insight" | "delete";
    description: string;
    documentName?: string;
    userId: string;
};
