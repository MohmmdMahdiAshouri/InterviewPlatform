import { api } from "@/src/libs/api";
import type {
    SendOtpPayload,
    CheckOtpPayload,
    SendOtpResponse,
    CheckOtpResponse,
    CheckLoginResponse,
    LogoutResponse,
} from "@/src/types/auth.type";

export async function sendOtp(data: SendOtpPayload) {
    const response = await api.post<SendOtpResponse>("/auth/send-otp", data);
    return response.data;
}

export async function checkOtp(data: CheckOtpPayload) {
    const response = await api.post<CheckOtpResponse>("/auth/check-otp", data);
    return response.data;
}

export async function verifyRefreshToken() {
    const response = await api.post<{ accessToken: string }>(
        "/auth/verify-refresh-token",
    );
    return response.data;
}

export async function checkLogin() {
    const response = await api.get<CheckLoginResponse>("/auth/check-login");
    return response.data;
}

export async function logout() {
    const response = await api.post<LogoutResponse>("/auth/logout");
    return response.data;
}
