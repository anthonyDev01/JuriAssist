import z from "zod";

export const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email().min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
});

export const loginSchema = z.object({
    email: z.string().email().min(1, "Email is required"),
    password: z.string().min(6, "Password is required"),
});
