import z from "zod";

export const chatRagSchema = z.object({
    message: z.string().min(1, "Valid message is required"),
});
