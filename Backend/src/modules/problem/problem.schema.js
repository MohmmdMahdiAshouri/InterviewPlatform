import { z } from "zod";

export const createProblemSchema = z.object({
    title: z.string().min(1, "عنوان الزامی است"),
    description: z.string().min(1, "توضیحات الزامی است"),
    category: z.string().min(1, "دسته‌بندی الزامی است"),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
    visibility: z.enum(["PRIVATE", "PUBLIC"]).default("PRIVATE"),
    starterCode: z.any().optional(),
    examples: z.any().optional(),
    constraints: z.any().optional(),
});

export const updateProblemSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
    visibility: z.enum(["PRIVATE", "PUBLIC"]).optional(),
    starterCode: z.any().optional(),
    examples: z.any().optional(),
    constraints: z.any().optional(),
});

export const listPublicProblemsSchema = z.object({
    category: z.string().optional(),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
    search: z.string().optional(),
});

export const listMyProblemsSchema = z.object({
    category: z.string().optional(),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
    search: z.string().optional(),
    visibility: z.enum(["PRIVATE", "PUBLIC"]).optional(),
});

export const problemIdParamSchema = z.object({
    id: z.string().uuid("شناسه مسئله نامعتبر است"),
});
