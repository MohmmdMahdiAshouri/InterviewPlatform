import { z } from "zod";

export const createInterviewSchema = z.object({
    title: z.string().min(1, "عنوان الزامی است"),
    problemIds: z
        .array(z.string().uuid("شناسه مسئله نامعتبر است"))
        .min(1, "حداقل یک مسئله انتخاب کنید"),
});

export const joinInterviewSchema = z.object({
    roomCode: z.string().min(1, "کد اتاق الزامی است"),
});

export const updateInterviewProblemsSchema = z.object({
    problemIds: z
        .array(z.string().uuid("شناسه مسئله نامعتبر است"))
        .min(1, "حداقل یک مسئله انتخاب کنید"),
});

export const updateInterviewStatusSchema = z.object({
    status: z.enum(["SCHEDULED", "ACTIVE", "ENDED"]),
});

export const interviewIdParamSchema = z.object({
    id: z.string().uuid("شناسه مصاحبه نامعتبر است"),
});
