import { Router } from "express";
import {
    sendOtpHandler,
    checkOtpHandler,
    verifyRefreshTokenHandler,
    logoutHandler,
} from "./auth.service.js";
import { AuthGuard } from "./auth.guard.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import { sendOtpSchema, checkOtpSchema } from "./auth.schema.js";

export const authRoute = Router();

authRoute.post("/send-otp", validate(sendOtpSchema), sendOtpHandler);
authRoute.post("/check-otp", validate(checkOtpSchema), checkOtpHandler);
authRoute.post("/verify-refresh-token", verifyRefreshTokenHandler);
authRoute.post("/logout", logoutHandler);
authRoute.get("/check-login", AuthGuard, (req, res) => {
    res.json(req?.user ?? {})
});
