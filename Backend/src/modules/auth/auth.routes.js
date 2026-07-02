import {Router} from "express"
import {sendOtpHandler, checkOtpHandler, verifyRefreshTokenHandler} from "./auth.service.js"

export const authRoute = Router()

authRoute.post("/send-otp", sendOtpHandler)
authRoute.post("/check-otp", checkOtpHandler)
authRoute.post("/verify-refresh-token", verifyRefreshTokenHandler)