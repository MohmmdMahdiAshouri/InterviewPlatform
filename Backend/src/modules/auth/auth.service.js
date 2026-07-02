import { prisma } from "../../configs/prisma.js";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import "dotenv/config";
import crypto from "crypto";

async function sendOtpHandler(req, res, next) {
    try {
        const { phone, fullName } = req.body;

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        let user = await prisma.user.findUnique({
            where: {
                phone,
            },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    phone,
                    fullName,
                },
            });
        }

        await prisma.otp.upsert({
            where: {
                phone,
            },

            update: {
                code,
                expiresAt: new Date(Date.now() + 1000 * 60 * 2),
                used: false,
                attempts: 0,
            },

            create: {
                phone,
                code,
                expiresAt: new Date(Date.now() + 1000 * 60 * 2),
            },
        });
        return res.status(200).json({
            message: "otp sent successfully",
            code,
        });
    } catch (error) {
        next(error);
    }
}

async function checkOtpHandler(req, res, next) {
    try {
        const { phone, code } = req.body;

        const user = await prisma.user.findUnique({
            where: { phone },
        });

        if (!user) {
            throw createHttpError(404, "user not found");
        }

        const otp = await prisma.otp.findUnique({
            where: { phone },
        });

        if (!otp) {
            throw createHttpError(404, "otp not found");
        }

        if (otp.used) {
            throw createHttpError(401, "otp already used");
        }

        if (otp.attempts >= 5) {
            throw createHttpError(429, "too many attempts");
        }

        if (Date.now() > otp.expiresAt.getTime()) {
            throw createHttpError(401, "otp expired");
        }

        if (otp.code !== code) {
            await prisma.otp.update({
                where: { phone },
                data: {
                    attempts: {
                        increment: 1,
                    },
                },
            });
            throw createHttpError(401, "invalid otp");
        }

        await prisma.otp.update({
            where: { phone },
            data: {
                used: true,
            },
        });

        const { accessToken, refreshToken } = generateTokens({
            userId: user.id,
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });

        return res.json({
            message: "logged in successfully",
            accessToken,
        });
    } catch (error) {
        next(error);
    }
}

function generateTokens({ userId }) {
    const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: "15m",
    });

    const refreshToken = jwt.sign(
        {
            userId,
            jti: crypto.randomUUID(),
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: "15d",
        },
    );

    return { accessToken, refreshToken };
}

export { sendOtpHandler, checkOtpHandler };
