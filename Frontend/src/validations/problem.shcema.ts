import z from "zod";

export const problemSchema = z.object({
    title: z.string().min(1, "عنوان الزامی است"),
    description: z.string().min(1, "توضیحات الزامی است"),
    category: z.string().min(1, "دسته‌بندی الزامی است"),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
    visibility: z.enum(["PRIVATE", "PUBLIC"]),
    starterCodeJs: z.string().optional(),
    starterCodePython: z.string().optional(),
    starterCodeJava: z.string().optional(),
    constraints: z.string().optional(),
});