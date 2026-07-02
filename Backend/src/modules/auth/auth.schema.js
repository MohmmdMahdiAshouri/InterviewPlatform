import { z } from "zod";

export const sendOtpSchema = z.object({
    phone: z
        .string()
        .trim()
        .regex(/^(?:\+98|98|0)?9\d{9}$/, "Invalid phone number")
        .transform((phone) => {
            phone = phone.replace(/\s/g, "");

            if (phone.startsWith("+98")) {
                return "0" + phone.slice(3);
            }

            if (phone.startsWith("98")) {
                return "0" + phone.slice(2);
            }

            if (phone.startsWith("9")) {
                return "0" + phone;
            }

            return phone;
        }),
    fullName: z
        .string()
        .min(2, "fullName must be at least 2 characters")
        .max(100, "fullName must be at most 100 characters")
        .trim(),
});

export const checkOtpSchema = z.object({
    phone: z
        .string()
        .trim()
        .regex(/^(?:\+98|98|0)?9\d{9}$/, "Invalid phone number")
        .transform((phone) => {
            phone = phone.replace(/\s/g, "");

            if (phone.startsWith("+98")) {
                return "0" + phone.slice(3);
            }

            if (phone.startsWith("98")) {
                return "0" + phone.slice(2);
            }

            if (phone.startsWith("9")) {
                return "0" + phone;
            }

            return phone;
        }),
    code: z.string().regex(/^\d{6}$/, "code must be exactly 6 digits"),
});
