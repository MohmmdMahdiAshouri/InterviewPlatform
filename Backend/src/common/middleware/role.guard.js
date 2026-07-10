import createHttpError from "http-errors";

export function RoleGuard(...allowedRoles) {
    return (req, res, next) => {
        try {
            if (!req.user) {
                throw createHttpError(401, "وارد حساب کاربری خود بشوید");
            }

            if (!req.user.role || !allowedRoles.includes(req.user.role)) {
                throw createHttpError(403, "شما دسترسی لازم به این عملیات را ندارید");
            }

            next();
        } catch (error) {
            next(error);
        }
    };
}
