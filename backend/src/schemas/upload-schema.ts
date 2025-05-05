import z from "zod";

export const uploadSchema = z.object({
    model: z.enum(["azure", "ollama"], {
        errorMap: () => ({
            message: "Invalid value. Expected 'azure' or 'ollama'",
        }),
    }),
});
