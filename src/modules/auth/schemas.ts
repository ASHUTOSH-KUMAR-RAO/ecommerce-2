import z from "zod"


export const registerSchemas = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    username: z
        .string()
        .min(3, "Username must be at least 3 characters long")
        .max(64, "Username must be less than 64 characters long")
        .regex(
            /^[a-z0-9-][a-z0-9-]*[a-z0-9]$/,
            "Username can only contain lowercase letters, numbers and hyphens. It must start and end with a letter or number"
        )
        .refine(
            (val) => !val.includes("--"),
            "Username cannot contain consecutive hyphens"
        )
        .transform((val) => val.toLowerCase())
})


export const loginSchemas = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required")
})