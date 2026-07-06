export interface User {
    id: string;
    phone: string;
    fullName: string;
}

export interface SendOtpPayload {
    phone: string;
    fullName: string;
}

export interface CheckOtpPayload {
    phone: string;
    code: string;
}

export interface SendOtpResponse {
    message: string;
    code: string;
}

export interface CheckOtpResponse {
    message: string;
    accessToken: string;
}

export interface CheckLoginResponse {
    id: string;
    phone: string;
    fullName: string;
}

export interface LogoutResponse {
    message: string;
}
