import { z } from "zod";

export const listRoleRequestsSchema = z.object({
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
});

export const roleRequestIdParamSchema = z.object({
    id: z.string().uuid("درخواست تغییر نقش شما نامعتبر است"),
});
