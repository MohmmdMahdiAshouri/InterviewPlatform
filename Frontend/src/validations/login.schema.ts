import z from "zod";

export const loginSchema = z.object({
    phone: z.string().regex(/^(?:\+98|98|0)?9\d{9}$/, "شماره تلفن معتبر نیست"),
    fullName: z
        .string()
        .min(2, "نام و نام خانوادگی باید حداقل ۲ کاراکتر باشد")
        .max(100, "نام و نام خانوادگی نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد")
        .trim()
});