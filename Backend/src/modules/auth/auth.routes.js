import {Router} from "express"
import sendOtpHandler from "./auth.service.js"

export const authRoute = Router()

authRoute.post("/send-otp", sendOtpHandler)