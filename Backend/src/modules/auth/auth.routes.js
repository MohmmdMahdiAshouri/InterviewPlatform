import { Router } from "express";
import {
    sendOtpHandler,
    checkOtpHandler,
    verifyRefreshTokenHandler,
} from "./auth.service.js";
import {AuthGuard} from "./auth.guard.js"

export const authRoute = Router();

authRoute.post("/send-otp", sendOtpHandler);
authRoute.post("/check-otp", checkOtpHandler);
authRoute.post("/verify-refresh-token", verifyRefreshTokenHandler);
authRoute.get("/check-login", AuthGuard, (req, res) => {
    res.json(req?.user ?? {})
});
