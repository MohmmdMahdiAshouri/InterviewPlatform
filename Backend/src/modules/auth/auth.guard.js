import { prisma } from "../../configs/prisma.js";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

export async function AuthGuard(req, res, next) {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            throw createHttpError(401, "login on your account");
        }

        const [bearer, token] = authorization.split(" ");

        if (bearer?.toLowerCase() !== "bearer" || !token) {
            throw createHttpError(401, "login on your account");
        }

        const verified = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        if (!verified?.userId) {
            throw createHttpError(401, "invalid token");
        }

        const user = await prisma.user.findUnique({
            where: {
                id: verified.userId,
            },
        });

        if (!user) {
            throw createHttpError(401, "user not found");
        }

        req.user = {
            id: user.id,
            phone: user.phone,
            fullName: user.fullName,
            role: user.role,
        };

        next();
    } catch (error) {
        next(error);
    }
}
