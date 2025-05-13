import z from "zod";

export const insightRagSchema = z.object({
    insight: z.string().min(1, "Valid insight is required"),
});
